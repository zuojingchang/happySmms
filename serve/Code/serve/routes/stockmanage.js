/** 
 * 近乎管理模块
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
    res.header('Access-Control-Allow-Headers','authorization')
    next()//放行
})

//引入数据库连接模块  
const connection = require('./js/conn')

//商品添加入库
router.post('/stockmanageadd',(req, res) => {
    //接收参数
    let {classify,barCode, goodsName, purchasingPrice, inLibrary, inventory} = req.body;

    //准备sql
    const sqlStr = `insert into stockmanage(classify,barCode, goodsName, purchasingPrice, inLibrary, inventory) values ('${classify}','${barCode}', '${goodsName}',' ${purchasingPrice}',' ${inLibrary}', '${inventory}')`
    
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err;
        if(data.affectedRows > 0) {
            res.send({code : 0 , msg : '入库成功'})
        }else{
            res.send({code : 1 , msg : '入库失败'})
        }
    })
})


//分页函数
router.get('/stockmanagelistbypage',(req, res) => {
    //接收参数
    let {pageSize,currentPage,classify,keyword} = req.query;
    //定义变量保存总条数
    let total;
    //准备sql
    let sqlStr = `select * from stockmanage where 1=1`; 
    //高级查询sql
    // 如果分类不等于空 且 不等于全部
    if (classify !== '' && classify !== '全部分类') {
        // 拼接第一个查询条件
        sqlStr += ` and classify='${classify}'`;
    }

    // 如果第二个关键字不为空 那么就拼接sql
    if (keyword !== '') {
        sqlStr += ` and (goodsName like '%${keyword}%' or barCode like '%${keyword}%')`
    }
    //排序拼接sql
    sqlStr += ` order by ctime desc`;
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err;
        total = data.length    
    })  
    let n = (currentPage - 1) * pageSize;
    //准备sql
    sqlStr += ` limit ${ n }, ${ pageSize }`
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err;
        //把数据和总条数响应给前端
        res.send({data,total})
    })
})

//单条数据删除
router.get('/stockmanagdelete',(req, res) => {
    //接收参数
    let { id } = req.query;
    //准备sql
    const sqlStr = `delete from stockmanage where id='${ id }'`;
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err;
        if(data.affectedRows > 0){
            res.send({code : 0, msg : '删除成功'})
        }else{
            res.send({code : 1, msg : '删除失败'})
        }
    })
})

//批量删除
router.get('/stockmanagbatchdelete',(req, res) => {
    //接收请求参数
    let { idArr } = req.query;
    //准备sql
    const sqlStr = `delete from stockmanage where id in (${idArr})`
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err;
        if(data.affectedRows > 0){
            res.send({code : 0, msg : '删除成功'})
        }else{
            res.send({code : 1, msg : '删除失败'})
        }
    })
})

//编辑回填请求
router.get('/stockmanageedit',(req, res) => {
    //接收参数
    let { id } = req.query;
    //准备sql
    const sqlStr = `select * from stockmanage where id=${ id }`
    //执行sql
    connection.query(sqlStr, (err, data) => {
        if(err) throw err;
        //响应数据给前端
        res.send({ data})
    })
})


//编辑保存函数
router.post('/stockmanageeditsave',(req, res) =>{
    //接收参数
    let {barCode,goodsName,purchasingPrice,inLibrary,inventory,id} = req.body;
    //准备sql
    const sqlStr = `update stockmanage set barCode='${ barCode }', goodsName='${ goodsName }',purchasingPrice='${ purchasingPrice }',inLibrary='${ inLibrary }',inventory='${ inventory }' where id='${ id }'`
    //执行sql
    connection.query(sqlStr, (err, data) => {
        if(err) throw err;
        //判断
        if(data.affectedRows > 0){
            res.send({code : 0, msg : '修改成功'})
        }else{
            res.send({code : 1, msg : '修改失败'})
        }
    })
})

// //高级查询
// router.get('/stocksearch',(req, res) => {
//     //接收参数
//     let {classify, keyword} = req.query;
//     // 构造sql
//     let sqlStr = `select * from stockmanage where 1=1`;

//     // 如果分类不等于空 且 不等于全部
//     if (classify !== '' && classify !== '全部分类') {
//         // 拼接第一个查询条件
//         sqlStr += ` and classify='${classify}'`;
//     }

//     // 如果第二个关键字不为空 那么就拼接sql
//     if (keyword !== '') {
//         sqlStr += ` and (goodsName like '%${keyword}%' or barCode like '%${keyword}%')`
//     }
//     //执行sql
//     connection.query(sqlStr, (err, data) => {
//         if(err) throw err;
//         //把查询结果发送给前端
//         res.send({data})
//     })  
// })

module.exports = router;