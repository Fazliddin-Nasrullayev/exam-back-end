const express = require('express')

const PORT = process.env.PORT || 1251
const categoryRouter = require('./router/category.router')
const subcategoryRouter = require('./router/subCategories.router')
const productRouter = require('./router/product.router')
const loginRouter = require('./router/login.router')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(categoryRouter)
app.use(subcategoryRouter)
app.use(productRouter)
app.use(loginRouter)









app.listen(PORT, _=> console.info(`http://localhost:${PORT}`))