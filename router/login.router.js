const { Router } = require('express');
const loginController = require('../controller/login.controller')

const router = Router()


router.post('/login', loginController.LOGIN)



module.exports = router