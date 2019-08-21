import pathToRegexp from "path-to-regexp";
import mockjs from "mockjs";

export const hostList = {
    // dev: '//192.168.4.16:25092/hletoil', // 易凯/
    // dev: '//192.168.4.16:25084/hletoil', // 周扬
    development: '//oil.hlet.com/hletoil', // 测试
    // dev: '//192.168.4.16:25091/hletoil', // 佘慧   13888888888   888888       admin 888888
    // dev: '//test.hletong.com/hletoil', // 佘慧   13888888888   888888       admin 888888
    test: '//10.1.15.106:8445',
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


const InfoList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "createdTime": '@DATE("yyyy-MM-dd HH:mm:ss")',
    "fuelVolume": "@INTEGER(1,20)",
    "gsName": "@CTITLE(2)加油站",
    "modelType": "@PICK('0','1')",
    "oilMemberPrice": "@INTEGER(1,20)",
    "oilModelName": "@PICK('92','95','98')",
    "oilRetailPrice": "@INTEGER(1,20)",
    "oilUnit": "@PICK('kg','L')",
    "totalPrice": "@INTEGER(1,20)",
    "userId": "@INTEGER(1,200009)",
    "userPlate": "苏L@INTEGER(100,999)"
}

const commodityOrderList = {
    "orderId|+1": "@INTEGER(1,2019690999)",
    "picUrl": "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
    "productPrice": "@INTEGER(1,200)", // 单价
    "productTotal": "@INTEGER(2019690999,2219690999)", // 金额
    "productWeight": "@INTEGER(3489,20196)", // 数量
    "payer": "@INTEGER(13702260943,18702260943)", // 买家
    "productName": "@CTITLE(2,4)", // 商品名称
    "serialNumber": "@INTEGER(1,2019690999)", // 商品编码
    "orderTime": '@DATE("yyyy-MM-dd HH:mm:ss")', // 发布时间
    "orderCode": "@INTEGER(6237657823644,6997657823644)", // 订单号
    "exTime": "@INTEGER(1565748967680,1568798967690)",
    "isInvalid": "@PICK('0','1')" // '0'是正常 '1'是失效
}

const dealDueForeWarnList = {
    "id|+1": "@INTEGER(1,2019690999)",
    "mock1": "@INTEGER(13012819898,18912819898)",
    "mock2": "@CTITLE(7,9)公司",
    "mock3": "@PICK('买家','采购','卖家')入会协议",
    "mock4": '@DATE("yyyy-MM-dd")'

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


const classData = [
    {
        "id": 1,
        "name": "汽油",
        "sort": "1"
    },
    {
        "id": 10,
        "name": "98",
        "parentId": "1",
        "path": "1/",
        "sort": "3"
    },
    {
        "id": 11,
        "name": "5",
        "parentId": "2",
        "path": "2/",
        "sort": "1"
    },
    {
        "id": 12,
        "name": "0",
        "parentId": "2",
        "path": "2/",
        "sort": "2"
    },
    {
        "id": 13,
        "name": "-10",
        "parentId": "2",
        "path": "2/",
        "sort": "3"
    },
    {
        "id": 14,
        "name": "-20",
        "parentId": "2",
        "path": "2/",
        "sort": "4"
    },
    {
        "id": 300,
        "name": "-300",
        "parentId": "3",
        "path": "3/",
        "sort": "5"
    },
    {
        "id": 301,
        "name": "-301",
        "parentId": "3",
        "path": "3/",
        "sort": "6"
    },
    {
        "id": 302,
        "name": "-302",
        "parentId": "3",
        "path": "3/",
        "sort": "7"
    },
    {
        "id": 400,
        "name": "-400",
        "parentId": "4",
        "path": "4/",
        "sort": "5"
    },
    {
        "id": 401,
        "name": "-401",
        "parentId": "4",
        "path": "4/",
        "sort": "6"
    },
    {
        "id": 402,
        "name": "-402",
        "parentId": "4",
        "path": "4/",
        "sort": "7"
    },
    {
        "id": 500,
        "name": "-500",
        "parentId": "5",
        "path": "5/",
        "sort": "5"
    },
    {
        "id": 501,
        "name": "-501",
        "parentId": "5",
        "path": "5/",
        "sort": "6"
    },
    {
        "id": 502,
        "name": "-502",
        "parentId": "5",
        "path": "5/",
        "sort": "7"
    },
    {
        "id": 600,
        "name": "-600",
        "parentId": "6",
        "path": "6/",
        "sort": "6"
    },
    {
        "id": 601,
        "name": "-601",
        "parentId": "6",
        "path": "6/",
        "sort": "7"
    },
    {
        "id": 602,
        "name": "-602",
        "parentId": "6",
        "path": "6/",
        "sort": "8"
    },
    {
        "id": 700,
        "name": "-700",
        "parentId": "7",
        "path": "7/",
        "sort": "7"
    },
    {
        "id": 701,
        "name": "-701",
        "parentId": "7",
        "path": "7/",
        "sort": "8"
    },
    {
        "id": 702,
        "name": "-702",
        "parentId": "7",
        "path": "7/",
        "sort": "9"
    },
    {
        "id": 2,
        "name": "柴油",
        "sort": "2"
    },
    {
        "id": 3,
        "name": "燃料类",
        "sort": "3"
    },
    {
        "id": 4,
        "name": "石脑油",
        "sort": "4"
    },
    {
        "id": 5,
        "name": "MTBE",
        "sort": "5"
    },
    {
        "id": 6,
        "name": "航空煤油",
        "sort": "6"
    },
    {
        "id": 7,
        "name": "粗白油",
        "sort": "7"
    },
    {
        "id": 8,
        "name": "92",
        "parentId": "1",
        "path": "1/",
        "sort": "1"
    },
    {
        "id": 9,
        "name": "95",
        "parentId": "1",
        "path": "1/",
        "sort": "2"
    },

]

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
    "userInfo": `${Math.random > 0.5} ? null : {a:"b"}`,
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
                            "systemName": "惠油网"
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

        // #region  订单管理列表
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/hyw/shopping/order/seller',
            result(params) {
                return {
                    ...body,
                    data: {
                        'list|4-5': [commodityOrderList],
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

        // #region  会员启用禁用
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/hyw/member/member/updateState',
            result() {
                return {
                    ...body
                };
            }
        },
        // #endregion

        // #region  获取会员信息
        {
            isMock: IS_MOCK,
            methods: 'get',
            router: '/web/hyw/member/member/get',
            result(params) {
                return {
                    ...body,
                    data: { ...VIPInfoData, userId: params.userId }
                };
            }
        },
        // #endregion

        // #region  新增会员
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

        // #region  更新会员
        {
            isMock: IS_MOCK,
            methods: 'post',
            router: '/web/hyw/member/member/update',
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
            router: '/web/hyw/member/agreement/page',
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
            router: '/productInterface/getClassify',
            result() {
                return {
                    ...body,
                    data: classData
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