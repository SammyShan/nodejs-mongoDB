/**
 * Mongodb 操作文件
 */
const md5 = require("md5");
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:       {type:String, require:true},
    email:      {type:String, require:true},
    password:   {type:String, require:true},
    created:    {type:Date}
});

//MD5密码和原密码匹配
UserSchema.methods.verifyPassword= function(password){
    let isMatch= md5(password)=== this.password;
    //console.log('UserSchema.methods.verifyPassword: ', password, this.password, isMatch);
    return isMatch;
};

const Models={
    test : mongoose.model('test', UserSchema),
    verify : UserSchema.methods.verifyPassword
};

/**
 * 创建数据库名称并连接
 * Connecting to Mongod instance.
 */
const dbHost = 'mongodb://localhost:27017/csdemo2';
mongoose.connect(dbHost);
const db=mongoose.connection;
db.on('error', function () {
    console.log('Database connection error.');
});
db.once('open', function () {
    console.log('The Database has connected.')
});

module.exports = Models;