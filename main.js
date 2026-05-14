// Only works on a tiny subset of latex

// This attach function below was written by llms, not me, sorry
// I really didn't want to deal with css formatting thingy
// TODO: Reimplement it myself
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
	// Use inline-block so it dictates its baseline naturally with surrounding text
	wrapper.style.display = "inline-block";
	wrapper.style.whiteSpace = "nowrap";

	function makeScript(content, overlapSide) {
		const d = document.createElement("span");
		d.style.zoom = 0.6;
		
		if (overlap !== "0em") d.style[overlapSide] = `-${overlap}`;
		d.append(content);
		return d;
	}

	// 1. Left Attachments (lsup / lsub)
	if (lsup || lsub) {
		const leftCol = document.createElement("span");
		leftCol.style.display = "inline-flex";
		leftCol.style.flexDirection = "column";
		leftCol.style.alignItems = "flex-end"; 

		if (lsup && lsub) leftCol.style.verticalAlign = "middle";
		else if (lsup) leftCol.style.verticalAlign = "super";
		else if (lsub) leftCol.style.verticalAlign = "sub";

		if (lsup) leftCol.appendChild(makeScript(lsup, "marginBottom"));
		if (lsub) leftCol.appendChild(makeScript(lsub, "marginTop"));
		wrapper.appendChild(leftCol);
	}

	// 2. Center Attachments (up / main / down)
	const centerCol = document.createElement("span");
	
	// If limits exist, set the center structure to safely stack items vertically.
	// vertical-align: middle keeps big operators safely centered relative to the text line.
	if (up || down) {
		centerCol.style.display = "inline-flex";
		centerCol.style.flexDirection = "column";
		centerCol.style.alignItems = "center";
		centerCol.style.verticalAlign = "middle";
	}

	if (up) centerCol.appendChild(makeScript(up, "marginBottom"));

	const mainSpan = document.createElement("span");
	mainSpan.style.lineHeight = "1";
	mainSpan.append(main_element);
	centerCol.appendChild(mainSpan);

	if (down) centerCol.appendChild(makeScript(down, "marginTop"));
	
	wrapper.appendChild(centerCol);

	// 3. Right Attachments (sup / sub)
	if (sup || sub) {
		const rightCol = document.createElement("span");
		rightCol.style.display = "inline-flex";
		rightCol.style.flexDirection = "column";
		rightCol.style.alignItems = "flex-start";

		if (sup && sub) rightCol.style.verticalAlign = "middle";
		else if (sup) rightCol.style.verticalAlign = "super";
		else if (sub) rightCol.style.verticalAlign = "sub";

		if (sup) rightCol.appendChild(makeScript(sup, "marginBottom"));
		if (sub) rightCol.appendChild(makeScript(sub, "marginTop"));
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


class SpecialExpressions {
	/**
	 * Creates an instance of SpecialExpressions.
	 * @param {String} name
	 * @param {*} [data=[]] // Like a ^ would store what expression is behind it, or a frac would store two expressions
	 * @memberof SpecialExpressions
	 */
	constructor(name, data = []) {
		this.name = name;
		this.data = data;
	}
}


/**
 * 
 * @param {SpecialExpressions} spec_element 
 * @returns {HTMLDivElement}
 */
function special_to_div(spec_element) {
	if (spec_element.name == "over") {
		return attach(toElement(spec_element.data[1]), undefined, undefined, undefined, undefined, toElement(spec_element.data[0]), undefined, "0.5em")
	}
	if (spec_element.name == "under") {
		return attach(toElement(spec_element.data[1]), undefined, undefined, undefined, undefined, undefined, toElement(spec_element.data[0]), "0.5em")
	}
	if (spec_element.name == "sqrt") {
		// sqrt is a single pop function, so has one piece of data

		/** @type {String | HTMLDivElement} */
		let content = spec_element.data[0];


		// Want a sqrt symbol like thing, ok whole size of div, and will border above
		// Can use the unicode symbol itself, seems nice
		// But I want it to scale with the div!
		// Can use svg for that ig
		// Will stick to text cause text is selectable


		let sub_div = document.createElement("span")
		sub_div.style.display = "inline-block"
		sub_div.style.borderTop = "solid thin"
		sub_div.classList.add("math-sqrt-content")
		sub_div.style.zoom = 0.9;
		sub_div.appendChild(content)


		let out_div = document.createElement("span");
		out_div.style.display = "inline-flex";
		out_div.style.alignItems = "flex-end"; // makes the sqrt symbol start from bottom

		let outer_sub_div = document.createElement("span");

		outer_sub_div.textContent = "√"
		// I can't get the size of the inner div rn, cause its computed later. 
		// So will have to update the scale later, and hence marking it with class
		outer_sub_div.classList.add("math-sqrt-symbol")
		outer_sub_div.style.transformOrigin = "bottom center";
		outer_sub_div.style.lineHeight = "1";
		outer_sub_div.style.display = "inline-block";

		

		out_div.appendChild(outer_sub_div);

		out_div.appendChild(sub_div);
		return out_div;
		
	}
	if (spec_element.name == "cancel") {
		throw Error("Not implemented cancel yet")
	}
	if (spec_element.name == "frac") {
		let numerator = toElement(spec_element.data[0]);
		let denominator = toElement(spec_element.data[1]);
		
		let frac_div = document.createElement("span");
		frac_div.style.display = "inline-flex";
		frac_div.style.flexDirection = "column";
		frac_div.style.alignItems = "center"; 
		frac_div.style.verticalAlign = "middle"; // Makes the bar basically line up inline
		frac_div.style.whiteSpace = "nowrap";
		frac_div.style.lineHeight = "1";
		frac_div.style.zoom = 0.8;
		
		// Numerator
		let numSpan = document.createElement("span");
		numSpan.style.display = "inline-block";
		numSpan.style.paddingBottom = "0.05em";
		numSpan.appendChild(numerator);
		frac_div.appendChild(numSpan);
		
		// Fraction bar, separate instead of border on both numerator and denom cause i can adjust it more easily
		let bar = document.createElement("span");
		bar.style.display = "inline-block";
		bar.style.width = "100%"; 
		bar.style.borderTop = "solid 0.05em";
		bar.style.margin = "0.05em 0";
		frac_div.appendChild(bar);
		

		let denSpan = document.createElement("span");
		denSpan.style.display = "inline-block";
		denSpan.style.paddingTop = "0.05em";
		denSpan.appendChild(denominator);
		frac_div.appendChild(denSpan);
		
		return frac_div;
	}
	if (spec_element.name == "root") {
		/** @type {String | HTMLDivElement} */
		let content = spec_element.data[1];


		// Want a sqrt symbol like thing, ok whole size of div, and will border above
		// Can use the unicode symbol itself, seems nice
		// But I want it to scale with the div!
		// Can use svg for that ig
		// Will stick to text cause text is selectable


		let sub_div = document.createElement("span")
		sub_div.style.display = "inline-block"
		sub_div.style.borderTop = "solid thin"
		sub_div.classList.add("math-sqrt-content")
		sub_div.style.zoom = 0.9;
		sub_div.appendChild(content)


		let out_div = document.createElement("span");
		out_div.style.display = "inline-flex";
		out_div.style.alignItems = "flex-end"; // makes the sqrt symbol start from bottom

		let outer_sub_div = document.createElement("span");

		outer_sub_div.textContent = "√"
		// I can't get the size of the inner div rn, cause its computed later. 
		// So will have to update the scale later, and hence marking it with class
		outer_sub_div.classList.add("math-sqrt-symbol")
		outer_sub_div.style.transformOrigin = "bottom center";
		outer_sub_div.style.lineHeight = "1";
		outer_sub_div.style.display = "inline-block";

		

		out_div.appendChild(outer_sub_div);

		out_div.appendChild(sub_div);

		// Currently terrible implementation, will fix later
		let upper_element = toElement(spec_element.data[0]);
		upper_element.style.zoom = 0.7;

		return attach(out_div, undefined, undefined, upper_element);
	}
	if (spec_element.name == "attach") {
		return attach(
			toElement(spec_element.data[0]),
			toElement(spec_element.data[1]),
			toElement(spec_element.data[2]),
			toElement(spec_element.data[3]),
			toElement(spec_element.data[4]),
			toElement(spec_element.data[5]),
			toElement(spec_element.data[6]),
			"0.3em"
		)
		// throw Error("How did this even run?")
	}
	if (spec_element.name == "attacho") {
		// The attacho is the same as attach, but with an extra parameter of overlap, which is used to control for too much distance, like for summations, use 0.3em
		return attach(
			toElement(spec_element.data[0]),
			toElement(spec_element.data[1]),
			toElement(spec_element.data[2]),
			toElement(spec_element.data[3]),
			toElement(spec_element.data[4]),
			toElement(spec_element.data[5]),
			toElement(spec_element.data[6]),
			spec_element.data[7].innerText // The overlap parameter
		)
	}
}


// var escape_word_list = [
// 	"sum", "sumb", "prod",
// 	"union", "cup", "bigcup", // Unions
// 	"intersect", "cap", "bigcap", // Intersections

// 	// Greek
// 	"alpha", "a",
// 	"beta", "b",
// 	"gamma", "g",
// 	"delta", "d",
// 	"epsilon", "e",
// 	"zeta", "z",
// 	"eta", "h",
// 	"theta", "th",
// 	"iota", "i",
// 	"kappa", "k",
// 	"lambda", "l",
// 	"mu", "m",
// 	"nu", "n",
// 	"xi", "x",
// 	"omicron", "o",
// 	"pi", "p",
// 	"rho", "r",
// 	"sigma", "s",
// 	"tau", "t",
// 	"upsilon", "u",
// 	"phi", "f",
// 	"chi", "c",
// 	"psi", "ps",
// 	"omega", "w",

// 	// Capital
// 	"Alpha", "A",
// 	"Beta", "B",
// 	"Gamma", "G",
// 	"Delta", "D",
// 	"Epsilon", "E",
// 	"Zeta", "Z",
// 	"Eta", "H",
// 	"Theta", "Th",
// 	"Iota", "I",
// 	"Kappa", "K",
// 	"Lambda", "L",
// 	"Mu", "M",
// 	"Nu", "N",
// 	"Xi", "X",
// 	"Omicron", "O",
// 	"Pi", "P",
// 	"Rho", "R",
// 	"Sigma", "S",
// 	"Tau", "T",
// 	"Upsilon", "U",
// 	"Phi", "F",
// 	"Chi", "C",
// 	"Psi", "Ps",
// 	"Omega", "W",
// ]

var escape_word_map = {
	"sum": "Σ",
	"sumb": "Σ",
	"prod": "∏",
	"union": "∪",
	"cup": "∪",
	"bigcup": "∪",
	"intersect": "∩",
	"cap": "∩",
	"bigcap": "∩",
	"alpha": "α",
	"a": "α",
	"beta": "β",
	"b": "β",
	"gamma": "γ",
	"g": "γ",
	"delta": "δ",
	"d": "δ",
	"epsilon": "ε",
	"e": "ε",
	"zeta": "ζ",
	"z": "ζ",
	"eta": "η",
	"h": "η",
	"theta": "θ",
	"th": "θ",
	"iota": "ι",
	"i": "ι",
	"kappa": "κ",
	"k": "κ",
	"lambda": "λ",
	"l": "λ",
	"mu": "μ",
	"m": "μ",
	"nu": "ν",
	"n": "ν",
	"xi": "ξ",
	"x": "ξ",
	"omicron": "ο",
	"o": "ο",
	"pi": "π",
	"p": "π",
	"rho": "ρ",
	"r": "ρ",
	"sigma": "σ",
	"s": "σ",
	"tau": "τ",
	"t": "τ",
	"upsilon": "υ",
	"u": "υ",
	"phi": "φ",
	"f": "φ",
	"chi": "χ",
	"c": "χ",
	"psi": "ψ",
	"ps": "ψ",
	"omega": "ω",
	// Capitals
	"Alpha": "Α",
	"A": "Α",
	"Beta": "Β",
	"B": "Β",
	"Gamma": "Γ",
	"G": "Γ",
	"Delta": "Δ",
	"D": "Δ",
	"Epsilon": "Ε",
	"E": "Ε",
	"Zeta": "Ζ",
	"Z": "Ζ",
	"Eta": "Η",
	"H": "Η",
	"Theta": "Θ",
	"Th": "Θ",
	"Iota": "Ι",
	"I": "Ι",
	"Kappa": "Κ",
	"K": "Κ",
	"Lambda": "Λ",
	"L": "Λ",
	"Mu": "Μ",
	"M": "Μ",
	"Nu": "Ν",
	"N": "Ν",
	"Xi": "Ξ",
	"X": "Ξ",
	"Omicron": "Ο",
	"O": "Ο",
	"Pi": "Π",
	"P": "Π",
	"Rho": "Ρ",
	"R": "Ρ",
	"Sigma": "Σ",
	"S": "Σ",
	"Tau": "Τ",
	"T": "Τ",
	"Upsilon": "Υ",
	"U": "Υ",
	"Phi": "Φ",
	"F": "Φ",
	"Chi": "Χ",
	"C": "Χ",
	"Psi": "Ψ",
	"Ps": "Ψ",
	"Omega": "Ω",

	// Maths
	"leq": "≤",
	"geq": "≥",
	"neq": "≠",
	"times": "×",
	"div": "÷",
	"pm": "±",
	"mp": "∓",
	"cdot": "⋅",
	"to": "→",
	"infty": "∞",
	"approx": "≈",
	"cong": "≅",
	"equiv": "≡",
	"sim": "∼",
	"simeq": "≃",
	"nequiv": "≢",
	"ncong": "≇",
	"nsim": "≁",
	"nsimeq": "≄",
	"napprox": "≉",

	"prop": "∝",
	"propto": "∝",
	"in": "∈",
	"notin": "∉",
	"subset": "⊂",
	"subseteq": "⊆",
	"supset": "⊃",
	"supseteq": "⊇",

	"int": "∫",
	"iint": "∬",
	"iiint": "∭",
	"oint": "∮",
	"sqrt": "√",

	// Arrows
	"leftarrow": "←",
	"rightarrow": "→",
	"uparrow": "↑",
	"downarrow": "↓",
	"leftrightarrow": "↔",
	"rightleftarrows": "⇌",
	"mapsto": "↦",
	"equivalent": "⇔",
	"implies": "⇒",
	"iff": "⇔",
	"Leftarrow": "⇐",
	"Rightarrow": "⇒",
	"Uparrow": "⇑",
	"Downarrow": "⇓",
	"LeftRightarrow": "⇔",
	"Longrightarrow": "⟶",
	"Longleftarrow": "⟵",
	"Longleftrightarrow": "⟷",
	"Longmapsto": "⟼",
	"LongLeftarrow": "⟸",
	"LongRightarrow": "⟹",
	"LongEquiv": "⟺",
	"^": "^", // Like printing the characters, not actually using them
	"_": "_",
	"\\": "\\"
};

var escape_word_list = Object.keys(escape_word_map).sort((a, b) => b.length - a.length);

// This is for functions, which don't also have an explicit symbol
escape_word_list.push(...[
	"over", // So \over{a}{b} means put b above a
	"under",
	"cancel", // \cancel{} Makes a diagonal strikethrough the character/expression, like in ≠
	"frac", // \frac{a}{b} is explicitly division, so a above b with a horizontal line between
	"root",
	"attach", // \attach{}{}{}{}{}{}{}
	"attacho" // Like attach, but also additional parameter of overlap
	// Question, how do i do multi line braces?
	// Latex does it with \left and \right, so can prob do that.
])
// The idea will be to keep scanning forward, till only one of them satisfies
// If none match, then just print the \ as normal
// If multiple match at one point and then none match, then i want the longest ones, sorted it

// Refers to functions, which pop the next argument behind them.
var single_pop_list = ["sqrt", "cancel"]; 
var double_pop_list = ["over","under","frac","root"];
var custom_handling_list = ["attach", "attacho"]; // For sqrt, i want it to be usable as a character and a function. SO if sqrt is followed by a string, tis character, if followed by a div, its function

// TODO: Need to support multi lines?


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
 * @param {String | } tokens
 * @returns {HTMLDivElement}
 */
function tex_to_div(tokens) {
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
			if (current_character_index + 1 < tokens.length && tokens[current_character_index + 1] == "{") {
				expression_array.push("{");
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
							if (next == " ") {
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

customElements.define("m-eq", class extends HTMLElement {
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

	}
});




let sample = document.createElement("div")
sample.innerText = "Σ"
let sample_up = document.createElement("div")
sample_up.innerText = "n"
let sample_down = document.createElement("div")
sample_down.innerText = "r=1"


document.body.append(attach(sample,undefined,undefined, undefined, undefined, sample_up, sample_down, "0.3em"))

