const ObjectId = require('mongodb').ObjectId;


function Account(id, firstName, middleName, lastName, birthday, recoveryCode, email, username, password) {
	return {
		_id: id,
		firstName: firstName,
		middleName: middleName,
		lastName: lastName,
		birthday: birthday,
		recoveryCode: recoveryCode,
		email: email,
		username: username,
		password: password,
	}

}

function Address(acc_id, houseAddr, town, province) {
	return {
		acc_id: acc_id,
		houseAddr: houseAddr,
		town: town,
		province: province,
	}

}


module.exports = {
	Account: Account,
	Address: Address
}