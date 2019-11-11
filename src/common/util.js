import { MessageBox  } from 'element-ui';
import _ from 'lodash'

export const _toArray_ = obj =>{
    let arr = []
    for(let key in obj){
        arr.push({
            value:key,
            label:obj[key]
        })
    }
    return arr
}

export function _debounce(func, delay) {
    let timer
    return function(...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

export function requestParamsByTimeRange(Params,timeRange=[],s,e){
    let obj =_.cloneDeep(Params);
    if (timeRange && timeRange.length === 2) {
        obj[s] = timeRange[0].getTime();
        obj[e] = timeRange[1].getTime();
    }else{
        obj[s] = null;
        obj[e] = null;
    }
    return obj    
}

export function requestParamsByTimeRangeOrigin(Params,timeRange=[],s,e){
    let obj =_.cloneDeep(Params);
    if (timeRange && timeRange.length === 2) {
        obj[s] = timeRange[0]
        obj[e] = timeRange[1]
    }else{
        obj[s] = null;
        obj[e] = null;
    }
    return obj    
}


export function requestParamsByStatus(Params,arr=[],key='status'){
    let obj =_.cloneDeep(Params);
    obj[key] = arr.map((item)=>{return Number(item)})
    return obj
}

export function failHtml(obj){
    let values = Object.values(obj);
    return values.map((item)=>{
          return `<div>${item}</div>`
     }).join("")
 }
 
export function Message_fail(fn,data=[]){
    MessageBox ({
         title:"系统错误",
         dangerouslyUseHTMLString: true,
         message: fn(data),
         duration: 0,
         showClose:false,
         closeOnClickModal:false
     });
 } 

 export const handleBank_toArray_ = obj => {
     return Object.values(obj).map(item => {
         return {
             value: item.accountId,
             label: item.shortName
         }
     })
 }
 
 /* @description 将字典对象转换成相应的SELECT数据源
 * @param {Object} DictObj 字典对象
 * @returns {Array}
 * */
export const DICT_SELECT_ARR = (DictObj) => {
    return Object.keys(DictObj).map((item) => {
      return {
          value: item,
          label: DictObj[item]
      };
    });
  };
  
/* @description 将[{"0":"mock1"},{"1":"mock2"}] 需要的形式
* @returns {Array}
* */
export const _toNeedArray_ = (arr) => {
    return arr.map((item) => {
        return {
            value: Object.keys(item)[0],
            label: item[Object.keys(item)[0]]
        }
    })
    
}

/* @description 递归对象数组中,转换为需要的对象字段，专门用于云仓的十个下拉数据源的处理
* @returns {Array}
* */
export const handleFilterSelf = (arr) => {
    if (!Array.isArray(arr)) {
        return []
    }
    return arr.map(item => {
        if (item.sonSearchList && item.sonSearchList.length) {
            item.child = handleFilterSelf(item.sonSearchList)
        }
        if (item.child && item.child.length) {
            return {
                value: item.id,
                label: item.text,
                child: item.child
            }
        } else {
            return {
                value: item.id,
                label: item.text
            }
        }
    });


}

/* @description 根据value找到index
* @returns {Number}
* */
export const findIndexByValue = (arr, prop) => {
    if (!Array.isArray(arr)) {
        return -1
    }
    return arr.findIndex((item) => {
        return item.value === prop
    })
}

/* @description 根据value找到label
* @returns {String}
* */
export const findLabelByValue = (arr,id) => {
    if (!Array.isArray(arr)) {
        return null
    }
    let copy = _.clone(arr);
    const index = findIndexByValue(copy,id);
    if (index > -1) {
      return copy[index].label;
    } else {
      return null;
    }
}