const express = require("express");
const app = express();

require("dotenv").config();
const mongoose = require('mongoose');

const userRoutes = require("./routes/user.routes");
const blogRoutes = require("./routes/blog.routes");

async function main(){
const PORT = process.env.PORT;

await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/a(bc)+d", (req, res) => {
  res.send("abcd");
});
app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);

//application-level middleware
app.use((req, res, next) => {
  req.currentTime = new Date();
  next();
});

//specific route-level middleware
app.use('/about',(req,res,next)=>{
    req.currentTime =new Date();
    next();
  })

app.all("**", (req, res) => {
  res.status(404).send("404 page not found");
});
app.listen(PORT, () => console.log(`server is running for localhost ${PORT}`));
}
main().catch(err=>console.error(err));