// backend/db.js
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017")

// Create a Schema for Users
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    balance:{
        type:Number,
        required:true
    }
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

accountSchema.pre('save', async function(next) {
    try {
        const user = await mongoose.model('User').findById(this.userId);
        if (!user) {
            throw new Error('User not found');
        }
        this.balance = user.balance;
        next();
    } catch (error) {
        next(error);
    }
});

const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);

module.exports = {
    User,
    Account
};