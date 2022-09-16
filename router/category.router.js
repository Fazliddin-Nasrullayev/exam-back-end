const { Router } = require('express');
const categoryController = require('../controller/category.controller')

const router = Router()


router.post('/categories', categoryController.POST)
router.put('/categories/:id', categoryController.PUT)
router.delete('/categories/:id', categoryController.DELETE)
router.get('/categories/:id', categoryController.GET_ID)


module.exports = router