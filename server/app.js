const express = require("express")
const dotenv = require("dotenv");
const emailRoutes = require("./routes/emailRoutes");
const mongoose = require("mongoose")
const UserModel = require('./models/User') 
const cors = require("cors")
const app = express()
dotenv.config();  
app.use(express.json())    
app.use(cors())
  

   
// MongoDB Connection 
mongoose.connect("mongodb://localhost:27017/user");

//Signup and login
app.use("/email", emailRoutes);


// Function to generate a four-digit unique user ID
const generateUniqueUserId = async () => {
    // Find the highest existing user ID in the database
    const highestUserId = await UserModel.findOne({}, { userId: 1 }, { sort: { userId: -1 } });

    let nextUserId;

    if (highestUserId) {
        // Increment the highest user ID by 1 and pad it with leading zeros
        nextUserId = String(Number(highestUserId.userId) + 1).padStart(4, '0');
    } else {
        // If there are no existing users, start with "0001"
         nextUserId = '0001';
    }
    return nextUserId;
};


// User Login  
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("Success")
                } else {
                    res.json("The Password is Incorrect")
                }
            } else {
                res.json("No Record Exist")
            }
        })
})    
  
// Post Method    
app.post('/register', async (req, res) => {
    try {
        const { role, type, teamLeaderName, member1, member2, member3, member4, name, email, mobileNo, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Name, Email, and Password are required fields.' });
        }
        // Generate a unique four-digit user ID       
        const userId = await generateUniqueUserId();
        const user = await UserModel.create({ userId, role, type, teamLeaderName, member1, member2, member3, member4, name, email, mobileNo, password })
        res.status(201).json(user);
    } catch (error) {    
        console.log(error);
        res.status(500).json({ message: 'Server error' });  
    }  
})             
  

  
        
// Server Listen    
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server is Running on port 3001")
    
})       