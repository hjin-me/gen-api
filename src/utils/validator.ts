/**
 * Created by huangjin on 16/4/8.
 */
const jjv = require('jjv')
interface Validator {
  defaultOptions: any
  addSchema(id: string, schema: any)
  addFormat(type: string, callback: Function)
  addType(type: string, callback: Function)
  addTypeCoercion(type: string, callback: Function)
  validate(schema: any, data: any)
}

let passwordValidate = (pwd: string): boolean => {
  if (pwd.length < 8) {
    return false
  }
  let upperR = /[A-Z]/g
  let lowerR = /[a-z]/g
  let numR = /\d/g
  let tArr = [upperR.test(pwd), lowerR.test(pwd), numR.test(pwd)]
  if (tArr.every(v => v)) {
    return true
  }
  tArr.push(pwd.replace(upperR, '').replace(lowerR, '').replace(numR, '').length > 0)
  return tArr.filter(v => v).length >= 3
}

const env = <Validator>jjv()
env.defaultOptions.useCoerce = true
env.defaultOptions.checkRequired = true

env.addFormat('password', passwordValidate)

env.addType('date', (d) => {
  return !isNaN(d.getTime())
})
let phpDateReg = /^([12]\d{3})-(0[1-9]|1[0-2])-([0-2][0-9]|3[01])(\s+([01][0-9]|2[0-4]):([0-5][0-9]|60):([0-5][0-9]|60))?$/
env.addTypeCoercion('date', function (x) {
  if (typeof x === 'string') {
    let match = x.match(phpDateReg)
    if (match) {
      let [, year = '0', month = '0', date = '0', , hour = '0', minute = '0', second = '0'] = <string[]>match
      return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(date, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10), 0)
    }
    return new Date(x)
  }
  if (typeof x === 'number') {
    if (('' + x).length < 11) {
      x = x * 1000
    }
    return new Date(x)
  }
  if (x.getTime) {
    return x
  }
  return new Date(x)
})
env.addTypeCoercion('boolean', function (x) {
  if (typeof x === 'boolean') {
    return x
  }
  return !!x
})

export const validator = env
export {passwordValidate}
