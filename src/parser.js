import { escape_word_map, single_pop_list, double_pop_list, custom_handling_list, escape_word_list } from './constants.js';
import { attach, toElement } from './utils.js';
import { special_to_div, SpecialExpressions } from './extra_renderers.js';


/**
 * 
 * @param {String} str Test the string to see if it matches the keyword thingy
 * @returns {String[]}
 */
function sense_maker(str) {
	return escape_word_list.filter(word => word.startsWith(str));
}


/**
 * The converter!
 *
 * @param {String[] | HTMLElement[]} tokens
 * @returns {HTMLDivElement}
 */
export function tex_to_div(tokens) {
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

	while (current_character_index < tokens.length) {
		// Need to handle braces here, not after, as then considered expression
		if (tokens[current_character_index] == "\\") {
			if (current_character_index + 1 < tokens.length && tokens[current_character_index + 1] == "{" || tokens[current_character_index+1] == "}") {
				expression_array.push(tokens[current_character_index+1]);
				current_character_index += 2;
				continue;
			}
		}
		if (tokens[current_character_index] == "{") {
			// If { is the last character, then let it be!
			if (current_character_index + 1 == tokens.length) {
				expression_array.push("{");
				current_character_index += 1;
				continue;
			}

			// Read till corresponding }
			// If no corresponding }, then error?
			// Or leave it unparsed, as a string?
			let inner_expression = [];
			var current_scope = 1;
			while (current_scope != 0) {
				// Another { increases scope, a } decreases scope
				current_character_index += 1;
				if (current_character_index > tokens.length) {
					break;
				}
				if (tokens[current_character_index] == "\\") {
					// Check if the next character is a brace
					if (current_character_index + 1 < tokens.length && 
					   (tokens[current_character_index + 1] == "{" || tokens[current_character_index + 1] == "}")) {
						// Push the backslash and the brace, then skip past them
						inner_expression.push(tokens[current_character_index]);
						current_character_index += 1;
						inner_expression.push(tokens[current_character_index]);
						continue; 
					}
				}

				if (tokens[current_character_index] == "{") {
					current_scope += 1;
				} else if (tokens[current_character_index] == "}") {
					current_scope -= 1;
				}

				// So i don't accidentally add the ending }
				if (current_scope != 0) {
					inner_expression.push(tokens[current_character_index]);
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
			expression_array.push(tokens[current_character_index]);
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
					let wrapper = attach(prev, sup_component, sub_component);
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
		}
		else if (element == "\\") {
			// Read till it matches only 1, and if that matches one does'nt exactly match, error ig
			element_index += 1;
			let matches = [];
			let previous_word = "";
			let current_word = "";
			do {
				matches = sense_maker(current_word);
				// Why previous_word here? Its because the current_word can be overwritten, to be longer, so I am preserving the previous data
				// To see if any of the matcches one equals it, if this loop exits or smth
				previous_word = current_word;

				let next = "";
				// yes assignment works in expressions too, like python walrus operator
				if (element_index >= expr_length || typeof(next = expression_array[element_index]) != "string" || sense_maker(current_word+next).length == 0) {
					// Check if current thing has one match or nah, if not, exit
					if (matches.includes(current_word)) {
						// let out_str = escape_word_map[current_word];
						if (single_pop_list.includes(current_word)) {
							// if next popped element is space, then just do printing unicode thingy
							// else, do the specialexpression object thing
							if (next == " " || next == "\u00A0") {
								if (Object.keys(escape_word_map).includes(current_word)){
									final_expression_array.push(escape_word_map[current_word])
								} else {
									// IDK, ig can ignore
									throw Error("Haven't implemented a space after a singlepop escape thingy")
								}
							} else {
								final_expression_array.push(new SpecialExpressions(current_word, [next]))
							}
							element_index += 1;
						} else if (double_pop_list.includes(current_word)) {
							// Do smth
							let data1 = next;
							if (element_index + 1 < expr_length) {
								let data2 = expression_array[element_index+1]
								final_expression_array.push(new SpecialExpressions(current_word, [data1, data2]))
							} else {
								throw Error("No two elements to pop!")
							}
							element_index += 2;
						} else if (custom_handling_list.includes(current_word)) {
							if (current_word == "attach") {
								
								// Take in 6 different inputs
								let data = [];
								for (let i = 0; i < 7; i++) {
									if (element_index + i < expr_length) {
										data.push(expression_array[element_index + i])
									} else {
										data.push(undefined);
									}
								}
								// console.log(data)
								final_expression_array.push(new SpecialExpressions(current_word, data));
								element_index += 7;
							}
							if (current_word == "attacho") {
								// Take in 7 different inputs
								let data = [];
								for (let i = 0; i < 8; i++) {
									if (element_index + i < expr_length) {
										data.push(expression_array[element_index + i])
									} else {
										data.push(undefined);
									}
								}
								final_expression_array.push(new SpecialExpressions(current_word, data));
								element_index += 8;
							}
						} else {
							let out_str = escape_word_map[current_word];
							final_expression_array.push(out_str);
						}
						break;
					}

					throw Error("Invalid Backslash Usage");
				}

				current_word += next;
				element_index += 1;
			} while (sense_maker(current_word).length > 0);
			element_index -= 1;
		} else {
			final_expression_array.push(expression_array[element_index]);
		}
		element_index += 1;
	}

	// Handle the SpecialExpressions


	// Now make this expression array to a div!
	let div_element = document.createElement("div");
	div_element.style.display = "inline-block";
	for (let element of final_expression_array) {
		if (element instanceof SpecialExpressions) {
			element = special_to_div(element)
		}
		div_element.append(element);
	}
	// console.log(final_expression_array);
	// This is so i can manage the copying
	div_element.dataset.source = tokens;
	return div_element;
}