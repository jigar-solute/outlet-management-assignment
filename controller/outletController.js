
const bcrypt = require('bcrypt')
const path = require('path')
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
const outlateRouter = require('../routes/authroutes');
const User = require('../model/user')
const Outlet = require('../model/outletstoremodel')

const signup = async (req, res) => {

    const { email, password, userRole } = req.body
    const hashpassword = await bcrypt.hash(password, 16)
    const extinguser = await User.findOne({ email: email })
    if (extinguser) {
        return res.status(400).send("user already exist")
    }
    const user = new User(
        {
            email: email,
            password: hashpassword,
            userRole: userRole
        })
      try {
        await user.save()
        res.status(200).json(user)
        }
         catch (err) {
        console.log(err)
                }
}
const signin = async (req, res) => {
    try {
        const { email, password } = req.body
        const exitinguser = await User.findOne({ email: email })
        if (!exitinguser) {
            res.status(400).json("user not found")
        }
        const crditinal = await bcrypt.compare(password, exitinguser.password)
        if (!crditinal) {
            res.status(400).json("invalid password")
        }
        else if (exitinguser.userRole === "outlet-manager") {

            res.send(" outlate login successfull")

        }
    }
    catch (err) {
        res.status(402).json("Some Problem occure")
    }

}
const addoutlateStore = async (req, res) => {
    const outlet = new Outlet({
        name: req.body.name,
        city: req.body.city,
        state: req.body.state,
        address: req.body.address,
        status: req.body.status,
        timing: req.body.timing,
        manager: "643909ced0c6e2af78842fcb",
    })
    try {
        await outlet.save()
        res.status(200).json(outlet)

    }
    catch (err) {
        console.log(err)
    }


}
const addtocart=async(req,res)=>{
    
}
module.exports = { signup, signin, addoutlateStore,addtocart }
