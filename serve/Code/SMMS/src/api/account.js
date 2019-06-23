/**
 * 账号管理模块相关的请求
 * 
 */
//引入封装好的request.js
import req from '@/utils/request'

//账号添加
export function accountAdd ( params ){
    return req.post('/account/accountadd',params)
}

//批量删除
export function batchDel ( params ){
    return req.get('/account/batchdelete',params)
}

//账号编辑
export function accountEdit ( params ){
    return req.get('/account/accountedit',params)
}

//账号单条删除
export function accountDel ( params ){
    return req.get('/account/accountdel',params)
}

//编辑保存
export function saveEdit ( params ){
    return req.post('/account/saveedit',params)
}

//按分页请求封装
export function getDataByPage ( params ){
    return req.get('/account/accountlistbypage',params)
}

//修改旧密码
export function checkOldPass ( params ) {
    return req.post('/account/checkoldpass',params)
}

//修改密码
export function passwordModify( params ) {
    return req.post ('/account/passwordmodify',params)
}

//用户当前信息
export function getInfo (){
    return req.get('/account/info')
}

//菜单权限
export function getRole(){
    return req.get('/account/role')
}

//账号重名
export function accountRename(params){
    return req.get('/account/rename',params)
}