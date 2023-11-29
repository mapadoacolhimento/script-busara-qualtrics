window.addEventListener("DOMContentLoaded", function () {
	console.log("content has loaded")
	const form = document.getElementById("widget-16850")
	const emailInput = form.querySelector("input[type=email]")
	emailInput.addEventListener("change", (e) => {
		console.log("value", e.target.value)
	})
});