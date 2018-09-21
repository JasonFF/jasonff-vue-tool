import {action, BASEURL as _BASEURL} from '../../../widgets/index'

export const BASEURL = _BASEURL

function parseUrl(url){
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
  return  parseUrl(window.location.href).num
}

export function getOrderId() {
  return  parseUrl(window.location.href).id
}

export function getItem(orderId) {
  return action({
    url: '/receipt/editReceipt',
    method: 'get',
    params: {
      deliveryOrderId: orderId
    }
  })
}

export function uploadImg(orderNum, orderId) {
  return action({
    url: '/receipt/uploadFile',
    method: 'get',
    params: {
      deliveryOrderNum: orderNum,
      deliveryOrderId: orderId
    }
  })
}

export function noReceipt(orderId, exist) {
  return action({
    url: '/receipt/noneReceipt',
    method: 'get',
    params: {
      deliveryOrderId: orderId,
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
