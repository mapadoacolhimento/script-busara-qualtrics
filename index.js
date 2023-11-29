const crypto = require('crypto')

const encryptionMethod = process.env.ENCRYPTION_METHOD
const secretKey = process.env.SECRET_KEY
const secretIv = process.env.SECRET_IV
const key = crypto
	.createHash('sha512')
	.update(secretKey)
	.digest('hex')
	.substring(0, 32)
const encryptionIV = crypto
	.createHash('sha512')
	.update(secretIv)
	.digest('hex')
	.substring(0, 16)

window.addEventListener("DOMContentLoaded", function () {
	console.log("content has loaded")
	const form = document.getElementById("widget-16850")
	const emailInput = form.querySelector("input[type=email]")
	emailInput.addEventListener("change", (e) => {
		console.log("value", e.target.value)
		const email = e.target.value
		const cipher = crypto.createCipheriv(encryptionMethod, key, encryptionIV)
		const hash = Buffer.from(
			cipher.update(email, 'utf8', 'hex') + cipher.final('hex')
		).toString('base64')
		console.log("email", email)
		console.log("hash", hash)
	})
});