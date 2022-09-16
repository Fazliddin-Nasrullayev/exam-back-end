const { read } = require('../model/fs')
const { sign } = require('jsonwebtoken')
require("dotenv").config()
class login {
    LOGIN = (req, res)=>{
        const {username, password } = req.body
        if(!username?.trim() || !password?.trim()){
            return res.sendstatus(401).send("username or password incorrect")
        }
        const users = read('database/users.json')
        
        const FindUser = users.find(e => e.username == username?.trim() && e.password == password?.trim())

        if(!FindUser) return res.sendstatus(404).send("user not found")

        const user = {
            id: FindUser.user_id,
            role: FindUser.role
        }
        console.log(user);
        const token = sign( user,`${process.env.SECRET_KEY}`)
        res.send(token);
    }
}

module.exports = new login