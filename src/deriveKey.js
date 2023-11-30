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

export default deriveKey;
