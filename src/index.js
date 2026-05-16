// Only works on a tiny subset of latex
// TODO:
// Sum, integrals
// rot{}{} (so i can do ellipses but diagonal!)

import { tex_to_div } from './parser.js';

class MEqElement extends HTMLElement {
	connectedCallback() {
		let source = this.childNodes;
		// If its string, then seperate them, if some other object like img, then keep it together.

		let tokens = [];
		for (let token of source) {
			if (token.nodeType == Node.TEXT_NODE) {
				let cleanText = token.textContent.replace(/\n\s*/g, '');
				cleanText = cleanText.replaceAll(" ", "\u00A0");
				
				tokens.push(...cleanText);
			} else {
				// The cloneNode allows deep copy, I don't rly want shadow copy
				tokens.push(token.cloneNode(true))
			}
		}

		this.innerHTML = "";
		this.appendChild(tex_to_div(tokens));



		// AI CONTENT BELOW
		// This observer thing updates the sqrt whenever the svg loads
		const observer = new ResizeObserver(() => {
			let symbols = Array.from(this.querySelectorAll(".math-sqrt-symbol")).reverse();

			for (let sym of symbols) {
				let cont = sym.nextElementSibling;
				if (!cont || !cont.classList.contains("math-sqrt-content")) continue;

				// 1. Temporarily clear the scale. 
				// If we don't do this, getBoundingClientRect() will measure the ALREADY scaled height
				// and the math will shrink back to 1 on the second run!
				sym.style.transform = "none";

				// 2. Measure the true heights
				let contHeight = cont.getBoundingClientRect().height;
				let symHeight = sym.getBoundingClientRect().height;

				// 3. Apply the perfect scale
				if (symHeight > 0) {
					let scaleY = contHeight / symHeight * 0.95;
					sym.style.transform = `scale(1, ${scaleY})`;
				}
			}
		});

		// Tell the observer to watch every single math content box in this equation.
		let contents = this.querySelectorAll(".math-sqrt-content");
		for (let cont of contents) {
			observer.observe(cont);
		}



		const observer2 = new ResizeObserver(() => {
			let symbols = Array.from(this.querySelectorAll(".math-brace-symbol")).reverse();

			for (let sym of symbols) {
				let cont = sym.nextElementSibling;
				// Handle \right brackets where the content is BEFORE the brace
				if (!cont || !cont.classList.contains("math-brace-content")) {
					cont = sym.previousElementSibling;
				}
				if (!cont || !cont.classList.contains("math-brace-content")) continue;

				// 1. Temporarily clear the scale. 
				// If we don't do this, getBoundingClientRect() will measure the ALREADY scaled height
				// and the math will shrink back to 1 on the second run!
				sym.style.transform = "none";

				// 2. Measure the true heights
				let contHeight = cont.getBoundingClientRect().height;
				let symHeight = sym.getBoundingClientRect().height;

				// 3. Apply the perfect scale
				if (symHeight > 0) {
					let scaleY = contHeight / symHeight * 1;
					let shiftY = contHeight * -0.07; // Needed a small shift upwards

					sym.style.transform = `translateY(${shiftY}px) scale(1, ${scaleY})`;
					// sym.style.transform = `scale(1, ${scaleY})`;
				}
			}
		});

		// Tell the observer to watch every single math content box in this equation.
		contents = this.querySelectorAll(".math-brace-content");
		for (let cont of contents) {
			observer2.observe(cont);
		}
	}
}


// Create m-eqi for insignificant spaces, above considers spaces as significant and preserves them
class MEqIElement extends HTMLElement {
	connectedCallback() {
		let source = this.childNodes;
		// If its string, then seperate them, if some other object like img, then keep it together.

		let tokens = [];
		for (let token of source) {
			if (token.nodeType == Node.TEXT_NODE) {
				tokens.push(...token.textContent);
			} else {
				// The cloneNode allows deep copy, I don't rly want shadow copy
				tokens.push(token.cloneNode(true))
			}
		}

		this.innerHTML = "";
		this.appendChild(tex_to_div(tokens));



		// AI CONTENT BELOW
		// This observer thing updates the sqrt whenever the svg loads
		const observer = new ResizeObserver(() => {
			let symbols = Array.from(this.querySelectorAll(".math-sqrt-symbol")).reverse();

			for (let sym of symbols) {
				let cont = sym.nextElementSibling;
				if (!cont || !cont.classList.contains("math-sqrt-content")) continue;

				// 1. Temporarily clear the scale. 
				// If we don't do this, getBoundingClientRect() will measure the ALREADY scaled height
				// and the math will shrink back to 1 on the second run!
				sym.style.transform = "none";

				// 2. Measure the true heights
				let contHeight = cont.getBoundingClientRect().height;
				let symHeight = sym.getBoundingClientRect().height;

				// 3. Apply the perfect scale
				if (symHeight > 0) {
					let scaleY = contHeight / symHeight * 0.95;
					sym.style.transform = `scale(1, ${scaleY})`;
				}
			}
		});

		// Tell the observer to watch every single math content box in this equation.
		let contents = this.querySelectorAll(".math-sqrt-content");
		for (let cont of contents) {
			observer.observe(cont);
		}



		const observer2 = new ResizeObserver(() => {
			let symbols = Array.from(this.querySelectorAll(".math-brace-symbol")).reverse();

			for (let sym of symbols) {
				let cont = sym.nextElementSibling;
				// Handle \right brackets where the content is BEFORE the brace
				if (!cont || !cont.classList.contains("math-brace-content")) {
					cont = sym.previousElementSibling;
				}
				if (!cont || !cont.classList.contains("math-brace-content")) continue;

				// 1. Temporarily clear the scale. 
				// If we don't do this, getBoundingClientRect() will measure the ALREADY scaled height
				// and the math will shrink back to 1 on the second run!
				sym.style.transform = "none";

				// 2. Measure the true heights
				let contHeight = cont.getBoundingClientRect().height;
				let symHeight = sym.getBoundingClientRect().height;

				// 3. Apply the perfect scale
				if (symHeight > 0) {
					let scaleY = contHeight / symHeight * 1;
					let shiftY = contHeight * -0.07; // Needed a small shift upwards

					sym.style.transform = `translateY(${shiftY}px) scale(1, ${scaleY})`;
					// sym.style.transform = `scale(1, ${scaleY})`;
				}
			}
		});

		// Tell the observer to watch every single math content box in this equation.
		contents = this.querySelectorAll(".math-brace-content");
		for (let cont of contents) {
			observer2.observe(cont);
		}
	}
}

customElements.define("m-eq", MEqElement);
customElements.define("m-eqi", MEqIElement);


// TODO:
// Want a regenerate function (like remakes the divs, of a specified part?), maybe for animations?


// let sample = document.createElement("div")
// sample.innerText = "Σ"
// let sample_up = document.createElement("div")
// sample_up.innerText = "n"
// let sample_down = document.createElement("div")
// sample_down.innerText = "r=1"


// document.body.append(attach(sample,undefined,undefined, undefined, undefined, sample_up, sample_down, "0.3em"))

