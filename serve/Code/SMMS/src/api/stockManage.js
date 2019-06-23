/**
 * 进货管理模块相关的请求
 * 
 */
//引入封装好的request.js
import req from '@/utils/request'

//商品添加库存
export function inLibraryAdd ( params ){
    return req.post('/stockmanage/stockmanageadd',params)
}
//分页请求
export function getDataByPage( params ){
    return req.get('/stockmanage/stockmanagelistbypage',params)
}

//单条数据删除
export function stockmanageDel( params ){
    return req.get('/stockmanage/stockmanagdelete',params)
}

//批量删除
export function batchDelete( params ){
    return req.get('/stockmanage/stockmanagbatchdelete',params)
}

//编辑
export function stockManageEdit ( params ) {
    return req.get('/stockmanage/stockmanageedit',params)
}

//编辑保存函数
export function stockManageEditSave ( params ) {
    return req.post('/stockmanage/stockmanageeditsave',params)
}   

// //高级查询
// export function stockSearch (params){
//     return req.get('/stockmanage/stocksearch',params)
// }