import {genApi} from '../src/api'

const url = '/service/getIpInfo.php'
const options = {
  cached: true,
  withCredentials: false,
  requestSchema: require('./req-schema.yaml'),
  responseSchema: require('./resp-schema.yaml')
}
const method = 'GET'

const token = 'token'
const lang = 'zh-CN'

interface Req {
  ip: string
}
interface Resp {
  code: number
  data: {
    ip: string
    country: string
  }
}

const getIpInfo = genApi<Req, Resp>({
  url, method, options
})


let sameIp = getIp()
getIpInfo({
  ip: sameIp
}, token, lang)
  .then(data => {
    console.log('normal response', data)
  })

// 相同的请求只发送一次
getIpInfo({
  ip: sameIp
}, token, lang)
  .then(data => {
    console.log('normal response', data)
  })

function getIp(): string {
  return [
    Math.round(Math.random() * 1000 % 254) + 1,
    Math.round(Math.random() * 1000 % 254) + 1,
    Math.round(Math.random() * 1000 % 254) + 1,
    Math.round(Math.random() * 1000 % 254) + 1
  ].join('.')
}

getIpInfo({
  ip: '不合法的 ip 格式'
}, token, lang).catch(err => {
  console.debug('json validate', err)
  console.error(err)
})