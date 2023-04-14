
const bcrypt = require('bcrypt')
const path=require('path')
const jwt = require('jsonwebtoken')

const outletmodel = require('../model/outletmodel')

const signup = async (req, res) => {
     
    const { email, password, userRole } = req.body
    const hashpassword = await bcrypt.hash(password, 16)
    const extinguser = await outletmodel.findOne({ email: email })
    if (extinguser) {
      return res.status(400).send("user already exist")
    }
    const user =  new outletmodel({ email:email,password:hashpassword,userRole:userRole })
    try {

       await user.save()
       res.status(200).json(user)
    }
    catch (err) {
      //error handling middleware
      console.log(err)
    }
  }
  const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        const exitinguser = await outletmodel.findOne({ email: email })
        if (!exitinguser) {
          res.status(400).json("user not found")
        }
        const crditinal = await bcrypt.compare(password, exitinguser.password)
        if (!crditinal) {
          res.status(400).json("invalid password")
        }
        else{
            res.send("login successfull")
        }
    
      }
      catch (err) {
        res.status(402).json("Some Problem occure")
      }

  }
  module.exports = { signup,signin }
