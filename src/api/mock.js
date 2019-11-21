import pathToRegexp from "path-to-regexp";
import mockjs from "mockjs";

export const hostList = {
    // dev: '//192.168.4.16:25092/hletoil', // 易凯/
    // dev: '//192.168.4.16:25084/hletoil', // 周扬
    development: '//oil.hlet.com/hletoil', // 测试
    // dev: '//192.168.4.16:25091/hletoil', // 佘慧   13888888888   888888       admin 888888
    // dev: '//test.hletong.com/hletoil', // 佘慧   13888888888   888888       admin 888888
    test: '//test.hletong.com/apis',
    ywtest: '//apis.hletown.com',
    pro: '//yq.hletong.com',
    default: ""
};

export const imgHost = {
    // dev: '//192.168.4.16:25092/hletoil', // 易凯
    // dev: '//192.168.4.16:25084/hletoil', // 周扬
    // dev: '//192.168.4.16:25091/hletoil', // 佘慧
    development: '//oil.hlet.com/hletoil',
    test: '//10.1.15.106:8445/hletoil',
    pro: '//oil.hletong.com',
};


const IS_MOCK = true;
const hhgsURL = ""

const dict = { 'SUCCESS': "000000" }

const body = {
    "code": dict.SUCCESS,
    "mesg": "处理成功",
    "timestamp": new Date().getTime(),
    "data": {},

}

const body_fail = {
    "code": "HL070002000",
    "data": {
        "failMap": {
            "key1": "系统错误1",
            "key2": "系统错误2",
            "key3": "系统错误3",
            "key4": "系统错误4",
        },
        successList: [],
    },
    "mesg": "系统错误"
}

const pageMemberList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "phone": "@INTEGER(13012819898,18912819898)",
    "name": "@CTITLE(7,9)公司",
    "username": "@CNAME(2,3)",
    "telNo": "@INTEGER(13012819898,18912819898)",
    "address": '@PROVINCE()@CITY()@CTITLE(2,10)@INTEGER(1,100)号',
    "grantTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "state": "@PICK('0','1')",  // 1正常 0禁止
    "userId": "@INTEGER(1,2019690999)",  // 会员id
}

const InfoList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "createdTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "fuelVolume": "@INTEGER(1,20)", // 加油加气量
    "gsName": "@CTITLE(2)加油站", // 加油站名称
    "modelType": "@PICK('0','1')", // 油品类型
    "oilMemberPrice": "@INTEGER(1,20)", //会员价
    "oilModelName": "@PICK('92','95','98')", // 油品名称
    "oilRetailPrice": "@INTEGER(1,20)", //零售价
    "oilUnit": "@PICK('kg','L')", //单位
    "totalPrice": "@INTEGER(1,20)", // 总价
    "userId": "@INTEGER(1,200009)", // 车主用户ID
    "userPlate": "苏L@INTEGER(100,999)" //车牌号
}

const adjustOilHistoryList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "applyTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "effectTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "gsId": "@INTEGER(1,2019690999)",
    "gsName": "@CTITLE(2)加油站",
    "gsOilModelId": "@INTEGER(1,200009)",
    "oilMemberAgio": "@float(0.5,0.99)",
    "oilMemberDiscount": "@INTEGER(1,200009)",
    "oilMemberPrice": "@float(6,7)",
    "oilModelName": "@PICK('92','95','98')",
    "oilRetailPrice": "@float(6,7)"
}

const ModelList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "oilModelName": "@INTEGER(92,98)#V",
    "oilModelDesc": "@CTITLE(8)",
    "oilUnit": "@PICK('kg','L')",
    "isDefault":"@PICK('0','1')",
    "isBan":"@PICK('0','1')",
}

const adjustApplyList = {
    "id|+1": "@INTEGER(1,2019690999)",
    modelType:"@PICK('0','1')", // 0油 1气
    effectPrice: 9, //生效价格
    effectTime: new Date().getTime(), //生效时间
    gsId: "10699e52cd174cd0a8d7e1a4d699753d",
    isSelected: "0",
    oilChangeType: "@PICK('0','1')", // 调价方式 0折扣比例 1折扣金额
    oilMemberAgio: "@INTEGER(1,99)", //会员折扣
    oilMemberDiscount: "@INTEGER(1,99)", //会员优惠
    oilMemberPrice: 9, //会员价
    oilModelId: "@INTEGER(1,2019690999)",
    oilModelName: "@PICK('0号','气1','气2')", // 油气品分类
    oilRetailPrice: "@INTEGER(200,300)", //  零售价
    oilRetailWarn: "@INTEGER(1,99)",
    oilUnit: "L", //单位
}

const invoiceAddress = {
    invoiceDto: {
      // id:null,
      invoiceName: '惠龙易通国际物流股份有限公司',
      invoiceTaxpayer: '92321100661790118F',
      invoiceAddress: '镇江市长江路758号',
      invoiceTel: '0511-85110838',
      invoiceBank: '江苏银行股份有限公司镇江一泉支行',
      invoiceBankCode: '00025727045012',
    },
    receiveAddressDto: {
      //  id:123213,
      receivingAddressPerson: '许扬',
      receivingAddressTel: '18012129898',
      receivingAddress: '江苏省镇江市长江路758号惠龙易通国际物流股份有限公司',
    },
};


const FeaturePageList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "fsIcon":"6F515C38C1AE4ECEB31392300FCE2A2E", // 图片fileId
    "fsIconUrl":"//test.hletong.com/hhgs-test/action/hletong/file/gasDownload?file_id=6F515C38C1AE4ECEB31392300FCE2A2E",
    "fsName": "@PICK('11','12','13','18')",
    "isBan":"@PICK('0','1')"
}

/**
 * @sswq 加油站管理/票据对账列表
 */
const billCheckList = {
    'id|+1': 1,
    month: '@INTEGER(1,12)', // 月份
    billSum: '￥@INTEGER(10000,30000)', // 发票金额
    check: '@PICK("0", "1")',
};


const gasStationList = {
	"id|+1": "@INTEGER(1,2019690999)",
    name:"@CTITLE(2)", // 公司名称
    userId:"@INTEGER(1,2019690999)", // 公司id    
    gsName: "程清加油站", // 加油站名称
    gsPhone: "18021219822", // 加油站电话
    gsContact: "程清", // 加油站联系人
    gsEmail: "cq@hletong.com",  // 加油站邮箱
    gsQrCode: "0F770FEAD39D43C887A02164D2575303", // 二维码fileId
    gsLatitude: 32.172366, // 加油站经度
    gsLongitude: 119.374228, // 加油站纬度
    contactPhone: "18021219822", // 联系人电话
    gsProvinceId:"34324", // 省id(区号)
    gsProvinceName: "江苏省", //省
    gsCityId: "32432",
    gsCityName: "镇江市",
    gsRegionId:"32432", // 区id(区号)
    gsRegionName:"润州区", //加油站区名
    gsDetailAddress: "金山物流园", // 加油站详细地址
    gsBusinessTime:"全天", // 营业开始时间
    isMemberOnline:'@PICK("0", "1")',   // 是否开通e商茂通(1开通，0未开通)
    adminCard: "320921199205059118",
    adminName: "程清",
    createTime: 1561071704000,
    deleted: 0,
    editTime: 1562223626000,
    isBan: '@PICK("0", "1")',
    isBanText: "激活",
    memberName: "18021219822",
}

const dealDueForeWarnList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "mock1": "@INTEGER(13012819898,18912819898)",
    "name": "@CTITLE(7,9)公司",
    "username": "@CNAME()",
    "gsName":"@CTITLE(7,9)加油站",
    "agreementName": "@PICK('买家','采购','卖家')入会协议",
    "dueTime": '@DATE("yyyy-MM-dd")'

}

const pageSellerList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "phone": "@INTEGER(13012819898,18912819898)",
    "name": "@CTITLE(7,9)公司",
    "mock4": "@INTEGER(13012819898,18912819898)",
    "address": '@PROVINCE()@CITY()@CTITLE(2,10)@INTEGER(1,100)号',
    "settledTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "state": "@PICK('0','1')",  // 1正常 0禁止
    "userId": "@INTEGER(1,2019690999)",  // 会员id
}

const EnterpriseList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "extInfo": {
        "address": '@PROVINCE()@CITY()@CTITLE(2,10)@INTEGER(1,100)号', // 地址
        "bizIdNo": "@INTEGER(321102199108120001,321102200208120034)",  //业务联系人身份证号
        "bizName": "@CNAME()", //业务联系人名称
        "city": "@CITY()", // 所属市
        "county": "@COUNTY()", // 所属区/县
        "creditCode": "@INTEGER(321102199108120001,321102200208120034)", // 统一社会信用代码
        "effectiveDt": '@DATE("yyyy-MM-dd")', //营业生效日期
        "entType_": "@PICK('股份有限公司','有限责任公司')", // 企业类型Text
        "expireDt": '@DATE("yyyy-MM-dd")', // //营业到期日期
        "legalPersonName": "@CNAME()", // 法人姓名
        "name": "@CNAME()", // 企业名称
        "province": "@PROVINCE()", //所属省
        "userId": "@INTEGER(1,2019690999)", //用户id
    }
}

const agreementList = {
    "agreementName": "买方@CTITLE(2)协议", // 协议名称
    "agreementTypeCode": "@PICK('0','1')", // 协议类型   0线上  1线下
    "dueTime": null, // 到期时间
    "effectTime": new Date(), // 生效时间
    "fileIdList": new Array(4).fill('984ffb1bcd4145e4951d47573f037415'), // 图片的fileId数组
    "picUrlList": new Array(4).fill('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'), // 图片的fileId数组对应的URL
    "id|+1": "@INTEGER(1,2019690999)", // 每一行的主键，但是新增的没有
}

const VIPInfoData = {
    ...EnterpriseList.extInfo,
    "agreementList|2-3": [agreementList]
}


const paramsData =
{
    classifyId: "7",
    "id": "@INTEGER(2,2019690999)",
    paraName: "@CTITLE(2,4)"
}

const paraValue =
{
    ...paramsData,
    paraValue: "@CTITLE(6,7)"
}


const cargoMap = { "1": "小红", "2": "熊安明", "c8254b4eb6154d9d91992acdf0df248a": "1", "fba7fb0eabc64ee882233e85d9b62d26": "kkkkkyinkai", "95105a94a7c5487c93616d505958c850": "test1" }
const specificationsMap = { "5d9992cab42840138a35b585e637b5e1": "25mm*20mm*30mm", "8810851ea47c414db9129f14aba557ed": "1", "b609063bb007469ab52cccc5f930c685": "11", "cc1926c4da1448739ddd8a0d3e1f82eb": "30*20*30" }
const materialMap = { "8293674dcc74426e97983b85f5bfd305": "ABC1" }
const productNameMap = { "0b8b112b5eb34d8b824c6cb5dcb5a686": "粗石油222", "b2fd07bb44d94647a7731f6cac488f62": "粗石油222", "ce78797629a448c89f2e0330de4c1ce1": "H型钢" }
const originPlaceMap = { "bc5ecc7158f44eccae90cada6e986165": "测试1" }
const deliveryStoreMap = { "bc5ecc7158f44eccae90cada6e986165": "仓库1", "bc5ecc7158f44ecc56": "仓库2" }
const pilePositionMap = { "bc5ecc7158f44eccae90cada6e986165": "区桩A", "bc5ecc7158f44ecc56": "区桩B" }

const MockRole = {
    "avatar": "",
    "avatarUrl": "",
    "locked": 0,
    "locked_": "",
    "phone": "",
    "realname": "",
    "userId": 0,
    "userInfo": {
        a: '22'
    },
    "username": ""
}

const mockRouterMap = {
    [hostList.default]: [
        // #region 系统参数

        // #region  获取用户信息
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/system/manage/user/getUser',
            result() {
                return {
                    ...body,
                    data: {
                        avatar: "https://file.hletong.com/group1/M00/00/00/CgESM10JhOeAMwkYAACpkiPEWEc863.png?token=0175c2599f38e9285a5c46f9aa563460&ts=1561431795",
                        createdBy: "admin",
                        createdTime: "2019-06-24 08:41:15.0",
                        email: "",
                        locked: 1,
                        password: "92bf7f66349ac7c8ede0aedc81f41a663c720a4510dd032991f985983dd976e5",
                        phone: "18652860219",
                        realname: "施少伟奇",
                        updatedBy: "admin",
                        updatedTime: "2019-06-24 08:41:15.0",
                        userId: "174466677793095680",
                        username: "18652860219",
                        version: "1"
                    }
                };
            }
        },
        // #endregion    

        // #region  获取用户系统跳转
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/system/manage/user/getSystems',
            result() {
                return {
                    ...body,
                    "data": [
                        {
                            "path": "http://oilhui.hlet.com",
                            "systemCode": "oilhui",
                            "systemId": "166948708439556096",
                            "systemName": "互惠互利加油加气"
                        }],
                }
            }
        },
        // #endregion    

        // #region  获取用户角色
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/userinfo/current/userinfo/get',
            result() {
                return {
                    ...body,
                    data: MockRole
                };
            }
        },
        // #endregion   

        // #endregion

        // #region  平台加注明细分页查询
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/pageTaggingQuery',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [InfoList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        },
                        "currAir": "20.000",
                        "currAirMoney": "180.000",
                        "currOil": "10.000",
                        "currOilMoney": "50.00",
                        "totleAir": "0.000",
                        "totleAirMoney": "0.000",
                        "totleOil": "0.000",
                        "totleOilMoney": "0.00",
                    },
                };
            }
        },
        // #endregion     

        // #region  加油站加注明细分页查询
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/pageTaggingHasRoleQuery',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [InfoList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        },
                        "currAir": "20.000",
                        "currAirMoney": "180.000",
                        "currOil": "10.000",
                        "currOilMoney": "50.00",
                        "totleAir": "0.000",
                        "totleAirMoney": "0.000",
                        "totleOil": "0.000",
                        "totleOilMoney": "0.00",
                    },
                };
            }
        },
        // #endregion 

        // #region  调价历史分页查询
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/oilHistory/page',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|4-5': [adjustOilHistoryList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },
                };
            }
        },
        // #endregion     

        // #region  油气站分页查询
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/gas/page',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|4-5': [gasStationList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },
                };
            }
        },
        // #endregion    

        // #region  调价申请
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/oilsPrice/page',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|4-5': [adjustApplyList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },
                };
            }
        },
        // #endregion    

        // #region  更新调价申请
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/oilsPrice/adjustPrice',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 

        // #region  开票,寄票地址信息
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/web/base/invoiceAddress/getInvoiceAddress',
            result() {
              return {
                ...body,
                data: invoiceAddress,
              };
            },
          },
        // #endregion   

        // #region  票据对账列表
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/web/base/receiptBill/getBillCheckList',
            result(params) {
              return {
                ...body,
                data: {
                    'list|4-5': [billCheckList],
                    "paginator": {
                        "currentPage": params.page,
                        "pageSize": params.pageSize,
                        "totalCount": 1000,
                        "totalPage": 1000 / params.pageSize
                    }
                },
              };
            },
          },
        // #endregion   

        // #region  基础信息

        // #region  特色服务分页
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/feature/page',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|4-5': [FeaturePageList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },
                };
            }
        },
        // #endregion    

        // #region  特色服务List
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/web/base/feature/get',
            result() {
                return {
                    ...body,
                    'data|4-5': [FeaturePageList]                       
                };
            }
        },
        // #endregion  

        // #region  激活特色服务
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/feature/active',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 

        // #region  禁用特色服务
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/feature/ban',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 
        
        // #region  新增特色服务
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/feature/add',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 

        // #region  编辑特色服务
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/feature/update',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 

        // #region  删除特色服务
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/feature/delete',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 

        // #region  油气品分类分页
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/model/page',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|4-5': [ModelList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },
                };
            }
        },
        // #endregion    

        // #region  油气品分类List(汽油类型List)
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/web/base/model/get',
            result() {
                return {
                    ...body,
                    'data|4-5':[ModelList]
                    ,
                };
            }
        },
        // #endregion  

        // #region  激活油气品分类
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/model/active',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 

        // #region  禁用油气品分类
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/model/ban',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 
        
        // #region  新增油气品分类
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/model/add',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 

        // #region  编辑油气品分类
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/model/update',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 

        // #region  删除油气品分类
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/model/delete',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 

        // #region  设置默认油气品分类
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/model/default',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 



        // #endregion  

        // #region  修改商品
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/hyw/product/product/update',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion 

        // #region  新增商品
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/hyw/product/product/add',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion         

        // #region  商品详情页/编辑查询
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/web/hyw/product/product/get',
            result(params) {
                return {
                    ...body,
                    data: {
                        id: params.id,
                        fileId: '121212',
                        firstCatalogId: 1,
                        secondCatalogId: 10,
                        emissionStandard: "0",
                        density: 'mock',
                        serialNumber: 'mock',
                        addressProvince: "@PROVINCE()",
                        manufacturerId: "0",
                        price: '23',
                        totalWeightInventory: "12",
                        sellState: "1",
                        'parameterList|3-4': [paraValue]
                    }
                };
            }
        },
        // #endregion 

        // #region  卖家会员管理列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/hyw/member/member/pageSeller',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [pageSellerList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },
                };
            }
        },
        // #endregion

        // #region  买家会员管理列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/hyw/member/member/pageBuyer',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [pageSellerList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },
                };
            }
        },
        // #endregion

        // #region  会员管理列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/member/member/page',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [pageMemberList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },
                };
            }
        },
        // #endregion

        // #region  激活加油站
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/gas/active',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion

        // #region  禁用加油站
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/gas/ban',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion

        // #region  新增加油站
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/base/gas/add',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion

        // #region  更新加油站
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/hyw/member/member/add',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion

        // #region  协议到期预警列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/agreement/pageWarn',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10-20': [dealDueForeWarnList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },
                };
            }
        },
        // #endregion

        // #region  字典项
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/web/yc/inventory/transfer/base',
            result() {
                return {
                    ...body,
                    data: {
                        "cargoMap": cargoMap,
                        "specificationsMap": specificationsMap,
                        "materialMap": materialMap,
                        "productNameMap": productNameMap,
                        "originPlaceMap": originPlaceMap,
                        "deliveryStoreMap": deliveryStoreMap,
                        "pilePositionMap": pilePositionMap
                    }
                };
            }
        },
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/web/yc/bank/info',
            result() {
                return {
                    ...body,
                    data: [
                        {
                            "affiliateBank": "中信银行",
                            "bankIphone": "15952903666",
                            "bankStatus": "0",
                            "cityId": "321100",
                            "cityName": "镇江市",
                            "createdTime": "2019-07-04 17:49:45.0",
                            "detailAddress": "长江路301号",
                            "id": "1",
                            "iphone": "15952903985",
                            "isDeleted": 0,
                            "provinceId": "320000",
                            "provinceName": "江苏省",
                            "regionId": "321111",
                            "regionName": "润州区",
                            "subbranch": "润州支行",
                            "updatedTime": "2019-07-04 17:49:48.0"
                        },
                        {
                            "affiliateBank": "中国银行",
                            "bankIphone": "15952903666",
                            "bankStatus": "0",
                            "cityId": "321100",
                            "cityName": "镇江市",
                            "createdTime": "2019-07-04 17:49:45.0",
                            "detailAddress": "长江路301号",
                            "id": "2",
                            "iphone": "15952903985",
                            "isDeleted": 0,
                            "provinceId": "320000",
                            "provinceName": "江苏省",
                            "regionId": "321111",
                            "regionName": "润州区",
                            "subbranch": "润州支行",
                            "updatedTime": "2019-07-04 17:49:48.0"
                        }

                    ]
                };
            }
        },
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/productInterface/getParameterById',
            result(params) {
                return {
                    ...body,
                    'data|3-4': [{ ...paramsData, ...{ classifyId: params.id } }]
                };
            }
        },

        // #region  企业用户分页查询
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/userinfo/enterprise/list/search',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|10': [EnterpriseList],
                        "paginator": {
                            "currentPage": params.page,
                            "pageSize": params.pageSize,
                            "totalCount": 1000,
                            "totalPage": 1000 / params.pageSize
                        }
                    },
                };
            }
        },
        // #endregion

        // #endregion     

        // 数据字段项
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/baseserve/dict/item/valid/options/get',
            result() {
                return {
                    ...body,
                    "data": [
                        {
                            "entryCode": "HywManufacturer",
                            "entryName": "生产商",
                            "items": [
                                {
                                    "disabled": false,
                                    "id": "0",
                                    "orderBy": 0,
                                    "selected": 0,
                                    "text": "生产商1"
                                },
                                {
                                    "disabled": false,
                                    "id": "1",
                                    "orderBy": 1,
                                    "selected": 0,
                                    "text": "生产商2"
                                }
                            ]
                        },
                        {
                            "entryCode": "HywEmissionStandard",
                            "entryName": "排放标准",
                            "items": [
                                {
                                    "disabled": false,
                                    "id": "0",
                                    "orderBy": 0,
                                    "selected": 0,
                                    "text": "排放标准1"
                                },
                                {
                                    "disabled": false,
                                    "id": "1",
                                    "orderBy": 1,
                                    "selected": 0,
                                    "text": "排放标准2"
                                }
                            ]
                        },
                        {
                            "entryCode": "HywSellState",
                            "entryName": "销售状态",
                            "items": [
                                {
                                    "disabled": false,
                                    "id": "0",
                                    "orderBy": 0,
                                    "selected": 0,
                                    "text": "待售中"
                                },
                                {
                                    "disabled": false,
                                    "id": "1",
                                    "orderBy": 1,
                                    "selected": 0,
                                    "text": "出售中"
                                }
                            ]
                        }
                    ]
                };
            }
        },
    ]
};

export const isMock = ({ url, methods, params = {}, host = "", version = "" }) => {
    let hasMock = {
        isMock: false
    };
    const path = version !== "" ? `/${version}url` : url;
    if (mockRouterMap[host] !== undefined) {
        mockRouterMap[host].forEach(routerObject => {
            if (routerObject.methods.toUpperCase() === methods.toUpperCase() && routerObject.isMock === true) {
                if (pathToRegexp(routerObject.router).exec(path) !== null) {
                    hasMock = { ...routerObject };
                    hasMock.mock = mockjs.mock(routerObject.result(params));
                }
            }
        });
    }
    return hasMock;
};