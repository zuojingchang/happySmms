/** 
 * 账号管理模块
*/
var express = require('express');
var router = express.Router();

//设置响应头
router.all('*',(req,res,next) => {
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers', 'authorization') // 允许携带的头
    next()//放行
})

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

//引入数据库连接模块  
const connection = require('./js/conn')

//添加账号
router.post('/accountadd',(req, res) => {
    // //接收参数
    let {account,password,userGroup} = req.body;

    let avatarUrl = '/upload/avatar.jpg';
    
    //准备sql
    const sqlStr = `insert into accounts(account,password,userGroup,avatarUrl) values('${account}','${password}','${userGroup}','${avatarUrl}')`
    //console.log(sqlStr)
    //执行sql
    connection.query(sqlStr,(err,data) => {
        if (err) throw err;
        //console.log(data);
        //判断
        if(data.affectedRows > 0){
            //响应成功
            res.send({code : 0, msg : '添加账号成功'})
        }else{
            //响应失败
            res.send({code : 1, msg : '添加账号失败'})
        }
    })
})  

//单条删除 
router.get('/accountdel',(req, res) => {
   //接收参数
    let { id } = req.query
    //准备sql 
    const sqlStr = `delete from accounts where id=${id}`
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err
        //判断
        if(data.affectedRows > 0){
            //删除成功
            res.send({code:0, msg : '删除成功'})
        }else {
            res.send({code:1, msg : '删除失败'})
        }
    })
})

//编辑回填函数
router.get('/accountedit',(req, res) => {
    //接收参数
    let { id } = req.query;
    //准备sql
    const sqlStr = `select * from accounts where id=${ id }`;
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err
        //响应数据给前端
        res.send({ data })
    })
})

//编辑保存修改请求
router.post('/saveedit',(req, res) => {
    //接收请求参数
    let {account, userGroup, id} = req.body;
    //准备sql
    const sqlStr = `update accounts set account='${account}', userGroup='${userGroup}' where id=${id}`;
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err;
        //判断
        if(data.affectedRows > 0){
            res.send({code : 0, msg : '修改成功'})
        }else{
            res.send({code : 1, msg : '修改失败'})
        }
    })   
})

//批量删除
router.get('/batchdelete',(req, res) => {
    //接收参数
    let { idArr } = req.query;

    //准备sql
    const sqlStr = `delete from accounts where id in (${ idArr })`
    
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err
        //判断
        if(data.affectedRows > 0){
            //成功
            res.send({code : 0 , msg : '删除成功'})
        }else{
            //失败
            res.send({code : 1 , msg : '删除失败'})
        }
    })
})

//分页
router.get('/accountlistbypage',(req, res) =>{
    console.log('当前登录用户信息',req.user);
    
    //接收参数
    let {pageSize,currentPage} = req.query;
    //定义一个变量，用于保存总数据
    let total;
    //准备sql
    let sqlStr = `select * from accounts order by ctime desc`
    
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err;     
        total = data.length;     //获取总数据条数
    })

    //准备sql  按照分页查询数据
    let n = (currentPage - 1) * pageSize;   //跳过多少条
    sqlStr += ` limit ${n}, ${pageSize}`    //分页的sql
   
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err;
        res.send({ data,total })   //把数据库中数据条数和当前页码对应的数据响应给前端
    })
})  

//确认原密码
router.post('/checkoldpass',(req, res) => {
    //接收参数
    let { oldPwd } = req.body;
    //验证是否正确
    if(oldPwd === req.user.password){
        res.send({code : 0, msg : '原密码正确'})
    }else {
        res.send({code : 1, msg : '旧密码错误'})
    }
})

//修改密码
router.post('/passwordmodify',(req, res) => {
    //接收请求参数
    let {newPassword} = req.body;
    //获取id
    let id = req.user.id;
    //准备sql
    const sqlStr = `update accounts set password='${newPassword}' where id=${ id }`;

    //执行sql
    connection.query(sqlStr, (err, data) => {
        if(err) throw err;
        if(data.affectedRows > 0){
            res.send({code : 0, msg : '密码修改成功！请重新登录'})
        }else{
            res.send({code : 1, msg : '密码修改失败！！！'})
        }
    })   
})

//用户信息
router.get('/info',(req, res) => {
    //获取id
    let id = req.user.id;
    //准备sql
    const sqlStr = `select * from accounts where id=${ id }`
    //执行sql
    connection.query(sqlStr, (err, data) => {
        if(err) throw err;
        res.send({ data })
    })
})

//菜单权限
router.get('/role',(req, res) => {
    res.send({role : req.user.userGroup})
})

/*  --------------上传开始-------------- */
// 引入node上传模块
var multer = require('multer');

// 配置存储路径 和 重命名
var storage = multer.diskStorage({
    // 图片上传到服务器以后 要放置的路径
    destination: 'public/upload',

    // 图片重命名
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        // 获取时间戳
        var filename = new Date().getTime();  
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
});

// 上传对象
var upload = multer({
    storage,
});

//头像上传
router.post('/uploadavatar', upload.single('file'),(req, res) => {
    //接收到的文件信息
    let file = req.file
    //文件名
    let fileName = file.filename
    console.log('文件名：',fileName);
    
    
    //拼接文件路径
    let avatarUrl = '/upload/' + fileName;
    console.log('文件地址：',avatarUrl);
    
    //准备sql
    const sqlStr = `update accounts set avatarUrl='${ avatarUrl }' where id=${ req.user.id }`;
    
    //执行sql
    connection.query(sqlStr, (err, data) => {
        if(err) throw err;
        if(data.affectedRows > 0){
			res.send({code: 0, reason: "上传成功", avatarUrl})
        }else {
            res.send({code : 1 , msg : '头像上传失败'})
        }
    })  
})
/*  --------------结束-------------- */

//账号重名请求
router.get('/rename',(req,res) => {
    // //接收参数
    let {account} = req.query;
    //准备sql
    const sqlStr = `select * from accounts where account='${account}'`
    //执行sql
    connection.query(sqlStr,(err, data) => {
        if(err) throw err;
        if(data.length > 0){
            res.send({code : 0 , msg : '此用户名已存在！'})
        }else{
            res.send({code : 1 , msg : '用户名可以使用！'})
        }
    })
})

module.exports = router;
