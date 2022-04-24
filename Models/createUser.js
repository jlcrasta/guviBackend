const mongoose = require('mongoose');

const createUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name required']
    },
    email: {
        type: String,
        required: [true, 'Email required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    }
})

module.exports = mongoose.model('CreateUser', createUserSchema);