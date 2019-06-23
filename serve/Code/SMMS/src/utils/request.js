/**
 * axios 发送请求函数封装
 * 
 */
//引入axios
import axios from 'axios';
//引入qs
import qs from 'qs';

// 引入本地存储封装
import local from '@/utils/local'
//设置请求默认服务器地址
axios.defaults.baseURL = 'http://127.0.0.1:666'

/*
    在axios发送之前 头部携带token
*/
// 请求拦截器
axios.interceptors.request.use(config => {
    // 获取token
    let token = local.get('zxc_token')

    // 给头部携带token
    config.headers.authorization = `Bearer ${token}` 
    return config
})

export default {
    get(url,params={}){
        return new Promise((resolve, reject) => {
            axios.get(url,{ params })
                .then(response => {
                    //成功
                    resolve(response.data)
                })
                .catch(err => {
                    //失败
                    reject(err)
                })
        })
    },
    post(url,params={}){
        return new Promise((reoslve, reject) => {
            axios.post(url,qs.stringify(params))
                .then(response => {
                    //成功
                    reoslve(response.data)
                })
                .catch(err => {
                    //失败
                    reject(err)
                })
        })
    }
}

