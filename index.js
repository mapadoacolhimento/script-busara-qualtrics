// for large strings, use this from https://stackoverflow.com/a/49124600
const buff_to_base64 = (buff) => btoa(
	new Uint8Array(buff).reduce(
		(data, byte) => data + String.fromCharCode(byte), ''
	)
);

const enc = new TextEncoder();

const getPasswordKey = (password) =>
	window.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
		"deriveKey",
	]);

const deriveKey = (passwordKey, salt, keyUsage) =>
	window.crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: salt,
			iterations: 250000,
			hash: "SHA-256",
		},
		passwordKey,
		{ name: "AES-GCM", length: 256 },
		false,
		keyUsage
	);

async function encryptData(secretData, password) {
	try {
		const salt = window.crypto.getRandomValues(new Uint8Array(16));
		const iv = window.crypto.getRandomValues(new Uint8Array(12));
		const passwordKey = await getPasswordKey(password);
		const aesKey = await deriveKey(passwordKey, salt, ["encrypt"]);
		const encryptedContent = await window.crypto.subtle.encrypt(
			{
				name: "AES-GCM",
				iv: iv,
			},
			aesKey,
			enc.encode(secretData)
		);

		const encryptedContentArr = new Uint8Array(encryptedContent);
		let buff = new Uint8Array(
			salt.byteLength + iv.byteLength + encryptedContentArr.byteLength
		);
		buff.set(salt, 0);
		buff.set(iv, salt.byteLength);
		buff.set(encryptedContentArr, salt.byteLength + iv.byteLength);
		const base64Buff = buff_to_base64(buff);
		return base64Buff;
	} catch (e) {
		console.log(`Error - ${e}`);
		return "";
	}
}

window.addEventListener("DOMContentLoaded", function () {
	console.log("content has loaded")
	const form = document.getElementById("widget-16850")
	const emailInput = form.querySelector("input[type=email]")

	emailInput.addEventListener("change", (e) => {
		console.log("value", e.target.value)
		const email = e.target.value
		console.log("email", email)
		const password = process.env.SECRET_KEY
		encryptData(email, password).then((eData) => console.log("encryptedData", eData))
	})
});