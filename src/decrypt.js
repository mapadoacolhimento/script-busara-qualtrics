import deriveKey from "./deriveKey";
import getPasswordKey from "./getPasswordKey";

const base64ToBuf = (b64) =>
	Uint8Array.from(atob(b64), (c) => c.charCodeAt(null));

const dec = new TextDecoder();

export default async function decryptData(encryptedData, password) {
	try {
		const encryptedDataBuff = base64ToBuf(encryptedData);
		const salt = encryptedDataBuff.slice(0, 16);
		const iv = encryptedDataBuff.slice(16, 16 + 12);
		const data = encryptedDataBuff.slice(16 + 12);
		const passwordKey = await getPasswordKey(password);
		const aesKey = await deriveKey(passwordKey, salt, ["decrypt"]);
		const decryptedContent = await window.crypto.subtle.decrypt(
			{
				name: "AES-GCM",
				iv,
			},
			aesKey,
			data,
		);
		return dec.decode(decryptedContent);
	} catch (e) {
		console.log(`Error - ${e}`);
		return "";
	}
}
