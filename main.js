// Only works on a tiny subset of latex
test_expression = "2^{3+4_{2+2^{noo}=4}^{5}} whoaa";

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
		if (test_string[current_character_index] == "{") {
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
			if (current_character_index > test_string.length) {
				expression_array.push(inner_expression);
				continue;
			}
			console.log(inner_expression);
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

					let wrapper = document.createElement("div");
					wrapper.style.display = "inline-block";
					wrapper.style.verticalAlign = "middle";

					let sup_div = document.createElement("div");
					sup_div.append(sup_component);
					sup_div.style.zoom = 0.6;

					let sub_div = document.createElement("div");
					sub_div.append(sub_component);
					sub_div.style.zoom = 0.6;

					wrapper.appendChild(sup_div);
					wrapper.appendChild(sub_div);
					final_expression_array.push(wrapper);
				} else {
					// original single ^ or _ handling unchanged
					let smaller_div = document.createElement("div");
					smaller_div.append(first_component);
					smaller_div.style.display = "inline-block";
					smaller_div.style.zoom = 0.6;
					smaller_div.style.position = "relative";
					smaller_div.style.lineHeight = "1";
					if (isSup) {
						smaller_div.style.bottom = "0.5em";
						smaller_div.style.transformOrigin = "bottom left";
					} else {
						smaller_div.style.top = "0.3em";
						smaller_div.style.transformOrigin = "top left";
					}
					final_expression_array.push(smaller_div);
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
	console.log(final_expression_array);
	return div_element;
}
let test_div = tex_to_div(test_expression)
test_div.style.scale = 4;
test_div.style.transformOrigin = "top left"
document.body.appendChild(test_div);
