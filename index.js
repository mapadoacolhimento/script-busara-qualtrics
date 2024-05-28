import crypto from "crypto";
import encryptData from "./src/encrypt";
// import decryptData from "./src/decrypt";
// import data from "./data.json";

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
		console.log({ form, emailInput });

		emailInput.addEventListener("change", (e) => {
			const email = e.target.value.toLowerCase();
			const encryptedEmail = encryptData(email, key, iv);
			window.BusaraEmailHash = encryptedEmail;
		});

		const submitBtn = form.querySelector("button");

		function addElement(link) {
			try {
				// create a new div element
				const newLink = document.createElement("a");

				// and give it some content
				const newContent = document.createTextNode(
					"Clique aqui para acessar a pesquisa.",
				);

				// add the text node to the newly created link
				newLink.appendChild(newContent);

				newLink.setAttribute("href", link);

				// add the newly created element and its content into the DOM
				const currentSpan = document.querySelector("[data-key='399']");
				currentSpan.insertAdjacentElement("beforebegin", newLink);
			} catch (e) {
				console.log(`addElement: ${e}`);
			}
		}

		async function handleFormSubmit() {
			try {
				await sleep(2000);
				console.log({ hash: window.BusaraEmailHash });
				if (typeof window.BusaraEmailHash === "undefined") return false;

				const hasInputs = form.getElementsByTagName("input").length > 0;
				console.log({ hasInputs });
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

					addElement(link);
					await sleep(5000);
					window.location.href = link;

					return true;
				}

				return false;
			} catch (e) {
				console.log(`handleFormSubmit: ${e}`);
				return false;
			}
		}

		submitBtn.addEventListener("click", handleFormSubmit);
	});
}

// const decryptedEmails = data.map((hash) => decryptData(hash, key, iv));

// console.log("res:", JSON.stringify(decryptedEmails));
