const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
salt_factor = 8;
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    userName:String,
    password:String,
    email:{
        type: String,
        unique: true
    },
    firstName:String,
    lastName:String,
});

userSchema.methods.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(salt_factor), null);
};

module.exports = mongoose.model("User", userSchema);