const db = require('./db')
const tk = require("../lib/toolkit")
const bcryptjs = require('bcryptjs')


function insertAccount(data, fn) {
	db.getCollection("accounts", (col) => {
		
		col.createIndex({ "email": 1 }, { unique: true })
		col.createIndex({ "username": 1 }, { unique: true })

		col.insertOne(data, (err) => {
			if (err) console.log(err);
			fn(err)
		})
	})

}



function getAllAcountData(fn) {
	db.getCollection("accounts", (col) => {
		col.find().toArray((err, docs) => {
			if (err) console.log(err);
			fn(err, docs)
		})
	})
}

function getAcountDataByEmail(email, fn) {
	db.getCollection("accounts", (col) => {
		col.findOne({ email: email }, (err, docs) => {
			if (err) console.log(err);
			fn(docs)
		})
	})
}

function getAcountDataByCode(recoveryCode, fn) {
	db.getCollection("accounts", (col) => {
		col.findOne({ recoveryCode: recoveryCode }, (err, docs) => {
			if (err) console.log(err);
			fn(docs)
		})
	})
}
function updateAccount(recoveryCode,newPassword,fn){
	db.getCollection("accounts", (col) => {
		col.updateOne({recoveryCode: recoveryCode}, 
			{$set:{recoveryCode: tk.codeGenerator(),password: bcryptjs.hashSync(newPassword, 13)}}, function(err) {
			if (err){ 
				fn(err)
				return
			}
			console.log("1 document updated");
		})
	})
}


function insertAddress(data, fn) {
	db.getCollection("addresses", (col) => {
		col.insertOne(data, (err) => {
			if (err) console.log(err);
			fn(err)
		})
	})
}

function getAddressData(fn) {
	db.getCollection("addresses", (col) => {
		col.find({}).toArray((err, docs) => {
			if (err) console.log(err);
			fn(docs)
		})
	})
}
function getAddressDataByID(id, fn) {
	db.getCollection("addresses", (col) => {
		col.find({ _id: id }).toArray((err, docs) => {
			if (err) console.log(err);
			fn(docs)
		})
	})
}







module.exports = {
	insertAccount: insertAccount,
	getAllAcountData: getAllAcountData,
	getAcountDataByEmail: getAcountDataByEmail,
	getAcountDataByCode: getAcountDataByCode,
	updateAccount: updateAccount,

	insertAddress: insertAddress,
	getAddressData: getAddressData,
	getAddressDataByID: getAddressDataByID
}