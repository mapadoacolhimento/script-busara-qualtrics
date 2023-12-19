import crypto from "crypto";

function encryptData(data, key, iv) {
	const encryptionMethod = process.env.ENCRYPTION_METHOD;
	const cipher = crypto.createCipheriv(encryptionMethod, key, iv);
	return Buffer.from(
		cipher.update(data, "utf8", "hex") + cipher.final("hex"),
	).toString("base64");
}

export default encryptData;
