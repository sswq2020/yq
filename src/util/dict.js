const DICT = {};
/** 成功 */
DICT.SUCCESS = '000000';
/** 导入 */
DICT.IMPORT = '10000';
/** 集配平台 */
DICT.JPPT_PLANT = '10010';
/** 电商平台 */
DICT.BUSINESS_ONLINE_PLANT = '10020';


DICT.APP_INFO = {
    [DICT.IMPORT]:'导入',
    [DICT.JPPT_PLANT]:'集配平台',
    [DICT.BUSINESS_ONLINE_PLANT]:'电商平台'
}


/**买房会员*/
DICT.BUYER_VIP = '2'
/**卖房会员*/
DICT.SELLER_VIP = '1'

/**会员类型*/
DICT.VIP_TYPE = {
    [DICT.BUYER_VIP]: "买方会员",
    [DICT.SELLER_VIP]: "卖方会员"
}

/**会员状态禁用*/
DICT.VIP_STATUS_FROZEN = '0'
/**会员状态正常*/
DICT.VIP_STATUS_NORMAL = '1'

/**会员状态 */
DICT.VIP_STATUS = {
    [DICT.VIP_STATUS_NORMAL]: "正常",
    [DICT.VIP_STATUS_FROZEN]: "禁用",
}

/**线上协议 */
DICT.AGREE_ONLINE = "0"
/**线下协议 */
DICT.AGREE_OFFLINE = "1"
/**协议类型 */
DICT.AGREE_TYPE = {
    [DICT.AGREE_ONLINE]: "线上",
    [DICT.AGREE_OFFLINE]: "线下",
}


/**待支付 */
DICT.PAY_AWAIT = "11"
/**已付款 */
DICT.PAY_RECEIVED="50"


DICT.PAY_STATUS = {
    [DICT.PAY_AWAIT]: "待支付",
    [DICT.PAY_RECEIVED]: "已付款",
}

export default DICT;