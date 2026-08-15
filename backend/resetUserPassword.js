const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

require("dotenv").config();

const newPassword = "Bikash@123";

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {

        const user = await User.findOne({
            email: "bikash@example.com"
        });

        if (!user) {
            console.log("User not found");
            process.exit();
        }

        user.password = await bcrypt.hash(
            newPassword,
            10
        );

        await user.save();

        console.log(
            "Password reset successfully!"
        );

        console.log(
            "Email: bikash@example.com"
        );

        console.log(
            "Password: Bikash@123"
        );

        process.exit();

    })
    .catch(error => {

        console.error(
            "Error:",
            error
        );

        process.exit(1);
    });