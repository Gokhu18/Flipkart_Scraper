const Promise = require("bluebird");
const User = require("../models/user");
const userService = require("../services/userservice");

module.exports.addUser = userDetails => {
    return new Promise((resolve, reject) => {
        try {
            User.findOne({
                email: userDetails.email
            })
                .exec()
                .then(user => {
                    console.log("query success");
                    console.log(user);

                    if (user) {
                        message = "User already registered";
                        return resolve(message);
                    }
                    let newUser = new User(userDetails);
                    newUser.email = userDetails.email;
                    newUser.firstName = userDetails.firstName;
                    newUser.lastName = userDetails.lastName;
                    newUser.userName = userDetails.userName;
                    newUser.password = newUser.generateHash(userDetails.password);
                    console.log("password hashed");
                    newUser.save().then(savedUser => resolve("ok"));
                })
                .catch(err => reject(err));
        } catch (error) {
            console.log(error);
            return reject(error);
        }
    });
};

