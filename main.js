// Only works on a tiny subset of latex

class SpecialExpressions {
	/**
	 * Creates an instance of SpecialExpressions.
	 * @param {String} name
	 * @param {*} [data={}] // Like a ^ would store what expression is behind it, or a frac would store two expressions
	 * @memberof SpecialExpressions
	 */
	constructor(name, data = {}) {
		this.name = name;
		this.data = data;
	}
}


/**
 * Handles all subscript superscript and display like blocks direction
 *
 * @param {HTMLDivElement | String} main_element
 * @param {HTMLDivElement | String} sup
 * @param {HTMLDivElement | String} sub
 * @param {HTMLDivElement | String} lsup
 * @param {HTMLDivElement | String} lsub
 * @param {HTMLDivElement | String} up
 * @param {HTMLDivElement | String} down
 * @param {string} [overlap="0em"] Used to control for too far away, like for summations, use 0.3em
 * @return {HTMLDivElement} 
 */
function attach(main_element, sup, sub, lsup, lsub, up, down, overlap = "0em") {
	const wrapper = document.createElement("span");
	wrapper.style.display = "inline-flex";
	wrapper.style.alignItems = "stretch";  // instead of "center"



	function makeScript(content, pushDown, overlapSide) {
		const d = document.createElement("span");
		d.style.zoom = 0.6;
		if (pushDown) d.style.marginTop = "auto";
		else d.style.marginBottom = "auto";
		if (overlap !== "0em") d.style[overlapSide] = `-${overlap}`;
		d.append(content);
		return d;
	}

	if (lsup || lsub) {
		const leftCol = document.createElement("span");
		leftCol.style.display = "inline-flex";
		leftCol.style.flexDirection = "column";
		if (lsup) leftCol.appendChild(makeScript(lsup, false, "marginBottom"));
		if (lsub) leftCol.appendChild(makeScript(lsub, true, "marginTop"));
		wrapper.appendChild(leftCol);
	}

	const mainSpan = document.createElement("span");
	mainSpan.style.lineHeight = "1";
	mainSpan.append(main_element);
	// and on mainSpan:
	mainSpan.style.display = "flex";
	mainSpan.style.alignItems = "center";


	wrapper.appendChild(mainSpan);

	if (sup || sub || up || down) {
		const rightCol = document.createElement("span");
		rightCol.style.display = "inline-flex";
		rightCol.style.flexDirection = "column";
		rightCol.style.alignItems = "flex-start";
		if (sup || up) rightCol.appendChild(makeScript(sup ?? up, false, "marginBottom"));
		if (sub || down) rightCol.appendChild(makeScript(sub ?? down, true, "marginTop"));
		wrapper.appendChild(rightCol);
	}

	return wrapper;
}

function toElement(item) {
	if (typeof item === "string") {
		const span = document.createElement("span");
		span.textContent = item;
		return span;
	}
	return item;
}


/**
 * The converter!
 *
 * @param {String} test_string
 * @returns {HTMLDivElement}
 */
function tex_to_div(test_string) {
	/**
	 * On appearance of {, read till you see corresponding } (not an inner })
	 * And recursively ask for tex_to_div on that substring
	 *
	 */

	// First we split the string into subexpressions
	// Ie, a list, containing all characters,
	// and any occurance of { makes the inner expression a div element, which will be in out list

	let current_character_index = 0;

	/** @type {(String | HTMLDivElement)[]} */
	let expression_array = [];

	while (current_character_index < test_string.length) {
		// Need to handle braces here, not after, as then considered expression
		if (test_string[current_character_index] == "\\") {
			if (current_character_index + 1 < test_string.length && test_string[current_character_index + 1] == "{") {
				expression_array.push("{");
				current_character_index += 2;
				continue;
			}
		}
		if (test_string[current_character_index] == "{") {
			// If { is the last character, then let it be!
			if (current_character_index + 1 == test_string.length) {
				expression_array.push("{");
				current_character_index += 1;
				continue;
			}

			// Read till corresponding }
			// If no corresponding }, then error?
			// Or leave it unparsed, as a string?
			let inner_expression = "";
			var current_scope = 1;
			while (current_scope != 0) {
				// Another { increases scope, a } decreases scope
				current_character_index += 1;
				if (current_character_index > test_string.length) {
					break;
				}

				if (test_string[current_character_index] == "{") {
					current_scope += 1;
				} else if (test_string[current_character_index] == "}") {
					current_scope -= 1;
				}

				// So i don't accidentally add the ending }
				if (current_scope != 0) {
					inner_expression += test_string[current_character_index];
				}
			}
			// Probably unterminated }, just write the string as it then
			// But maybe better to let it be!
			// if (current_character_index > test_string.length) {
			// 	expression_array.push(inner_expression);
			// 	continue;
			// }
			// console.log(inner_expression);
			let inner_div = tex_to_div(inner_expression);
			expression_array.push(inner_div);
		} else {
			expression_array.push(test_string[current_character_index]);
		}
		current_character_index += 1;
	}

	// The \stuff shall be compacted to one token, with their data!
	/** @type {(String | HTMLDivElement)[]} */
	let final_expression_array = [];
	let element_index = 0;
	let expr_length = expression_array.length;
	while (element_index < expr_length) {
		let element = expression_array[element_index];
		// The ^ and _ for sigma are handled later, in the \sigma or \sum declaration

		if (element == "^" || element == "_") {
			if (element_index + 1 < expr_length) {
				element_index += 1;
				let first_component = expression_array[element_index];
				let isSup = element == "^";

				// Check if the paired symbol immediately follows
				// If ^ and _ are both there, then i want the contents to be together
				let otherSymbol = isSup ? "_" : "^";
				let hasPair = element_index + 2 < expr_length && expression_array[element_index + 1] == otherSymbol;

				if (hasPair) {
					element_index += 2;
					let second_component = expression_array[element_index];

					let sup_component = isSup ? first_component : second_component;
					let sub_component = isSup ? second_component : first_component;

					let prev = toElement(final_expression_array.pop() ?? document.createElement("span"));
					wrapper = attach(prev, sup_component, sub_component);
					final_expression_array.push(wrapper);
				} else {
					if (isSup) {
						let prev = toElement(final_expression_array.pop() ?? document.createElement("span"));
						final_expression_array.push(attach(prev, first_component));
					} else {
						let prev = toElement(final_expression_array.pop() ?? document.createElement("span"));
						final_expression_array.push(attach(prev, undefined, first_component));
					}
				}


			} else {
				final_expression_array.push(element);
			}
		} else {
			final_expression_array.push(expression_array[element_index]);
		}
		element_index += 1;
	}

	// Now make this expression array to a div!
	let div_element = document.createElement("div");
	div_element.style.display = "inline-block";
	for (let element of final_expression_array) {
		div_element.append(element);
	}
	// console.log(final_expression_array);
	// This is so i can manage the copying
	div_element.dataset.source = test_string;
	return div_element;
}

customElements.define("m-eq", class extends HTMLElement {
	connectedCallback() {
		const source = this.textContent;
		this.textContent = "";
		this.appendChild(tex_to_div(source));

		this.addEventListener("copy", (e) => {
			e.preventDefault();
			const selection = window.getSelection();
			if (!selection.rangeCount) return;

			const range = selection.getRangeAt(0);

			// Walk up from the selection's start container to find
			// the deepest div with a source that fully contains the range
			let node = range.commonAncestorContainer;
			while (node && node !== this) {
				if (node.dataset?.source !== undefined) {
					// Check it fully contains the selection
					if (node.contains(range.startContainer) && node.contains(range.endContainer)) {
						e.clipboardData.setData("text/plain", node.dataset.source);
						return;
					}
				}
				node = node.parentNode;
			}

			// Fallback to full source
			e.clipboardData.setData("text/plain", source);
		});
	}
});

// let sample = document.createElement("div")
// sample.innerText = "Σ"
// let sample_up = document.createElement("div")
// sample_up.innerText = "n"
// let sample_down = document.createElement("div")
// sample_down.innerText = "r=1"


// document.body.append(attach(sample,undefined,undefined, undefined, undefined, sample_up, sample_down, "0.3em"))

