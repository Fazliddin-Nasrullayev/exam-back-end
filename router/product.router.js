const { Router } = require('express');
const productController = require('../controller/product.controller')

const router = Router()


router.post('/products', productController.POST)
router.put('/products/:id', productController.PUT)
router.delete('/products/:id', productController.DELETE)
router.get('/products', productController.GET)
router.get('/products/:id', productController.GET_ID)


module.exports = router