const { response } = require('express')
const {read, write} = require('../model/fs')
const {verify} = require('jsonwebtoken')
require("dotenv").config()

const categories = read('database/category.json')
const subCategory = read('database/subCategories.json')
const products = read('database/product.json')

const users = read('database/users.json')

class Category {
    POST = (req, res) => {
        
        const token = req.headers.token
        
        const decode =  verify(token, process.env.SECRET_KEY)
        
        const FindUser = users.find(e => e.user_id == decode.id)
        console.log(decode);
        if(!FindUser?.role || FindUser?.role != 'admin') return res.status(401).send("Wrong role")

         const {categoryName} = req.body
         if(!categoryName){
             res.send("Category name is required")
            }
        const categoryNameIs = categories.find(e => e.categoryName == categoryName )
        
         categoryNameIs ? res.send('Such a category exists') : null

        categories.push({
            categoryId: categories[categories.length - 1]?.categoryId + 1 || 1,
            categoryName
        })
        write('database/category.json', categories )
        res.status(200).json("category added successfully")
    }

    PUT = (req, res) => {
        const token = req.headers.token
        
        const decode =  verify(token, process.env.SECRET_KEY)
        
        const FindUser = users.find(e => e.user_id == decode.id)
        console.log(decode);
        if(!FindUser?.role || FindUser?.role != 'admin') return res.status(401).send("Wrong role")

        const id = req.params.id
   
        const {categoryName} = req.body
        const FindName = categories.find(e => e.categoryId == id)
        FindName ? FindName.categoryName = categoryName : res.send("wrong id")

        write('database/category.json', categories)
        res.status(201).json('category updated successfully')
    }

    DELETE = (req, res) => {

        const token = req.headers.token
        
        const decode =  verify(token, process.env.SECRET_KEY)
        
        const FindUser = users.find(e => e.user_id == decode.id)
        console.log(decode);
        if(!FindUser?.role || FindUser?.role != 'admin') return res.status(401).send("Wrong role")
        
        const id = req.params.id

        const CategorieId = categories.find(e => e.categoryId == id)

        if(CategorieId) {
            const FilterCategory = categories.filter((e => e.categoryId != id))
            const FillterOrg = subCategory.filter(e => e.category_id != id )

            const productsArr = []

            for (let i = 0; i < FillterOrg.length; i++) {
                for (let j = 0; j < products.length; j++) {
                    if(FillterOrg[i].sub_category_id == products[j].sub_category_id){
                        productsArr.push(products[j])
                    }
                }
            }


            

            write('database/category.json', FilterCategory )
            write('database/product.json', productsArr)
            write('database/subCategories.json',FillterOrg )


            res.send("category deleted")
        }
        res.send("wrong category id")

    }

    GET_ID = (req, res)=> {

        const id = req.params.id

        const FindCategory  = categories.find(e=> e.categoryId == id)
        const FindSubCAtegory = subCategory.filter(e=> e.category_id == id && delete e.category_id)
        if(FindCategory && FindSubCAtegory){
            
            FindCategory.subCategories = FindSubCAtegory

            res.send(FindCategory)
        }

        res.send("wrong id or something")
    } 


}




module.exports = new Category