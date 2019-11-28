const DICT = Object.create(null);
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


/***内部用户***/
DICT.INTERNAL_USER = 1;
/***会员用户***/
DICT.VIP_USER = 3;

DICT.USERTYPE = {
    [DICT.INTERNAL_USER]:'内部用户', // "平台端用户"
    [DICT.VIP_USER]:'会员用户' // "油站会员"
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

/**折扣比例 */
DICT.ADJUST_BY_DISCOUNT = '0';
/**折扣金额 */
DICT.ADJUST_BY_CHEAP = '1';
/**调价方式*/
DICT.ADJUST_PRICE_TYPE = {
   [DICT.ADJUST_BY_DISCOUNT]:"折扣比例",
   [DICT.ADJUST_BY_CHEAP]:"折扣金额"
}

DICT.BillIsNullCheckedStatus = '0';
DICT.BillIsCheckedStatus = '1';
/**到票确认状态*/
DICT.BillCheckedStatus = {
  [DICT.BillIsNullCheckedStatus]: '否',
  [DICT.BillIsCheckedStatus]: '是',
};

/**油类型*/
DICT.OIL_TYPE = "0";
/**气类型*/
DICT.GAS_TYPE = "1";

/**油品类型*/
DICT.MODELTYPE = {
    [DICT.OIL_TYPE]:"油",
    [DICT.GAS_TYPE]:"气",
}

/**千克*/
DICT.KILOGRAM = 'kg'
/**升*/
DICT.LITRE = 'L'

/**油气单位*/
DICT.MODEL_UNIT_TYPE = {
    [DICT.KILOGRAM]:DICT.KILOGRAM,
    [DICT.LITRE]:DICT.LITRE,
}


/**油气品分类正常*/
DICT.MODEL_NOT_BAN = "0"
/**油气品分类禁用*/
DICT.MODEL_BAN = "1"
/**油气品分类是否禁用*/
DICT.MODEL_STATUS = {
    [DICT.MODEL_NOT_BAN]:"正常",
    [DICT.MODEL_BAN]:"禁用",
}

/**油气品分类默认*/
DICT.MODEL_IS_DEFAULT = "1"
/**油气品分类非默认*/
DICT.MODEL_NOT_DEFAULT = "0"
/**油气品分类是否默认*/
DICT.MODEL_TOGGLE_DEFAULT = {
    [DICT.MODEL_IS_DEFAULT]:"是",
    [DICT.MODEL_NOT_DEFAULT]:"否",
}



/**特色服务正常*/
DICT.FEATURE_NOT_BAN = "0"
/**特色服务禁用*/
DICT.FEATURE_BAN = "1"
/**特色服务是否禁用*/
DICT.FEATURE_STATUS = {
    [DICT.FEATURE_NOT_BAN]:"正常",
    [DICT.FEATURE_BAN]:"禁用",
}

/**加油站状态禁用*/
DICT.GAS_STATION_STATUS_FROZEN = '1'
/**加油站状态正常*/
DICT.GAS_STATION_STATUS_NORMAL = '0'

/**加油站状态 */
DICT.GAS_STATION_STATUS = {
    [DICT.GAS_STATION_STATUS_NORMAL]: "正常",
    [DICT.GAS_STATION_STATUS_FROZEN]: "禁用",
}



export default DICT;