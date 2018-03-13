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