/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

// data里添加数据之后，只有通过这7个操作的方法，才能触发更新
// defineProperty 没法对数组的的变更添加监听，因此只能针对array类的api进行劫持
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  // 获取原始的操作方法
  const original = arrayProto[method]
  // 定义拦截
  // def做的事情=Object.defineProperty(arrayMethods, method, {value: mutator})
  def(arrayMethods, method, function mutator (...args) {
    // 先执行之前的行为
    const result = original.apply(this, args)
    // 定义数组方法额外的行为
    const ob = this.__ob__
    // start 新加入的元素要添加响应式
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    // end 新加入的元素要添加响应式
    // notify change
    // 拿到dep做通知，触发界面更新
    ob.dep.notify()
    return result
  })
})
