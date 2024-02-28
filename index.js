import crypto from "crypto";
import encryptData from "./src/encrypt";

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
			const email = e.target.value.toLowerCase();
			const encryptedEmail = encryptData(email, key, iv);
			window.BusaraEmailHash = encryptedEmail;
		});

		const submitBtn = form.querySelector("button");

		async function handleFormSubmit() {
			await sleep(5000);

			if (typeof window.BusaraEmailHash === "undefined") return false;

			const hasInputs = form.getElementsByTagName("input").length > 0;

			if (hasInputs) {
				return false;
			}

			const allText = form.querySelectorAll("span");
			const thankUMsgs = [...allText].filter((thankUMsg) =>
				thankUMsg.textContent.includes("Recebemos seu pedido de ajuda"),
			);

			if (thankUMsgs.length > 0) {
				submitBtn.removeEventListener("click", handleFormSubmit);
				const surveyLink = process.env.SURVEY_LINK;
				const link = `${surveyLink}?user_id=${window.BusaraEmailHash}`;
				window.location.href = link;

				return true;
			}

			return false;
		}

		submitBtn.addEventListener("click", handleFormSubmit);
	});
}
