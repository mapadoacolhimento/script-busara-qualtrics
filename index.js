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

	function openSurvey() {
		// eslint-disable-next-line no-restricted-globals
		const check = confirm("Você aceita participar da nossa pesquisa?");
		if (!check) return;
		window.open(
			`https://busara.iad1.qualtrics.com/jfe/form/SV_3ltkrtQdVfXYEt0?user_id=${window.BusaraEmailHash}`,
			"_blank",
		);
	}

	async function handleFormSubmit() {
		await sleep(5000);

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
			const surveyLink = process.env.SURVEY_LINK;
			window.location.href = `${surveyLink}?user_id=${window.BusaraEmailHash}`;

			return true;
		}

		console.log("não encontramos a msg de agradecimento");
		return false;
	}

	submitBtn.addEventListener("click", handleFormSubmit);
});
