const express = require("express");
const router = express.Router();
const { getAllUsers, addUser }  = require("../controllers/userController")

router.get("/allusers", getAllUsers)
router.post("/registeruser", addUser)

module.exports = router