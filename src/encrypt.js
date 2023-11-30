import getPasswordKey from "./getPasswordKey";

const enc = new TextEncoder();

// for large strings, use this from https://stackoverflow.com/a/49124600
const buffToBase64 = (buff) =>
	btoa(
		new Uint8Array(buff).reduce(
			(data, byte) => data + String.fromCharCode(byte),
			"",
		),
	);

const deriveKey = (passwordKey, salt, keyUsage) =>
	window.crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt,
			iterations: 250000,
			hash: "SHA-256",
		},
		passwordKey,
		{ name: "AES-GCM", length: 256 },
		false,
		keyUsage,
	);

export default async function encryptData(secretData, password) {
	try {
		const salt = window.crypto.getRandomValues(new Uint8Array(16));
		const iv = window.crypto.getRandomValues(new Uint8Array(12));
		const passwordKey = await getPasswordKey(password);
		const aesKey = await deriveKey(passwordKey, salt, ["encrypt"]);
		const encryptedContent = await window.crypto.subtle.encrypt(
			{
				name: "AES-GCM",
				iv,
			},
			aesKey,
			enc.encode(secretData),
		);

		const encryptedContentArr = new Uint8Array(encryptedContent);
		const buff = new Uint8Array(
			salt.byteLength + iv.byteLength + encryptedContentArr.byteLength,
		);
		buff.set(salt, 0);
		buff.set(iv, salt.byteLength);
		buff.set(encryptedContentArr, salt.byteLength + iv.byteLength);
		const base64Buff = buffToBase64(buff);
		return base64Buff;
	} catch (e) {
		console.log(`Error - ${e}`);
		return "";
	}
}
