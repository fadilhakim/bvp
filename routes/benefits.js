const express = require('express')
const Router = express.Router()

Router.get('/',function(req,res){
    res.render('benefits')

})


module.exports = Router