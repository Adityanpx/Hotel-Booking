const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
    _id: {type: String, required:true},
    username: {type: String, required:true},
    email: {type: String, required:true},
    image: {type: String, required:true},
    role: {type: String, required:true},
    recentSearchedCities: [{type:String, required:true}],

},{timestamps:true});


module.exports = mongoose.model("user1", userSchema)