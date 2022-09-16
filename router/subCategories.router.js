const { Router } = require('express');
const subcategoryController = require('../controller/subCategories.controller')

const router = Router()


router.post('/subcategories', subcategoryController.POST)
router.put('/subcategories/:id', subcategoryController.PUT)
router.delete('/subcategories/:id', subcategoryController.DELETE)
router.get('/subcategories/:id', subcategoryController.GET_ID)


module.exports = router