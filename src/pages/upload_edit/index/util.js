import {action, BASEURL as _BASEURL} from '../../../widgets/index'

export const BASEURL = query.projectname?`/${query.projectname}`:_BASEURL

const query = parseUrl()

export function parseUrl(){
  const url = window.location.href
  const decodeUrl = decodeURIComponent(url)
  const place_ask = decodeUrl.indexOf('?')
  const search = decodeUrl.slice(place_ask+1)
  const partList = search.split('&')
  const result = {}
  partList.forEach(it=>{
    const spart = it.split('=')
    const pro = spart[0]
    const val = spart[1]==undefined?true:spart[1]
    if (result[pro]) {
      if (result[pro] instanceof Array) {
        result[pro].push(val)
      } else {
        result[pro] = [result[pro],val]
      }
    } else {
      result[pro] = val
    }
  })
  return result
}

export function getOrderNum () {
  const search = window.location.search
  const params = (function(search){
    if (!search) {
      return
    }
    return search.split('=')[1]
  })(search)
  return params
}

export function getItem(orderNum) {
  return action({
    url: '/receipt/editReceipt',
    method: 'get',
    params: {
      deliveryOrderNum: orderNum
    }
  })
}

export function uploadImg(orderNum) {
  return action({
    url: '/receipt/uploadFile',
    method: 'get',
    params: {
      deliveryOrderNum: orderNum
    }
  })
}

export function noReceipt(orderNum, exist) {
  return action({
    url: '/receipt/noneReceipt',
    method: 'get',
    params: {
      deliveryOrderNum: orderNum,
      exist
    }
  })
}

export function changeImg(imgId) {
  return action({
    url: '/receipt/uploadFile',
    method: 'get',
    params: {
      imgId: imgId
    }
  })
}

export function deleteImg(imgId,imgUrl) {
  return action({
    url: '/receipt/delImg',
    method: 'get',
    params: {
      id: imgId,
      imgUrl
    }
  })
}
