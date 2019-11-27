export const resolveTreeDate = (dataTree)=>{
    const _resloveData = (data)=>{
        data.label = data.name;
        if(data.children){
            data.children.forEach((target)=>{
                _resloveData(target)
            })
        }
    }
    dataTree.forEach(target=>{
        _resloveData(target)
    })
    dataTree.forEach(target=>{
        target.disabled =true
    })
    return dataTree
}

export const getCheckId = (data) =>{
    let ids = [];
    const getId = (obj)=>{
        if(obj.checked){
            ids.push(obj.id)
        }
        if(obj.children){
            obj.children.forEach(target=>{
                getId(target)
            })
        }
    }
    data.forEach(target=>{
        getId(target)
    })
    return ids
}


export const add = (arr,obj,prop)=>{
    let processC = true;
    arr.forEach(target=>{
        if(target[prop] == obj[prop]){
            Object.keys(obj).forEach(tar=>{
                target[tar] = obj[tar]
            })
            processC = false
        }
    })
    if(processC){
        arr.push(obj)
    }
    return arr
}

export const getUrlRelativePath = () => {
    let url = document.location.toString();
    let arrUrl = url.split("//");

    let start = arrUrl[1].indexOf("/");
    let relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

    if(relUrl.indexOf("?") != -1){
        relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}

export const setglobelPermissions = (id) => {
    let token = JSON.parse(localStorage.getItem('token'))
    if(token.additionalInformation!==undefined && token.additionalInformation.permissions!==undefined && Object.prototype.toString.call(token.additionalInformation.permissions) == '[object Array]'){
        window.globelPermissions = token.additionalInformation.permissions.filter(target=>{return target.systemId == id})
        window.globelPermissionsType1 = window.globelPermissions.filter(target=>{return target.type==1})
        window.globelPermissionsType2 = window.globelPermissions.filter(target=>{return target.type==2})
        window.globelPermissionsType3 = window.globelPermissions.filter(target=>{return target.type==3}).map(target=>target.permissionValue)
    }else{
        localStorage.clear()
    }
}

export const judgeAuth = (auth) => {
    return window.globelPermissionsAuth.includes(auth);
}

export const filterProps = (origin, target) => {
    let obj = {};
    for (let o in target) {
        obj[o] = origin[o]
    }
    return obj;
}

/** 
 * @description 下载Blob流文件到Excel并且自动打开
 * @param {any} stream 流文件
 * @param {String} defualtitle 自定义Excel标题
 * @returns void 
*/
export const downloadExcel = (response, defualtitle) => {
    let b = new Blob([response],{type:"application/octet-stream;charset=utf-8"});
    const url = window.URL.createObjectURL(b);
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download',defualtitle + ".xls")
    document.body.appendChild(link)
    link.click()
}


/** 
 * @description 删除不需要的的属性
 * @param {any} obj 操作对象
 * @param {Array} keys 需要删除的对象属性数组
 * @returns obj 
*/
export const deleteProps = (obj, ...keys) => {
    if(obj === undefined || obj === null ) {
        return obj;
    }
    for(let i = 0; i < keys.length;i++){
         let key = keys[i];
         if(obj.hasOwnProperty(key)){
             delete obj[key]
         } 
    }
    return obj
}


/** 
 * @description 处理后端奇葩的时间字符串
 * @param {String} time 时间字符串
 * @param {Number} num 
*/

export const normalTime = (time,num=-2) => {
    if(!time) {
        return ""
    }
    return time.slice(0,num);
}


/** 
 * @description 百位内补零,主要用于倒计时显示
 * @param {Number} n 
*/
export const tow = (n) => {
    return n >= 0 && n < 10 ? '0' + n : '' + n;
  }

/**
 * @description 判断普通对象
 */
export function isPlainObject(val) {
return Object.prototype.toString.call(val) === '[object Object]'
}

/**
 * @description 这里只实现普通对象的深度拷贝,Lodash考虑得到太复杂,所以自己实现更方便一些
 */
export function deepMerge(...objs){
    const result = Object.create(null)
    objs.forEach(obj=>{
      if(obj){
        Object.keys(obj).forEach(key=>{
          const val = obj[key]
          if(isPlainObject(val)){
            if(isPlainObject(result[key])){
              result[key] = deepMerge(result[key],val)
            }else{
              result[key] = deepMerge(val)
            }
          }else{
            result[key] = val
          }
  
        })
      }
    })
    return result
  }  