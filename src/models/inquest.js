'use strict'

let mongoose = require('mongoose')
let Schema = mongoose.Schema

let inquestSchema =   Schema({
    title: String,
    description: String,
    opinion: {
        yes: Number,
        no: Number,
        maybe: Number,
        usersOpined: []
    },
    commentList: [
        {
            comment: String,
            commentUser: {type: Schema.ObjectId, ref: 'user'}
        }
    ],
    user: {type: Schema.ObjectId, ref: 'user'}
    
})

module.exports = mongoose.model('inquest', inquestSchema)