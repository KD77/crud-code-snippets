const express= require('express')
const router= express.Router()

const controller = require('../controllers/snippetController')
router.get('/', controller.index)
router.get('/create', controller.create)
router.get('/new', controller.new)

module.exports=router