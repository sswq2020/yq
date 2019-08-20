import axios from 'axios'
import qs from 'qs'
import { Base64 } from '@/util/base64.js'
import { isMock } from "./mock";
var cookie = require('cookie-parse');

const env = process.env.NODE_ENV;

let baseURL = '/apis';//开发路由前缀
let loginUrl = '';

let redirectUrl = ''; //跳转到登录页的路由
let cookies = cookie.parse(document.cookie);
let Authorization = cookies.HLETTYPE + ' ' + cookies.HLETID
let uploadUrl = '/apis';
let validUrl = 'http://10.1.15.106:8102';

let oilURL = '';


// window.globelApi2 = 'http://10.1.15.106:8445'//test环境
// window.globelApi2 = 'http://192.168.4.16:25089'//建波
//  window.globelApi2 = 'http://192.168.4.16:25083'//冬菜

//根据不同的环境打包不同的接口
switch (env) {
    case 'development':
        baseURL = '/api';
        redirectUrl = 'http://localhost:8080/';
        loginUrl = 'http://localhost:3000/index.html';
        oilURL = ''
        break;
    case 'production':
        loginUrl = 'https://login.hletong.com/';
        redirectUrl = 'https://cloudStorage.hletong.com/';
        oilURL = ''
        break;
    case 'test':
        baseURL = 'http://10.1.15.106:8445';
        redirectUrl = 'http://oilhui.hlet.com';
        loginUrl = 'http://login.hlet.com';
        oilURL = 'oilhui'
        break;
    default:
        break;

}

const goLogin = () => {
    if (env == 'development') {
        window.VueApp.$router.push({
            name: 'login'
        })
    } else {
        window.location.href = loginUrl + '?redirectUrl=' + redirectUrl;
    }
}


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
                url: "/auth/oauth/token",
                method: 'post',
                data: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'Authorization': Authorization
                }
            }).then(res => {
                /*
                * 变量保存token，减少每次访问localstorage的消耗
                * */
                var cookie = 'HLETID=' + res.value + ';path=/;domain=hletong.com'
                var cookie2 = 'HLETTYPE=' + res.tokenType + ';path=/;domain=hletong.com'
                document.cookie = cookie
                document.cookie = cookie2
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
    // #region 根据userId判断角色是货主还是仓库管理人员
    getUserRole(userId) {
        return fetch('/system/manage/user/getUserRole', { userId }, 'get')
    },

    // #region  字典项
    /**
     * @author sswq
     * @description 查询所有基础信息下拉数据源
     * */
    getAllBaseInfo() {
        return fetch(oilURL + '/web/yc/inventory/transfer/base', '', 'get')
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
        return fetch(oilURL + '/web/yc/bank/info', params, 'get')
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
