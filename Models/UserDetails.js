const mongoose = require('mongoose')


const userDetailsSchema = new mongoose.Schema({
    user: {
        type: String,
        required: [true, 'User required']
    },
    age: {
        type: Number,
        required: [true, 'Age required']
    },
    gender: {
        type: String,
        required: [true, 'Gender required']
    },
    DOB: {
        type: String,
        required: [true, 'Date required']
    },

    mobile: {
        type: Number,
        required: [true, 'NUmber required']
    }

})

module.exports = mongoose.model('userDetails', userDetailsSchema);