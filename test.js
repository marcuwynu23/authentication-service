const db = require("./db/db")

db()
.then(c=>{
	c.collection("tester").insertOne({name: "Mark"})
})

