const enc = new TextEncoder();

const getPasswordKey = (password) =>
	window.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
		"deriveKey",
	]);

export default getPasswordKey;
