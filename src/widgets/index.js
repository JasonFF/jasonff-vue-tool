const _BASEURL = process.env.NODE_ENV == 'production'?"":'http://192.168.12.217:8084'

const query = parseUrl()

export const BASEURL = query.projectname?`/${query.projectname.replace('/','')}`:_BASEURL

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