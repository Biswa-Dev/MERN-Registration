const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authenticate = require('../middleware/authenticate');

//DB connection
require('../db/conn')
//User Model
const User = require('../models/userschema');

router.get("/",(req,res)=>{
    res.send("This home page from server router js");
});

//Using promises register router
// router.post("/register",(req,res)=>{
//     // console.log(req.body);
//     // res.json({message: req.body});

//     const {name, email, phone, work, password, cpassword} = req.body;
//     // console.log(name);
//     // console.log(email);

//     if(!name || !email || !phone || !work || !password || !cpassword){
//         return res.status(422).json({error: "Please fill all the fields properly!"});
//     }

//     User.findOne({email: email}).then((foundUser)=>{
//         if(foundUser){
//             return res.status(422).json({error: "Email already exist! Try with different email."});
//         }else{
//             const user = new User({name: name, email: email, phone: phone, work:work, password: password, cpassword: cpassword});
//             user.save().then(()=>{
//                 res.status(201).json({message: "User registered successfully."});
//             }).catch((err)=>{
//                 res.status(500).json({error: "Failed to registered!"});
//             });
//         }
//     }).catch((err)=>{console.log(err);});
// });

//Using async await register router
router.post("/register", async(req,res) =>{
    const {name, email, phone, work, password, cpassword} = req.body;

    if(!name, !email, !phone, !work, !password, !cpassword){
        res.status(422).json({error: "Please fill all the fields properly!"});
    }
    try{
        const userFound = await User.findOne({email: email});

        if(userFound){
            return res.status(422).json({error: "Email already exist!"});
        }else if(password != cpassword){
            return res.status(422).json({error: "Passwords not mathcing!"});
        }else{
            const user = new User({name, email , phone, work, password, cpassword});
            //here we have all the user details but before saving we are going to call pre-save
            //method for hashing the password.(pre-save method is defined in userSchema.js) 
            await user.save();
            res.status(201).json({message: "User successfully registered"});
        }
    }catch(err){
        console.log(err);
    }
});

//Login route
router.post("/login",async(req,res)=>{
    // console.log(req.body);
    // res.json({messsage: "Awesome"});
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error: "Please fill all the fields properly!"});
    }

    try{
        const userFound = await User.findOne({email: email});
        // console.log(userFound);

        if(userFound){
            const passMatch = await bcrypt.compare(req.body.password,userFound.password);

            //generating token function(defined in userSchema.js)
            const token = await userFound.generateAuthToken();
            console.log(token);
            //storing token into cookie
            res.cookie("jwtoken", token,{
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true    
            });
            if(!passMatch){
                res.status(422).json({error: "Invalid credential!"});
            }else{
                res.status(201).json({message: "User signedin successfully."});
            }
        }else{
            res.status(422).json({error: "Invalid credential!"});
        }
    }catch(err){
        console.log(err);
    }
});

router.get("/about",authenticate,(req,res)=>{
    console.log(req.rootUser);
    res.send(req.rootUser);
});



module.exports = router;



