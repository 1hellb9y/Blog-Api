const express=require("express");
const connectToDb = require("./config/ConnectToDb");
const app=express();
const helmet=require("helmet");
app.use(helmet());
const cors=require("cors");
app.use(cors());
const rateLimit=require("express-rate-limit");
const limitter=rateLimit({
    windowMs:10*60*1000,
    max:100,
    message:"To many requests from this IP, please try again later",
});
app.use(limitter);
require("dotenv").config();
const xss = require("xss-clean");
app.use(xss());

const port=process.env.PORT;
app.use(express.json());
const userRouter=require("./routes/User-Router");
const postRouter=require("./routes/Post-Router");

connectToDb();
app.use(userRouter);
app.use(postRouter);

app.listen(port,()=>{console.log(`Server listening port ${port}`)});

