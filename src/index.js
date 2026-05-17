// Only works on a tiny subset of latex
// TODO:
// Sum, integrals
// rot{}{} (so i can do ellipses but diagonal!)
// scale

import { tex_to_div } from './parser.js';

function setupAttachObserver(root) {
	const attachObserver = new ResizeObserver((entries) => {
		for (let entry of entries) {
			const main = entry.target;
			const wrapper = main.closest(".math-attach-wrapper");
			if (!wrapper) continue;

			const rightCol = wrapper.querySelector(".math-attach-right");
			if (!rightCol) continue;

			// Remember the original vertical-align on first observation
			if (!rightCol.dataset.originalVerticalAlign) {
				rightCol.dataset.originalVerticalAlign = rightCol.style.verticalAlign || "baseline";
			}

			// Clear previous tweaks so we measure natural height
			rightCol.style.height = "";
			rightCol.style.justifyContent = "";
			rightCol.style.verticalAlign = rightCol.dataset.originalVerticalAlign;

			const mainHeight = main.offsetHeight;
			const rightHeight = rightCol.offsetHeight;

			// Only stretch when main is substantially taller than the script column.
			// Normal math (a^3_4, nested scripts) is left untouched.
			if (mainHeight > rightHeight * 1.8 && rightHeight > 0) {
				rightCol.style.height = mainHeight + "px";
				rightCol.style.verticalAlign = "bottom";

				const hasSup = rightCol.querySelector(".math-attach-sup");
				const hasSub = rightCol.querySelector(".math-attach-sub");

				if (hasSup && hasSub) {
					rightCol.style.justifyContent = "space-between";
				} else if (hasSup) {
					rightCol.style.justifyContent = "flex-start";
				} else if (hasSub) {
					rightCol.style.justifyContent = "flex-end";
				}
			}
		}
	});

	const attachMains = root.querySelectorAll(".math-attach-main");
	for (let main of attachMains) {
		attachObserver.observe(main);
	}
}

class MEqElement extends HTMLElement {
	connectedCallback() {
		let source = this.childNodes;
		let tokens = [];
		for (let token of source) {
			if (token.nodeType == Node.TEXT_NODE) {
				let cleanText = token.textContent.replace(/\n\s*/g, '');
				cleanText = cleanText.replaceAll(" ", "\u00A0");
				tokens.push(...cleanText);
			} else {
				tokens.push(token.cloneNode(true))
			}
		}

		this.innerHTML = "";
		this.appendChild(tex_to_div(tokens));

		// sqrt scaling observer
		const observer = new ResizeObserver(() => {
			let symbols = Array.from(this.querySelectorAll(".math-sqrt-symbol")).reverse();
			for (let sym of symbols) {
				let cont = sym.nextElementSibling;
				if (!cont || !cont.classList.contains("math-sqrt-content")) continue;
				sym.style.transform = "none";
				let contHeight = cont.getBoundingClientRect().height;
				let symHeight = sym.getBoundingClientRect().height;
				if (symHeight > 0) {
					let scaleY = contHeight / symHeight * 0.95;
					sym.style.transform = `scale(1, ${scaleY})`;
				}
			}
		});
		let contents = this.querySelectorAll(".math-sqrt-content");
		for (let cont of contents) {
			observer.observe(cont);
		}

		// brace scaling observer
		const observer2 = new ResizeObserver(() => {
			let symbols = Array.from(this.querySelectorAll(".math-brace-symbol")).reverse();
			for (let sym of symbols) {
				let cont = sym.nextElementSibling;
				if (!cont || !cont.classList.contains("math-brace-content")) {
					cont = sym.previousElementSibling;
				}
				if (!cont || !cont.classList.contains("math-brace-content")) continue;
				sym.style.transform = "none";
				let contHeight = cont.getBoundingClientRect().height;
				let symHeight = sym.getBoundingClientRect().height;
				if (symHeight > 0) {
					let scaleY = contHeight / symHeight * 1;
					let shiftY = contHeight * -0.07;
					sym.style.transform = `translateY(${shiftY}px) scale(1, ${scaleY})`;
				}
			}
		});
		contents = this.querySelectorAll(".math-brace-content");
		for (let cont of contents) {
			observer2.observe(cont);
		}

		// sub/sup positioning observer for large elements
		setupAttachObserver(this);
	}
}

class MEqIElement extends HTMLElement {
	connectedCallback() {
		let source = this.childNodes;
		let tokens = [];
		for (let token of source) {
			if (token.nodeType == Node.TEXT_NODE) {
				tokens.push(...token.textContent);
			} else {
				tokens.push(token.cloneNode(true))
			}
		}

		this.innerHTML = "";
		this.appendChild(tex_to_div(tokens));

		const observer = new ResizeObserver(() => {
			let symbols = Array.from(this.querySelectorAll(".math-sqrt-symbol")).reverse();
			for (let sym of symbols) {
				let cont = sym.nextElementSibling;
				if (!cont || !cont.classList.contains("math-sqrt-content")) continue;
				sym.style.transform = "none";
				let contHeight = cont.getBoundingClientRect().height;
				let symHeight = sym.getBoundingClientRect().height;
				if (symHeight > 0) {
					let scaleY = contHeight / symHeight * 0.95;
					sym.style.transform = `scale(1, ${scaleY})`;
				}
			}
		});
		let contents = this.querySelectorAll(".math-sqrt-content");
		for (let cont of contents) {
			observer.observe(cont);
		}

		const observer2 = new ResizeObserver(() => {
			let symbols = Array.from(this.querySelectorAll(".math-brace-symbol")).reverse();
			for (let sym of symbols) {
				let cont = sym.nextElementSibling;
				if (!cont || !cont.classList.contains("math-brace-content")) {
					cont = sym.previousElementSibling;
				}
				if (!cont || !cont.classList.contains("math-brace-content")) continue;
				sym.style.transform = "none";
				let contHeight = cont.getBoundingClientRect().height;
				let symHeight = sym.getBoundingClientRect().height;
				if (symHeight > 0) {
					let scaleY = contHeight / symHeight * 1;
					let shiftY = contHeight * -0.07;
					sym.style.transform = `translateY(${shiftY}px) scale(1, ${scaleY})`;
				}
			}
		});
		contents = this.querySelectorAll(".math-brace-content");
		for (let cont of contents) {
			observer2.observe(cont);
		}

		setupAttachObserver(this);
	}
}

customElements.define("m-eq", MEqElement);
customElements.define("m-eqi", MEqIElement);