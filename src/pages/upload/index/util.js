export const BASEURL = process.env.NODE_ENV == 'production'?"":'http://192.168.12.217:8084'

export function parseParams(obj) {
  if (!obj) {
    return ''
  }
  return '?' + JSON.stringify(obj).slice(1, -1).replace(/(\:)/ig, '=').replace(/\"/ig, '').replace(/\,/ig, '&')
}

export function parseFormData(obj) {
  if (!obj) {
    return ''
  }
  let result = ''
  Object.keys(obj).forEach((it, i) => {
    result = result + `${it}=${JSON.stringify(obj[it])}&`
  })
  return result.slice(0, -1)
}

export function action({
  url,
  method,
  params,
  body,
  headers
}) {
  const totalUrl = BASEURL + url + parseParams(params)
  let bodyStr;
  if (body) {
    bodyStr = parseFormData(body)
  }

  return fetch(totalUrl, {
    method,
    body: bodyStr,
    headers
  }).then(res => res.json())
}

export function getPics({
  pageIndex,
  pageSize
}) {
  return action({
    url: '/receipt/getToBeAssociated',
    method: 'get',
    params: {
      pageSize: pageSize,
      pageNumber: pageIndex
    }
  })
}

export function parseQrcode(url) {
  return action({
    url: '/receipt/recognition',
    method: 'get',
    params: {
      imgUrl: encodeURIComponent(url)
    }
  })
}

export function editItem({
  id,
  orderNum
}) {
  return action({
    url: '/receipt/updateToBeAssociated',
    params: {
      id: id,
      deliveryOrderNumInput: orderNum
    }
  })
}

export function deleteItem({
  id,
  imgUrl
}) {
  return action({
    url: '/receipt/delImg',
    params: {
      id,
      imgUrl: encodeURIComponent(imgUrl)
    }
  })
}

export function submit(list) {
  return action({
    url: '/receipt/binding',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: {
      imgs: list
    }
  })
}