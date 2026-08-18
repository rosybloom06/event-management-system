const mongoose = require("mongoose");
const User = require("./models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {

        const users = await User
            .find()
            .select("name email role");

        console.log(users);

        process.exit();

    })
    .catch(error => {
        console.log(error);
        process.exit(1);
    });