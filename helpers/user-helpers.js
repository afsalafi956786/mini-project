const db=require('../config/connection')
const collection=require('../config/collections')
const bcrypt=require('bcrypt')
const { response, use } = require('../app')

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{

            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((response)=>{
                    resolve(userData)
            })
        })

    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    if(status){
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        resolve({status:false})
                    }
                })

            }else{
                console.log("login failed");
                resolve({status:false})
            }

        })

    },
    searchUser:(name)=>{
        return new Promise(async (resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find({name:name}).toArray()
            resolve(users)
        })

    },
        signEmailCheck:(email)=>{
        return new Promise(async(resolve,reject)=>{
         await db.get().collection(collection.USER_COLLECTION).findOne({email:email}).then((response)=>{
            resolve(response)
         })
        })
    }


}


