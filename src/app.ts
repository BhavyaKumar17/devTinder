import express from "express";

const app = express();

app.use("/",(req,res)=>{res.send("Hello from Home route")});

app.use("/test",(req,res)=>{res.send("Hello from Test route")});


app.listen(3000,() => {
    console.log("Server is running on port 3000");
})

console.log("Hello, World!");