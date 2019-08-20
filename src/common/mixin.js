import api from '@/api'
import Dict from '@/util/dict.js'
import _ from "lodash";
import { _toArray_ } from './util'

const _DICT_SERVE_ = [
    "HywEmissionStandard",
    "HywSellState",
    "HywManufacturer"
]


export const baseMixin = {
    data() {
        return {
            cargoList: [],
            specificationsList: [],
            materialList: [],
            productNameList: [],
            originPlaceList: [],
            deliveryStoreList: [],
            pilePositionList: []
        }
    },
    methods: {
        async _getAllBaseInfo() {
            let _this = this;
            const response = await api.getAllBaseInfo()
            switch (response.code) {
                case Dict.SUCCESS:
                    Object.keys(response.data).forEach((item) => {
                        _this[item.slice(0, -3)+'List'] = _toArray_(response.data[item])
                    })
                    break;
                default:
                    break;
            }
        }
    },
    created() {
        this._getAllBaseInfo()

    }
}

export const bankMixin = {
    data() {
        return {
            bankList: [],
        }
    },
    methods: {
        async _getBankList() {
            const res = await api.getBankList()
            switch (res.code) {
                case Dict.SUCCESS:
                    this.bankList = res.data.map((item) => {
                        return {
                            value: item.id,
                            label: item.affiliateBank
                        }
                    })
                    break;
                default:
                    break;
            }
        }
    },
    created() {
        this._getBankList()

    }
}


export const dictMixin = {
    data() {
        return {
            HywEmissionStandardList: [],
            HywSellStateList: [],
            HywManufacturerList:[]
        }
    },
    methods: {
        async _getValidList() {
            let that = this
            const res = await api.getValidList({
                entryCodes: _DICT_SERVE_.join(),
                tenantId: 'hlyc'
            })
            switch (res.code) {
                case Dict.SUCCESS:
                   res.data.forEach((obj)=>{
                       that[obj.entryCode+'List'] =  obj.items.map((item)=>{
                           return {
                            id:item.id,
                            name:item.text
                           }
                       })
                   })
                    break;
                default:
                    break;
            }
        }
    },
    created() {
        this._getValidList()

    }    
}

export const classMixin = {
    data() {
        return {
            firstClassList: [],
            secondClassList:[]
        }
    },
    methods: {
        _handleClass(arr) {
            if (!arr || !arr.length) {
              return [];
            }
            if (arr.length) {
              arr.forEach(item => {
                if (!item.parentId) {
                  item.parentId = "top";
                }
              });
            }
            let group = _.groupBy(arr, "parentId");
            let top = group.top;
            top.forEach(item => {
              item.children = group[item.id];
            });
            return top;
          },
          async _getClass() {
            const res = await this.$api.getClass();
            switch (res.code) {
              case Dict.SUCCESS:
                this.firstClassList = this._handleClass(res.data);
                break;
              default:
                this.$messageError(res.mesg);
                break;
            }
          },
    },
    created() {
        this._getClass()
    }    
}
