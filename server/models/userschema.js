require('dotenv').config({path: '../.env'});
const mongoose = require('mongoose');
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    work: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

//hashing password before saving to db
userSchema.pre('save',async function (next){
    //console.log("pre function activated");
    if(this.isModified('password')){
        //console.log("hashing started");
        this.password = await bcrypt.hash(this.password,12);
        this.cpassword = await bcrypt.hash(this.cpassword,12);
    }
    next();
});

//generating token while login
userSchema.methods.generateAuthToken = async function(){
    try{    
        let token = jwt.sign({_id: this._id}, process.env.TOKEN_SECRET);
        //console.log(token);
        this.tokens = this.tokens.concat({token: token});
        await this.save();
        return token;
    }catch(err){
        console.log(err);
    }
}

const User = mongoose.model('USER',userSchema);

module.exports = User;