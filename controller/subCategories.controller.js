const {read, write} = require('../model/fs')
const {verify} = require('jsonwebtoken')
require("dotenv").config()
const subcategories = read('database/subCategories.json')
const categories = read('database/category.json')
const products = read('database/product.json')
const users = read('database/users.json')

class SubCategory{
     POST = (req, res) => {
        const token = req.headers.token
        
        const decode =  verify(token, process.env.SECRET_KEY)
        
        const FindUser = users.find(e => e.user_id == decode.id)
        console.log(decode);
        if(!FindUser?.role || FindUser?.role != 'admin') return res.status(401).send("Wrong role")

        const { categoryId, sub_category_name } = req.body

        const FindCategoryId = categories.find(e => e.categoryId === categoryId)

        if(FindCategoryId && sub_category_name){
            subcategories.push({
                category_id: categoryId,
                sub_category_name, 
                sub_category_id: subcategories[subcategories.length - 1]?.sub_category_id +1 || 1
            })

            write('database/subCategories.json', subcategories)
            res.status(200).json('subcategory added successfully')
        }
        console.log(categoryId, sub_category_name);
        res.send('Wrong category id or sub_category_name')

    }

    PUT = (req, res) => {
        const token = req.headers.token
        
        const decode =  verify(token, process.env.SECRET_KEY)
        
        const FindUser = users.find(e => e.user_id == decode.id)
        console.log(decode);
        if(!FindUser?.role || FindUser?.role != 'admin') return res.status(401).send("Wrong role")

        const id = req.params.id
   
        const {sub_category_name, category_id} = req.body
        const FindNameId = subcategories.find(e => e.sub_category_id == id)
        const FindCategoryId = categories.find(e => e.categoryId == category_id)
        console.log(FindNameId,FindCategoryId);
        if(FindNameId && FindCategoryId){
            FindNameId.sub_category_name = sub_category_name
            FindNameId.category_id = category_id

            write('database/subCategories.json', subcategories)
            res.status(201).json('subcategory updated successfully')
        }
        res.send("wrong sub_category_name or category_id")


    }

    DELETE = (req, res) => {
        const token = req.headers.token
        
        const decode =  verify(token, process.env.SECRET_KEY)
        
        const FindUser = users.find(e => e.user_id == decode.id)
        console.log(decode);
        if(!FindUser?.role || FindUser?.role != 'admin') return res.status(401).send("Wrong role")

        const id = req.params.id

        const FindSubCategoryId = subcategories.find(e => e.sub_category_id == id)

        if(FindSubCategoryId){

            const FillterSubCategory = subcategories.filter(e => e.sub_category_id != id)
            const FillterProducts = products.filter(e => e.sub_category_id != id)

            write('database/subCategories.json', FillterSubCategory)
            write('database/product.json', FillterProducts)
            res.send("subcategories deleted successfully")
        }
        res.send("wromg id")


    }

    GET_ID = (req, res)=> {

        const id = req.params.id

        const FindSubCategory  = subcategories.find(e=> e.sub_category_id == id)
        const FindProducts = products.filter(e=> e.sub_category_id == id && delete e.sub_category_id)
        if(FindSubCategory && FindProducts){
            
            FindSubCategory.products = FindProducts

            res.send(FindSubCategory)
        }

        res.send("wrong id or something")
    } 

}




module.exports = new SubCategory