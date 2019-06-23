//封装本地存储的操作

export default{
    get(key){
        // 取出来的时候 把值转为对象
        return  window.localStorage.getItem(key) 
    },
    set(key,value){
        // 存入的时候，把对象转为字符串（因为不能直接存储对象）
        return window.localStorage.setItem(key,value)
    },
    remove(key){
        return window.localStorage.removeItem(key)    
    }
}



