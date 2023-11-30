import encryptData from "./src/encrypt";

window.addEventListener("DOMContentLoaded", () => {
	console.log("content has loaded");
	const form = document.getElementById("widget-16850");
	const emailInput = form.querySelector("input[type=email]");

	emailInput.addEventListener("change", (e) => {
		console.log("value", e.target.value);
		const email = e.target.value;
		console.log("email", email);
		const password = process.env.SECRET_KEY;
		encryptData(email, password).then((eData) =>
			console.log("encryptedData", eData),
		);
	});
});
