// Only works on a tiny subset of latex

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

/**
 * 
 * @param {SpecialExpressions} spec_element 
 * @returns {HTMLDivElement}
 */
function special_to_div(spec_element) {
	if (spec_element.name == "over") {
		return attach(spec_element.data[1], undefined, undefined, undefined, undefined, spec_element.data[0], undefined, "0.5em")
	}
	if (spec_element.name == "under") {
		return attach(spec_element.data[1], undefined, undefined, undefined, undefined, undefined, spec_element.data[0], "0.5em")
	}
	if (spec_element.name == "sqrt") {
		throw Error("Not implemented sqrt yet")
	}
	if (spec_element.name == "cancel") {
		throw Error("Not implemented cancel yet")
	}
	if (spec_element.name == "frac") {
		throw Error("Not implemented fractions yet")
	}
	if (spec_element.name == "root") {
		throw Error("Not implemented roots yet")
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
	"root"
	// Question, how do i do multi line braces?
	// Latex does it with \left and \right, so can prob do that.
])
// The idea will be to keep scanning forward, till only one of them satisfies
// If none match, then just print the \ as normal
// If multiple match at one point and then none match, then i want the longest ones, sorted it

// Refers to functions, which pop the next argument behind them.
var single_pop_list = ["sqrt", "cancel"]; 
var double_pop_list = ["over","under","frac","root"];
var custom_handling_list = ["sqrt"]; // For sqrt, i want it to be usable as a character and a function. SO if sqrt is followed by a string, tis character, if followed by a div, its function

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
								if (current_word == "sqrt"){
									final_expression_array.push(new SpecialExpressions(current_word, [next]))
								} else {
									throw Error("Not implemented other single pop functions")
								}
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




let sample = document.createElement("div")
sample.innerText = "Σ"
let sample_up = document.createElement("div")
sample_up.innerText = "n"
let sample_down = document.createElement("div")
sample_down.innerText = "r=1"


document.body.append(attach(sample,undefined,undefined, undefined, undefined, sample_up, sample_down, "0.3em"))

