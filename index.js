const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

app.use(cors());
app.use(express.json({
	limit: '50mb'
}));
app.use(express.urlencoded({extended:true}));

mongoose.set('strictQuery',true);

mongoose.connect("mongodb+srv://admin:admin123@clusterbatch248.hg26zix.mongodb.net/capstone-2-tolang?retryWrites=true&w=majority",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	}
);

let db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>console.log("Hi! We are connected to MongoDB Atlas!"))


app.use("/users",userRoutes);
app.use("/products",productRoutes);

app.listen(process.env.PORT || 4000, ()=>{

	console.log(`API is now online on port ${process.env.PORT || 4000}`)

})