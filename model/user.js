const mongoose = require("mongoose");
const crypto=require("crypto");
const jwt=require("jsonwebtoken");
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    phone_no: {
        type: Number,
        unique: [true, 'Phone_no is already registered']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    dob: {
        type: Date
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "others"]
    },
    occupation: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmEmailToken: String,
    isEmailConfirmed: {
        type: Boolean,
        default: false,
    },
    twoFactorCode: String,
    twoFactorCodeExpire: Date,
    twoFactorEnable: {
        type: Boolean,
        default: false,
    },
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
});
//Encrypting password using bcrypt
userSchema.pre('save', async function (next) {
    
    //checking if Password is modifide then only this will execute
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

// this will calculate the current age of the user
userSchema.methods.getAge = (dob) => {
    var birthday = new Date(dob);
    return ~~((Date.now() - birthday) / (31557600000));
}

// This will generate Signed Jwt Token by id 
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

//Generate email confirm token
userSchema.methods.generateEmailConfirmToken = function (next) {
    // email confirmation token
    const confirmationToken = crypto.randomBytes(20).toString('hex');
    this.confirmEmailToken = crypto.createHash('sha256').update(confirmationToken).digest('hex');
    const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
    const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`;
    return confirmTokenCombined;
};

const user = mongoose.model('User', userSchema);

module.exports = user;