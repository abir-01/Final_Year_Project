const User = require("../models/userModel")

const getAllUsers = async(req, res) => {
    const allusers = await User.find({});
    console.log(allusers)

    res.status(200).json({"All users":allusers})
}
const addUser = async (req, res) => {
    
    const { name, email, profilePhoto } = req.body;

    const newUser = await new User();
    newUser.name = name;
    newUser.email = email;
    newUser.profilePhoto = profilePhoto;
    // newUser.isAdmin = isAdmin;

    let error = "";
    try {
        await newUser.validate();
    } catch (err) {
        console.log(err.message.split(":")[2])
        error = err;
    }

    if (error) {
        res.status(400);
        throw new Error(error.message.split(": ")[2])
    }



    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
        res.status(400);
        throw new Error("User already registered!");
    }

    const user = await User.create({
        name,
        email,
        // isAdmin,
        profilePhoto
    });

    console.log(`User created ${user}`);
    if (user) {
        res.status(201).json({ _id: user.id, email: user.email,profilePhoto: profilePhoto });
    } else {
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({ message: "Register the user" });

}

module.exports = { getAllUsers, addUser }