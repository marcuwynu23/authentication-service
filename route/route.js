require("dotenv").config()
const express = require("express")
const bcryptjs = require('bcryptjs')
const dbo = require("../db/db-operation")
const model = require("../model/model")
const sendEmail = require('../lib/mail')
const constants = require("../constants");
const tk = require("../lib/toolkit")




const ObjectId = require('mongodb').ObjectId;


let loginRoute = express.Router();

loginRoute.get("/", (req, res) => {
	res.render("login.html", { ctx: constants });
})

loginRoute.post("/", (req, res) => {
	let username = req.body.username;
	let password = req.body.password;

	dbo.getAllAcountData((err, dataArray) => {
		let isMatched = false;

		dataArray.forEach(v => {
			isMatched = (v.username === username &&  bcryptjs.compareSync(password,v.password))
		})

		if (isMatched) {
			return res.redirect("/")
		} else {
			return res.render("login.html", { ctx: constants, isError: true });
		}

	})
})


let registerRoute = express.Router();
registerRoute.get("/", (req, res) => {
	res.render("register.html", { ctx: constants });

})

registerRoute.post("/", (req, res) => {
	let isError = false;
	let isSuccess = false;
	const uid = new ObjectId()
	if (req.body.password1 === req.body.password2) {
		console.log(req.body.password1)
		console.log("password matched.");
		dbo.insertAccount(model.Account(
			uid,
			req.body.firstName,
			req.body.middleName,
			req.body.lastName,
			req.body.birthday,
			tk.codeGenerator(),
			req.body.email,
			req.body.username,
			bcryptjs.hashSync(req.body.password1, 13)
		), (err) => {

			if (err == undefined) {
				dbo.insertAddress(
					new model.Address(
						uid,
						req.body.houseAddr,
						req.body.city,
						req.body.province
					),
					(err) => {

						if (err != undefined) {
							isError = true;
							isSuccess = false;
							console.log("Address Insertion Error: ", err);
						}
					})
				isSuccess = true;
				
			} else {
				isError = true;
				isSuccess = false;
				console.log("Account Insertion Error:", err);
				
			}

			return res.render("register.html", { ctx: constants, isError: isError, isSuccess: isSuccess });
		})
	}
})







let recoveryRoute = express.Router();

recoveryRoute.get("/", (req, res) => {
	res.render("recovery.html", { ctx: constants });
})

recoveryRoute.post("/", (req, res) => {
	dbo.getAcountDataByEmail(req.body.email, (docs) => {
		sendEmail(`Recovery code: ${docs.recoveryCode.toString()}`, req.body.email)
			.then(result => console.log(result))
			.catch(error => console.error(error))
	})
	res.render("recovery.html", { ctx: constants });

})





recoveryRoute.get("/confirm", (req, res) => {
	res.render("confirm-recovery.html", { ctx: constants });

	


})

recoveryRoute.post("/confirm", (req, res) => {
	if (req.body.password1 === req.body.password2) {
		dbo.getAcountDataByCode(req.body.recoveryCode, (docs) => {
			
			let password = req.body.password1
			let recoveryCode = req.body.recoveryCode

			dbo.updateAccount(recoveryCode, password, (err) => {
				if(err == undefined){
					console.log(err);
				}else{
					console.log("Update Account password successfully!")
				}
			})

			
		})
	}
	res.render("confirm-recovery.html", { ctx: constants });

})



module.exports = {
	loginRoute: loginRoute,
	registerRoute: registerRoute,
	recoveryRoute: recoveryRoute
}