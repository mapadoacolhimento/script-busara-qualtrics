import encryptData from "./src/encrypt";

const sleep = (ms) =>
	new Promise((r) => {
		setTimeout(r, ms);
	});

window.addEventListener("DOMContentLoaded", () => {
	console.log("content has loaded");
	const form = document.getElementById("widget-16850");
	const emailInput = form.querySelector("input[type=email]");

	emailInput.addEventListener("change", (e) => {
		const email = e.target.value;
		console.log("email", email);
		const password = process.env.SECRET_KEY;
		encryptData(email, password).then((eData) => {
			window.BusaraEmailHash = eData;
			console.log("encryptedData", eData);
		});
	});

	const submitBtn = form.querySelector("button");

	async function handleFormSubmit() {
		await sleep(2000);

		const hasInputs = form.getElementsByTagName("input").length > 0;

		if (hasInputs) {
			console.log("form ainda não submetido");
			return false;
		}

		const allText = form.querySelectorAll("span");
		const thankUMsgs = [...allText].filter((thankUMsg) =>
			thankUMsg.textContent.includes("Recebemos seu pedido de ajuda"),
		);

		if (thankUMsgs.length > 0) {
			console.log(thankUMsgs.map((msg) => console.log(msg.textContent)));
			submitBtn.removeEventListener("click", handleFormSubmit);

			return true;
		}

		console.log("não encontramos a msg de agradecimento");
		return false;
	}

	submitBtn.addEventListener("click", handleFormSubmit);
});
