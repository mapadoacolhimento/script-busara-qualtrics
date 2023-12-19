import crypto from "crypto";
import encryptData from "./src/encrypt";
import decryptData from "./src/decrypt";

const sleep = (ms) =>
	new Promise((r) => {
		setTimeout(r, ms);
	});

const secretKey = process.env.SECRET_KEY;
const secretIv = process.env.SECRET_IV;

const key = crypto
	.createHash("sha512")
	.update(secretKey)
	.digest("hex")
	.substring(0, 32);

const iv = crypto
	.createHash("sha512")
	.update(secretIv)
	.digest("hex")
	.substring(0, 16);

if (typeof window !== "undefined") {
	window.addEventListener("DOMContentLoaded", () => {
		const form = document.getElementById("widget-16850");
		const emailInput = form.querySelector("input[type=email]");

		emailInput.addEventListener("change", (e) => {
			const email = e.target.value;
			console.log("email", email);

			const encryptedEmail = encryptData(email, key, iv);
			window.BusaraEmailHash = encryptedEmail;
			console.log("encryptedData", encryptedEmail);
		});

		const submitBtn = form.querySelector("button");

		async function handleFormSubmit() {
			await sleep(5000);

			console.log("decrypted", decryptData(window.BusaraEmailHash, key, iv));

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
}

console.log(
	"decrypted",
	decryptData("MGUwNmRkZmY3NWIxNzY4OTc0ZmM5N2ViNTU3ODM5ZmM=", key, iv),
);
