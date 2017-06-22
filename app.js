/**
 *  载入依赖项
 *  fs：文件系统；
 *
 */
const fs = require('fs');
const path = require('path');
const express = require('express');
const validator = require('express-validator');
const mongoose = require('mongoose');
const md5 = require("md5");
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();
//const User = require('./server/db').User;
const resolve = file=>path.resolve(__dirname, file);
//const db = require('./server/db');

app.set('port', (process.env.port || 3300));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*app.use(session({
    secret: 'csdemo',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: new MongoStore({ mongooseConnection: mongoose.connection }) //session存储位置
}));*/
//后端表单验证
app.use(validator({
    errorFormatter: function (param, msg, value) {
        let namespace=param.split('.'),
            root=namespace.shift(),
            formParam=root;

        while(namespace.length){
            formParam+='['+ namespace.shift() +']';
        }

        return {
            param:formParam,
            msg:msg,
            value:value
        };
    }
}));
app.get('/',function (reg,res,next) {
    console.log("链接开启")
    res.send('测试<a href="/demo">demo</a>');
    next();
})

app.get('/demo', function (req, res, next) {
        console.log("demo打开")
        const html = fs.readFileSync(resolve('index.html'), 'utf-8');
        res.send(html);
});
router.get('/get', function(req, res, next){

    let id=req.query.id;

    if(!id || id == 'null') {

        return res.status(404).send('未提供查询字段');
		//return next();
    }else{
		return res.status(200).send({msg:'您是要查询'+id+'吗？'});
		//return next();
	}

	/*
    db.test.findOne({_id: id}).exec(function(err, result){
        if ( err ) {
            console.log('get category: '+ err);
            throw err;
        }
        if(!result){
            return next(new Error('article not found: ', id));
        }
        res.status(200).send(JSON.stringify(result)).end();
    });*/
});
router.post('/set', function(req, res, next){
    const email= req.body.email;
    const password= req.body.password;
    const comfirmPassword= req.body.comfirmPassword;
    //服务端验证字段
    req.checkBody('email', '须为邮箱且不能为空').notEmpty().isEmail();
    req.checkBody('password', '密码不能为空').notEmpty();

    let errors=req.validationErrors(); 
	
    if(errors) 
		return res.status(301).send(errors).end();
	else
		return res.status(200).send({msg:'成功！'}).end();

    /*
	const user= new db.test({
        name: email.split('@').shift(),
        email:email,
        password:md5(password),
        created:new Date
    });
    user.save(function(err, result){
        if ( err ) {
            console.log('reg err:'+ err);
            throw err;
        }else{
            console.log(result);
            //res.redirect('/adminArticleList');
            res.status(200).send(JSON.stringify(result)).end();
        }
    });*/
});
app.use(router);
app.listen(app.get('port'), function(){
    console.log('Server up: http://localhost:' + app.get('port'));
});

