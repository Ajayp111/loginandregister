const express = require("express");
const mongoose = require("mongoose");
const Registeruser = require("./model");
const jwt = require("jsonwebtoken");
const app = express();

mongoose
  .connect(
    "mongodb+srv://ajayperumalla1111:Ajayuser123@cluster0.flbkqhq.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Db connected"));

app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmpassword } = req.body;

    let exist = await Registeruser.findOne({ email });
    if (exist) {
      return res.status(400).send("User Already exist");
    }
    if (password !== confirmpassword) {
      return res.status(400).send("Passwords are not matching");
    }
    let newUser = new Registeruser({
      username,
      email,
      password,
      confirmpassword,
    });
    await newUser.save();
    res.status(200).send("Register Successfully");
  } catch (err) {
    console.log(err);
    return res.status.send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let exist = await Registeruser.findOne({ email });
    if (!exist) {
      return res.status(400).send("User Not Found");
    }
    if (exist.password !== password) {
      return res.status(400).send("Invalid Credentials");
    }
    let payload = {
      user: {
        id: exist.id,
      },
    };
    jwt.sign(payload, "jwtSecret", { expiresIn: 3600000 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("server Error");
  }
});

app.get("/myprofile", middleware, async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

app.listen(5002, () => {
  console.log("server is running ");
});
