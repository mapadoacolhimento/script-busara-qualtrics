import crypto from "crypto";

export default function decryptData(encryptedData, key, iv) {
	try {
		const encryptionMethod = process.env.ENCRYPTION_METHOD;

		const buff = Buffer.from(encryptedData, "base64");
		// Converts encrypted data to utf8
		const decipher = crypto.createDecipheriv(encryptionMethod, key, iv);
		return (
			decipher.update(buff.toString("utf8"), "hex", "utf8") +
			decipher.final("utf8")
		); // Decrypts data and converts to utf8
	} catch (e) {
		console.error("error:", e);
		return null;
	}
}
