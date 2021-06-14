/* @flow */

import * as nodeOps from 'web/runtime/node-ops'
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
// platformModules 用于元素的属性更新
const modules = platformModules.concat(baseModules)
// nodeOps 都是dom节点操作的api（增删改查）
// createPatchFunction 给patch扩容dom的相关操作
export const patch: Function = createPatchFunction({ nodeOps, modules })
