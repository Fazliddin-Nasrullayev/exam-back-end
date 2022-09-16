const {read, write} = require('../model/fs')
const {verify} = require('jsonwebtoken')
require("dotenv").config()
const subcategories = read('database/subCategories.json')
const users = read('database/users.json')

const products = read('database/product.json')
class Product {
     POST = (req, res) => {

        const token = req.headers.token
        
        const decode =  verify(token, process.env.SECRET_KEY)
        
        const FindUser = users.find(e => e.user_id == decode.id)
        console.log(decode);
        if(!FindUser?.role || FindUser?.role != 'admin') return res.status(401).send("Wrong role")

        
        const {sub_category_id, model, product_name, price, color  } = req.body

        const FindSubCategoryId = subcategories.find(e => e.sub_category_id === sub_category_id)

        if(FindSubCategoryId && model && product_name && price && color){
            products.push({
                 model, product_name, price, color,sub_category_id,
                 product_id: products[products.length -1]?.product_id + 1 || 1

            })

            write('database/product.json',products )
            res.status(200).json('product added successfully')
        }
        res.send('Wrong sub_category_id or model or product_name or price or color ')
    }

    PUT = (req, res) => {

        const token = req.headers.token
        
        const decode =  verify(token, process.env.SECRET_KEY)
        
        const FindUser = users.find(e => e.user_id == decode.id)
        console.log(decode);
        if(!FindUser?.role || FindUser?.role != 'admin') return res.status(401).send("Wrong role")

        const id = req.params.id
        const {sub_category_id, model, product_name, price, color  } = req.body
        console.log(req.body);

        const FindSubCategoryId = subcategories.find(e => e.sub_category_id == sub_category_id)
        const FindProductId = products.find(e=> e.product_id == id)

        if(model && product_name && price && color && FindProductId && FindSubCategoryId ){
            FindProductId.model = model
            FindProductId.product_name = product_name
            FindProductId.price = price
            FindProductId.color = color
            FindProductId.sub_category_id = sub_category_id


            write('database/product.json', products )

            res.status(201).json("products updated successfully")
        }
        res.send("wrong to add products")
    }

    DELETE = (req, res) => {
        const token = req.headers.token
        
        const decode =  verify(token, process.env.SECRET_KEY)
        
        const FindUser = users.find(e => e.user_id == decode.id)
        console.log(decode);
        if(!FindUser?.role || FindUser?.role != 'admin') return res.status(401).send("Wrong role")
        
        const id = req.params.id
        const FindId = products.find(e => e.product_id == id)

        if(FindId){
            const FilterProduct = products.filter(e => e.product_id != id)

            write('database/product.json', FilterProduct)
            res.send('product deleted successfully')
        }

        res.send('wrong id of product')
    }

    GET = (req, res) => {
        console.log(req.query);
        if(req.query){

            if(req.query.subCategoryId && req.query.model){

                const FillterSubCotegory = products.filter(e=> e.sub_category_id == req.query.subCategoryId)
                const FilterModel = FillterSubCotegory.filter(e=> e.model == req.query.model)

                if(FilterModel){
                    res.send(FilterModel)
                }
                res.send("wrong model or sub_category")
            }

            if(req.query.categoryId){
                const arr = []
                const SubCategory = subcategories.filter(e => e.category_id == req.query.categoryId)
                console.log(SubCategory);
                for (let i = 0; i < SubCategory.length; i++) {
                    for (let j = 0; j < products.length; j++) {
                            if(SubCategory[i].sub_category_id == products[j].sub_category_id ){
                                arr.push(products[j])
                            }
                    }
                }
                res.send(arr)
            }

            if(req.query.subCategoryId){
                console.log(req.query.subCategoryId);
                const FindSubCategory = products.filter(e=> e.sub_category_id == req.query.subCategoryId)
                res.send(FindSubCategory)
            }

            if(req.query.model){
                const FindModel = products.filter(e=> e.model == req.query.model)
                res.send(FindModel)
            }

            res.send("wrong query parameters")
        }
        res.send([])
    }

    GET_ID = (req, res) => {
        const id = req.params.id

        const FindProduct = products.find(e=> e.product_id == id)

        if(FindProduct){
            res.send(FindProduct)
        }

        res.send('wrong id')
    }

}

module.exports = new Product
