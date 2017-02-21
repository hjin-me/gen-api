import Dexie from 'dexie'
import {cloneDeep} from 'lodash'
export const ERR_ID = 'id should be string'
export const ERR_DATA_EXPIRED = 'data expired'

interface OnceAction {
  (...params): Promise<any>
}
interface OnceRecord {
  id: string
  expire: number
  data: any
}
class OnceDb extends Dexie {
  once: Dexie.Table<OnceRecord, string>

  constructor(name: string) {
    super(name)
    this.version(1).stores({
      once: '&id, *expire, data'
    })
  }
}

export class Once {
  private $cache = new Map()
  private db: OnceDb

  constructor(name: string = 'once') {
    this.$cache = new Map()
    this.db = new OnceDb(name)

    this.cleanExpire()
    setInterval(() => {
      this.cleanExpire()
    }, 30 * 1000)
  }

  async 'do'(id: string, action: OnceAction, cache: boolean | number) {
    if (typeof id !== 'string') {
      return await Promise.reject(ERR_ID)
    }
    let p: Promise<any> = this.$cache.get(id)
    if (p && p.then) {
      // cloneDeep 一份, 确保多个请求不会修改同一个对象
      try {
        let d = await p
        return await Promise.resolve(cloneDeep(d))
      } catch (err) {
        return await Promise.reject(err)
      }
    }

    p = (async () => {
      if (!cache) {
        // 不缓存则直接
        return await action()
      }
      // 查询异步缓存
      let value = await this.db.once.where({id}).and(data => data.expire > Date.now()).first()
      if (value) {
        return value.data
      }
      // 没有查到缓存
      this.$cache.delete(id)

      let result = await action()
      // 命中结果, 进缓存
      let expire
      // 因为前面已经判断过 cache 为假的情况, 所以现在只处理 cache 为真 或 数字时的情况

      if (typeof cache === 'boolean') {
        // 最长保存一天
        expire = Date.now() + 24 * 60 * 60 * 1000
      } else {
        expire = Date.now() + (+cache)
      }
      await this.db.once.add({
        id, expire, data: result
      })

      return result
    })()

    this.$cache.set(id, p)
    p.catch(() => {
      this.$cache.delete(id)
    })
    if (!cache) {
      p.then(() => {
        this.$cache.delete(id)
      }).catch(() => {
        this.$cache.delete(id)
      })
    }

    // cloneDeep 一份, 确保多个请求不会修改同一个对象
    try {
      let d = await p
      return await Promise.resolve(cloneDeep(d))
    } catch (err) {
      return await Promise.reject(err)
    }
  }

  async remove(id) {
    this.$cache.delete(id)
    return await this.db.once.where({id}).delete()
  }

  async clean() {
    this.$cache = new Map()
    return await this.db.once.clear()
  }

  async cleanExpire() {
    return await this.db.once.where('expire').belowOrEqual(Date.now()).delete()
  }
}
