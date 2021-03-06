import axios from 'axios'
import qs from 'qs'
import { Base64 } from '@/util/base64.js'
import { isMock } from "./mock";
import {MessageBox} from 'element-ui';
let sessionFlag = true;
var cookie = require('cookie-parse');

const env = process.env.NODE_ENV;

let baseURL = '/apis';//开发路由前缀
let loginUrl = '';

let redirectUrl = ''; //跳转到登录页的路由
let cookies = cookie.parse(document.cookie);
let Authorization = cookies.HLETTYPE + ' ' + cookies.HLETID

let hhgsURL = '';


// window.globelApi2 = 'http://10.1.15.106:8445'//test环境
// window.globelApi2 = 'http://192.168.4.16:25089'//建波
//  window.globelApi2 = 'http://192.168.4.16:25083'//冬菜

//根据不同的环境打包不同的接口
switch (env) {
    case 'development':
        baseURL = '/api';
        redirectUrl = 'http://localhost:8080/';
        loginUrl = 'http://localhost:3000/index.html';
        hhgsURL = ''
        break;
    case 'production':
        loginUrl = 'https://login.hletong.com/';
        redirectUrl = 'https://cloudStorage.hletong.com/';
        hhgsURL = 'hlyq'
        break;
    case 'test':
        baseURL = 'http://test.hletong.com/apis/';
        redirectUrl = 'http://yq.hlet.com';
        loginUrl = 'http://login.hlet.com';
        hhgsURL = 'yq'
        break;
    case 'ywtest':
        baseURL = 'http://apis.hletown.com/';
        redirectUrl = 'http://yq.hletown.com';
        loginUrl = 'http://login.hletown.com';
        hhgsURL = 'hlyq'
        break;        
    default:
        break;

}

const goLogin = (type) => {
	switch(type){
		case 'userClick':
			if(env == 'development') {
// 
			} else {
				window.location.href = loginUrl + '?redirectUrl=' + redirectUrl;
			}
			break;
		default:
			if(sessionFlag) {
				MessageBox.confirm('您长时间未操作，会话已过期，咱们后会有期，江湖再见！','提示',{
					confirmButtonText: '确定',
                    type:'warning',
                    showClose:false,
                    showCancelButton:false
				}).then(() => {
					if(env == 'development') {
// 
					} else {
						window.location.href = loginUrl + '?redirectUrl=' + redirectUrl;
					}
				})
				sessionFlag = false;
			}
			break;
	}
};


/*
* 首先判断localStorage是否有记录 by wzd
*
* */


let timeout = 300000;
let instance = axios.create({
    baseURL: baseURL,
    timeout: timeout
});

/*
*
* 请求的预处理 by wzd
* */
instance.interceptors.request.use((config) => {
    config.headers['Authorization'] = Authorization;
    config.headers['Accept'] = '';
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
}, (error) => {
    return Promise.reject(error);
});

/*
*
* 返回的预处理 by wzd
* */
instance.interceptors.response.use(function (response) {
    // Do something with response data
    return response.data;
}, function (error) {
    // console.log(error);
    let errCode = error.message.replace(/[^0-9]/gi, '');
    if (errCode == '401') {
        goLogin();
    }
    return Promise.reject(error);
});

const formDataRequest = (url, params, methods = 'post') => {
    let formData = new FormData();
    Object.keys(params).forEach(target => {
        if (typeof params[target] !== 'string') {
            formData.append(target, JSON.stringify(params[target]));
        } else {
            formData.append(target, params[target]);
        }
    })
    const mock = isMock({ url, params: formData, methods });
    if (env == 'development' && mock.isMock === true) {
        return new Promise((resolve) => {
            resolve(mock.mock);
        });
    }

    return new Promise((resolve, reject) => {
        instance({
            url: url,
            method: methods,
            data: formData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}

/*
*
* 封装axios实例，对错误统一处理，返回成功的promise对象 by wzd
* */
const fetch = (url, params, methods = 'post') => {
    //对所有的请求进行页码的改动，新框架 by wzd
    if (params !== undefined && params.offset !== undefined && params.limit !== undefined) {
        params.offset = (params.offset - 1) * params.limit;
    }
    const mock = isMock({ url, params, methods });
    if (env == 'development' && mock.isMock === true) {
        return new Promise((resolve) => {
            resolve(mock.mock);
        });
    }
    return new Promise((resolve, reject) => {
        if (methods == 'get') {
            url = url + '?' + qs.stringify(params);
        }
        instance[methods](url, params).then(res => {
            switch (res.code) {
                case '-1':
                case '0000001':
                case '000002':
                case '010500':
                case '010002':
                case '020000':
                case '030001':
                    window.VueApp.$Message({
                        type: 'error',
                        message: res.mesg
                    })
                    break;
                case '040001':
                    goLogin();
                    break;
                default:
                    resolve(res)
                    break;
            }

        }).catch(err => {
            console.log(err);
            reject(err);
        })
    })
}
/*
*
* 封装axios实例，对错误统一处理，返回成功的promise对象
* */
const getfetch = (url, params, methods = 'post') => {
    //对所有的请求进行页码的改动，新框架 by wzd
    if (params !== undefined && params.offset !== undefined && params.limit !== undefined) {
        params.offset = (params.offset - 1) * params.limit;
    }
    return new Promise((resolve, reject) => {
        if (methods == 'get') {
            url = url + '?' + qs.stringify(params, { indices: false });
        }
        instance[methods](url, params).then(res => {
            switch (res.code) {
                case '-1':
                case '0000001':
                case '000002':
                case '010500':
                case '010002':
                case '020000':
                case '030001':
                    window.VueApp.$Message({
                        type: 'error',
                        message: res.mesg
                    })
                    break;
                case '040001':
                    goLogin();
                    break;
                default:
                    resolve(res)
                    break;
            }

        }).catch(err => {
            console.log(err)
            reject(err);
        })
    })
}

/*
*
* 封装axios实例，专门做Blob下载的 by sswq
* */
const fetchBlob = (url, params, methods = 'post') => {
    return new Promise((resolve, reject) => {
        if (methods == 'get') {
            url = url + '?' + qs.stringify(params);
        }
        instance[methods](url, params, { responseType: 'arraybuffer', headers: { ResponseFilter: false } }).then(res => { // 不加这个{responseType: 'arraybuffer'},流直接解析成字符串
            resolve(res)
        }
        ).catch(err => {
            reject(err);
        })
    })
}

export default {
    /**
     *登陆接口
     * params:{
     *    username:string,
     *    password:string,
     *    grant_type:number,
     *    client_id:number,
     *    client_secret:number
     * }
     * 登陆也的数据后端不解析json数据，用formdata by  wzd
     * **/
    login(params) {
        let formData = new FormData();
        formData.append('username', params.username);
        formData.append('password', params.password);
        formData.append('grant_type', params.grant_type);
        // formData.append('client_id', params.client_id)
        // formData.append('client_secret', params.client_secret)
        Authorization = 'Basic ' + Base64.encode('hlet-system-center:123456');
		return new Promise((resolve, reject) => {
			instance({
				url: baseURL + "/auth/oauth/token",
				method: 'post',
				data: formData,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
				}
			}).then(res => {
				/*
				* 变量保存token，减少每次访问localstorage的消耗
				* */
				Authorization = res.tokenType + ' ' + res.value;
				/*
				* 存localstorage，方便刷新界面的时候获取到token
				* */
				localStorage.setItem('token', JSON.stringify(res));
				resolve(res);
			}).catch(err => {
				reject(err);
			})
		})
    },
    goLogin() {
        goLogin();
    },
    /*
        * 获取用户信息
        * by  wulei
        * */
    getUser() {
        return fetch('/system/manage/user/getUser', {}, 'get')
    },
    /*
        * 获取系统和菜单权限
        * by  wulei
    */
    getPermissions(sid) {
        return fetch('/system/manage/user/getPermissions', { sid: sid }, 'get')
    },
    /*
        * 获取系统
        * by  wulei
    */
    getSystems() {
        return fetch('/system/manage/user/getSystems', '', 'get')
    },
    // 文件上传
    upload(params) {
        return fetch('/dfs/open/files/upload', params)
    },
    // 修改头像
    resetAvatar(params) {
        return formDataRequest('/system/manage/user/resetAvatar', params)
    },
    // 修改密码
    resetPwd(params) {
        return formDataRequest('/system/manage/user/resetPwd', params)
    },
    // 获取验证码
    getVerfyCode(params) {
        // return formDataRequest(`${validUrl}/mc-client/sms/template/smsService/sendVerifiCode`, params)
        return formDataRequest(`/sms/mc-client/sms/template/smsService/sendVerifiCode`, params)
    },
    // 校验验证码
    reseverifiCodetPwd(params) {
        // return formDataRequest(`${validUrl}/mc-client/sms/template/smsService/verifiCode`, params)
        return formDataRequest(`/sms/mc-client/sms/template/smsService/verifiCode`, params)
    },
    // #region 只有登陆后请求时自带的token获取当前会员用户信息,平台用户没有userinfo字段
    getUserRole() {
        return fetch('/userinfo/current/userinfo/get', '', 'get')
    },

    // 测试接口是否可用
    /**
     * @author sswq
     * @description 测试专用
     * */
    getTest(params) {
        return fetch(hhgsURL + '/action/gs/queryGasStationInfoPage', params, 'get')
    },

    // #region  日常管理
    /**
     * @author sswq
     * @description 平台加注明细分页查询
     * */
    getPlantFillUpDetail(params){
        return fetch(hhgsURL + '/web/pageTaggingQuery', params)
    },
    /**
     * @author sswq
     * @description 加油站加注明细分页查询
     * */
    getOilVIPFillUpDetail(params){
        return fetch(hhgsURL + '/web/pageTaggingHasRoleQuery', params)
    },
    /**
     * @author sswq
     * @description 调价申请分页查询
     * */
    getAdjustApply(params){
        return fetch(hhgsURL + '/web/base/oilsPrice/page', params)
    },
    /**
     * @author sswq
     * @description 更新调价申请
     * */    
    updateGasOilMode(params){
        return fetch(hhgsURL + '/web/base/oilsPrice/adjustPrice', params)
    },
    /**
     * @author sswq
     * @description 调价历史分页查询
     * */
    getAdjustOilHistory(params){
        return fetch(hhgsURL + '/web/base/oilHistory/page', params)
    },
    // #endregion    

    // #region 基础信息

     // #region 特色服务
    /**
     * @author sswq
     * @param params
     * @description 特色服务分页
     * */
    getFeaturePage(params) {
        return fetch(hhgsURL + '/web/base/feature/page', params)
    },
    /**
     * @author sswq
     * @description 特色服务List
     * */
    getFeatureList() {
        return fetch(hhgsURL + '/web/base/feature/get', '','get')
    },
    /**
     * @author sswq
     * @description 激活特色服务
     * */
    activeFeature(params) {
        return fetch(hhgsURL + '/web/base/feature/active', params,'get')
    },
    /**
     * @author sswq
     * @description 禁用特色服务
     * */
    banFeature(params) {
        return fetch(hhgsURL + '/web/base/feature/ban', params,'get')
    },
    /**
     * @author sswq
     * @description 新增特色服务
     * */
    addFeature(params) {
        return fetch(hhgsURL + '/web/base/feature/add', params)
    },
    /**
     * @author sswq
     * @description 编辑特色服务
     * */
    updateFeature(params) {
        return fetch(hhgsURL + '/web/base/feature/update', params)
    },
    /**
     * @author sswq
     * @description 删除特色服务
     * */
    deleteFeature(params) {
        return fetch(hhgsURL + '/web/base/feature/delete', params)
    },
     // #endregion

     // #region 油气品分类
    /**
     * @author sswq
     * @description 油气品分类分页
     * */
    getModelPage(params){
        return fetch(hhgsURL + '/web/base/model/page', params)
    },  
    /**
     * @author sswq
     * @description 油气品分类List(汽油类型List)
     * */
    getModelList(){
        return fetch(hhgsURL + '/web/base/model/get', '','get')
    },   
    /**
     * @author sswq
     * @description 激活油气品分类
     * */
    activeModel(params) {
        return fetch(hhgsURL + '/web/base/model/active', params,'get')
    },
    /**
     * @author sswq
     * @description 禁用油气品分类
     * */
    banModel(params) {
        return fetch(hhgsURL + '/web/base/model/ban', params,'get')
    },
    /**
     * @author sswq
     * @description 新增油气品分类
     * */
    addModel(params) {
        return fetch(hhgsURL + '/web/base/model/add', params)
    },
    /**
     * @author sswq
     * @description 编辑油气品分类
     * */
    updateModel(params) {
        return fetch(hhgsURL + '/web/base/model/update', params)
    },
    /**
     * @author sswq
     * @description 删除油气品分类
     * */
    deleteModel(params) {
        return fetch(hhgsURL + '/web/base/model/delete', params)
    },
    /**
     * @author sswq
     * @description 设置默认油气品分类
     * */
    defaultModel(params) {
        return fetch(hhgsURL + '/web/base/model/default', params,'get')
    },
     // #endregion 

    // #endregion 

    // #region 预警管理
    /**
     * @author sswq
     * @param params
     * @description 协议到期预警列表
     * */
    getDealDueForeWarnList(params) {
        return fetch(hhgsURL + '/web/agreement/pageWarn', params)
    },
    // #endregion 

    // #region 财务管理
    /**
     * @author sswq
     * @param params
     * @description 开票信息、寄票地址信息
     * */
    getInvoiceAddress() {
        return fetch(hhgsURL + '/web/member/receiveInvoice/get', '','get')
    },
    /**
     * @author sswq
     * @param params
     * @description 票据对账列表
     * */
    billCheckList() {
        return fetch(hhgsURL + '/web/base/receiptBill/getBillCheckList', '','get')
    },
    // #endregion

    // #region 会员管理
    /**
     * @author sswq
     * @param params
     * @description 会员管理列表
     * */
    getVIPList(params) {
        return fetch(hhgsURL + '/web/member/member/page', params)
    },
    /**
     * @author sswq
     * @description 油气站分页查询
     * */
    queryGasStation(params){
        return fetch(hhgsURL + '/web/base/gas/page', params)
    },
    /**
     * @author sswq
     * @description 查询单个油气站详细
     * */
    queryGasStationDetail(params){
        return fetch(hhgsURL + '/web/base/gas/oilStation/get', params,'get')
    },
    /**
      * @author sswq
      * @param params
      * @description 激活油气站
      * */
     activeGas(params) {
        return fetch(hhgsURL + '/web/base/gas/active', params,'get')
    },
    /**
      * @author sswq
      * @param params
      * @description 禁用油气站
      * */
     banGas(params) {
        return fetch(hhgsURL + '/web/base/gas/ban', params,'get')
    },
    /**
      * @author sswq
      * @param params
      * @description 新增油气站
      * */
    AddGas(params) {
        return fetch(hhgsURL + '/web/base/gas/add', params)
    },
    /**
      * @author sswq
      * @param params
      * @description 更新油气站
      * */
    UpdateGas(params) {
        return fetch(hhgsURL + '/web/base/gas/oilStation/edit', params)
    }, 
    /**
      * @author sswq
      * @param params
      * @description 新增油气品信息
      * */
    AddOilPrice(params) {
        return fetch(hhgsURL + '/web/base/gas/oilPrice/add', params)
    },
    /**
      * @author sswq
      * @param params
      * @description 更新油气品信息
      * */
    UpdateOilPrice(params) {
        return fetch(hhgsURL + '/web/base/gas/oilPrice/edit', params)
    }, 
    /**
      * @author sswq
      * @param params
      * @description 删除油气品信息
      * */
     DelOilPrice(params) {
        return fetch(hhgsURL + '/web/base/gas/oilPrice/delete', params)
    }, 
    /**
      * @author sswq
      * @param params
      * @description 查询油气品信息
      * */
     queryOilPrice(params) {
        return fetch(hhgsURL + '/web/base/gas/oilPrice/get', params,'get')
    }, 
    /**
     * @author sswq
     * @param params
     * @description 入会协议分页
     * */
    getAgreementList(params) {
        return fetch(hhgsURL + '/web/agreement/page', params)
    },
    /**
      * @author sswq
      * @param params
      * @description 新增入会协议
      * */
     AddAgreement(params) {
        return fetch(hhgsURL + '/web/agreement/add', params)
    },        
    /**
      * @author sswq
      * @param params
      * @description 编辑入会协议
      * */
     UpdateAgreement(params) {
        return fetch(hhgsURL + '/web/agreement/update', params)
    },  
    /**
      * @author sswq
      * @param params
      * @description 删除入会协议
      * */
     DelAgreement(params) {
        return fetch(hhgsURL + '/web/agreement/delete', params)
    }, 
    // #endregion 





    // #region  字典项
    /**
     * @author sswq
     * @description 查询所有基础信息下拉数据源
     * */
    getAllBaseInfo() {
        return fetch(hhgsURL + '/web/yc/inventory/transfer/base', '', 'get')
    },
    /**
     * @author xh
     * @description 获取字典项数据列表
     * */
    getValidList(params) {
        return fetch('/baseserve/dict/item/valid/options/get', params, 'get')
    },
    /**
     * @author xh
     * @description 获取银行列表
     * */
    getBankList(params) {
        return fetch(hhgsURL + '/web/yc/bank/info', params, 'get')
    },
    /**
     * @author sswq
     * @description 获取文件信息
     * */
    getFilesInfo(params) {
        return fetch('/dfs/open/files/info/get', params, 'get')
    },
    /**
     * @author sswq
     * @description 企业用户分页查询
     * */
    getEnterpriseList(params) {
        return fetch('/userinfo/enterprise/list/search', params)
    },
    // #endregion


}
