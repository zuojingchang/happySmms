/** 
 * 商品管理模块
*/
var express = require('express');
var router = express.Router();


/* --- 验证token合法性开始 ---- */ 

	// 引入express-jwt模块 此模块主要用于验证token的合法性
	const expressJwt = require('express-jwt');
	//定义秘钥
	const secret = 'webToken';

	// 验证token合法性（检查用户携带的token是否正确）
	router.use(expressJwt ({
	    secret 
	}).unless({
	    path: ['/login/checklogin']  // 不需要验证的url
	}))

	// 如果token不正确，就会抛出错误，如果错误的名字是“UnauthorizedError” 可以断定就是token无效的错误
	router.use(function (err, req, res, next) {
	    if (err.name === 'UnauthorizedError') {  

	    	// token无效 就给前端浏览器响应401状态码 且响应错误提示信息 
	        res.status(401).send('无效的token，前端发送的请求，必须在请求头上携带token，才能拿到数据哦！');
	    }
	})

/* --- 验证token合法性结尾 ---- */ 


//设置响应头
router.all('*',(req,res,next) => {
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers', 'authorization')
    next()//放行
})

//引入数据库连接模块  
const connection = require('./js/conn')

//商品添加
router.post('/goodsadd',(req, res) => {
    //接收参数
    let {classify,barCode,goodsName,goodsPrice,marketPrice} = req.body

    //准备sql
    const sqlStr = `insert into goods(classify,barCode,goodsName,goodsPrice,marketPrice) values('${classify}','${barCode}','${goodsName}','${goodsPrice}','${marketPrice}')`
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err;
        //判断
        if(data.affectedRows > 0) {
            //响应成功
            res.send({code : 0, msg : '商品添加成功'})
        }else {
            res.send({code : 1,msg : '商品添加失败'})
        }
    })
    


})

//单条删除
router.get('/goodsdel',(req, res) => {
    //接收参数
    let { id } = req.query;
    //准备sql
    const sqlStr = `delete from goods where id='${ id }'`
    
    //执行sql
    connection.query(sqlStr,(err, data ) => {
        if(err) throw err;
        //判断
        if(data.affectedRows > 0){
            //成功
            res.send({code : 0, msg : '删除成功'})
        }else {
            //失败
            res.send({code : 1, msg : '删除失败'})
        }
    })
})

//批量删除
router.get('/batchdelete',(req, res) => {
    //接收参数
    let { idArr } = req.query;

    //准备sql
    const sqlStr = `delete from goods where id in (${ idArr })`    
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err;
        //判断
        if(data.affectedRows > 0) {
            //成功
            res.send({code : 0, msg : '删除成功'})
        }else {
            res.send({code : 1, msg : '删除失败'})
        }
    })
})

//分页函数
router.get('/goodslistbypage',(req, res) => {
    //接收参数
    let {pageSize,currentPage,classify,keyword} = req.query;
    //定义一个变量，用于保存总数据
    let total;
    // 构造sql
    let sqlStr = `select * from goods where 1=1`;

    // 如果分类不等于空 且 不等于全部
    if (classify !== '' && classify !== '全部分类') {
        // 拼接第一个查询条件
        sqlStr += ` and classify='${classify}'`;
    }

    // 如果第二个关键字不为空 那么就拼接sql
    if (keyword !== '') {
        sqlStr += ` and (goodsName like '%${keyword}%' or barCode like '%${keyword}%')`
    }
    //排序拼接
    sqlStr += ` order by ctime desc`;

    //执行sql
    connection.query(sqlStr,(err, data) =>{
        if(err) throw err;
        total = data.length     //获取查询过后分页的总条数
    })

    //准备sql   按照分页查询数据
    let n = (currentPage - 1) * pageSize;   //跳过多少条
    
    sqlStr += ` limit ${n},${pageSize}`     //分页的sql
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err;
        res.send({data,total})    //把数据库中数据条数和当前页码对应的数据响应给前端
    })
})

//编辑回填函数
router.get('/goodsedit',(req, res) => {
    //接收请求
    let { id } = req.query;
    //准备sql
    const sqlStr = `select * from goods where id=${ id }`
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err;
        //响应数据给前端
        res.send({ data })
    })
})

//编辑保存修改请求
router.post('/saveedit',(req, res) => {
    //接收请求参数
    let {classify,barCode,goodsName,goodsPrice,marketPrice,id} = req.body;
    //准备sql
    const sqlStr = `update goods set classify='${ classify }', barCode='${ barCode }', goodsName='${ goodsName }', goodsPrice='${ goodsPrice }', marketPrice='${ marketPrice }' where id=${ id }`

    //执行sql
    connection.query(sqlStr, (err, data) => {
        if(err) throw err;
        //判断
        if(data.affectedRows > 0) {
            res.send({code : 0, msg : '修改成功'})
        }else {
            res.send({code : 1, msg : '修改成功'})
        }
    })
})

//报表数据
router.get('/selldata',(req, res) => {
    res.send({
        category:['19-06-20','19-06-21','19-06-22','19-06-23','19-06-24','19-06-25','19-06-26','19-06-27','19-06-28','19-06-29'],
        value : [800, 1402, 1500, 1700, 1650, 1206, 994,1100,600,1000]
    })
})




// //高级查询
// router.get('/search',(req, res) => {
//     //接收参数
//     let {classify, keyword} = req.query;
//     // 构造sql
    // let sqlStr = `select * from goods where 1=1`;

    // // 如果分类不等于空 且 不等于全部
    // if (classify !== '' && classify !== '全部分类') {
    //     // 拼接第一个查询条件
    //     sqlStr += ` and classify='${classify}'`;
    // }

    // // 如果第二个关键字不为空 那么就拼接sql
    // if (keyword !== '') {
    //     sqlStr += ` and (goodsName like '%${keyword}%' or barCode like '%${keyword}%')`
    // }
//     //执行sql
//     connection.query(sqlStr, (err, data) => {
//         if(err) throw err;
//         //把查询结果发送给前端
//         res.send({data})
//     })  
// })













//商品列表
// router.get('/goodslist',(req, res) => {
//     //准备sql
//     const sqlStr = `select * from goods order by ctime desc`
//     //执行sql
//     connection.query(sqlStr, (err, data) => {
//         if(err) throw err;
//         // 响应数据给前端
//         res.send({ data })
//     })
// })
module.exports = router;