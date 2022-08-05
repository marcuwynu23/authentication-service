require("dotenv").config()


const path = require("path")
const express = require("express");
const session = require("express-session")
const nunjucks = require("nunjucks")
const constants = require("./constants")
const logger = require('morgan')




const {loginRoute, recoveryRoute, registerRoute} = require("./route/route")


const app = express()
nunjucks.configure(path.resolve(__dirname,'view'),{
  express:app,
  autoscape:true,
  noCache:false,
  watch:true
})

app.use(logger('dev',{}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(session({
  secret:"secret of the star",
  saveUninitialized: false,
  resave: false
}))
app.use(express.static(path.join(__dirname,'public')))

app.get("/",(req,res)=>{
  return res.render("index.html",{})
})


app.use("/login",loginRoute)
app.use("/register",registerRoute)
app.use("/recovery",recoveryRoute)



app.listen(process.env.PORT,(err)=>{
  if(err){
    console.log(err)
   }else{
    console.log(`Web Server: Running on Port ${process.env.PORT}...`)
   }
});