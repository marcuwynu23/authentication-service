require("dotenv").config()
const nodemailer = require("nodemailer")
const {google} = require("googleapis")

//configuring google oauth2 requirement
let oauth2 = new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URI)
oauth2.setCredentials({refresh_token: process.env.REFRESH_TOKEN})


// function for sending email
async function sendEmail(data,email){
	try {
		let ACCESS_TOKEN = oauth2.getAccessToken()
		let auth = {
			type: "OAuth2",
			user: process.env.EMAIL,
			pass: process.env.PASS,
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			refreshToken: process.env.REFRESH_TOKEN,
			accessToken: ACCESS_TOKEN
		}
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth:auth,
		});
	let result = await transporter.sendMail({
			from: process.env.EMAIL,
			to: email,
			subject: "Kalapatids Account Recovery",
			text: data,
			html: `
			<div>
			<p style="font-weight: bold">
			${data}
			</p>
			<p style="font-size:7pt">
				@2022 kalapatid.developers.com
				Coloy-coloy,Sipocot, Camarines Sur, Bicol, PH
			</p>
			</div>
			`
		});
		return result
	} catch (error) {
		console.error(error);
	}
}








module.exports = sendEmail;