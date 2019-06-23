/**
 * 商品管理模块相关的请求
 * 
 */
//引入封装好的request.js
import req from '@/utils/request'

//商品添加
export function goodsAdd ( params ){
    return req.post('/goods/goodsadd',params)
}

//商品批量删除
export function batchDel ( params ){
    return req.get('/goods/batchdelete',params)
}

//商品编辑
export function goodsEdit ( params ){
    return req.get('/goods/goodsedit',params)
}

//商品编辑保存
export function goodsSaveEdit ( params ){
    return req.post('/goods/saveedit',params)
}

//商品单条删除
export function goodsDel ( params ){
    return req.get('/goods/goodsdel',params)
}

//商品按照分页请求函数
export function goodsGetDataByPage ( params ){
    return req.get('/goods/goodslistbypage',params)
}

// //高级查询
// export function searchGoods (params) {
//     return req.get('/goods/search',params)
// }


//获取后端数据（报表）

export function getSellData(){
    return req.get('/goods/selldata')
}







