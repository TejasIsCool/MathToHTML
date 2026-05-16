import { attach, toElement } from './utils.js';

export class SpecialExpressions {
	/**
	 * Creates an instance of SpecialExpressions.
	 * @param {String} name
	 * @param {HTMLDivElement[]} [data=[]] // Like a ^ would store what expression is behind it, or a frac would store two expressions
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
export function special_to_div(spec_element) {
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
		out_div.style.verticalAlign = "middle";

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
		out_div.style.verticalAlign = "middle";

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
	if (spec_element.name == "attach") {
		return attach(
			toElement(spec_element.data[0]),
			toElement(spec_element.data[1]),
			toElement(spec_element.data[2]),
			toElement(spec_element.data[3]),
			toElement(spec_element.data[4]),
			toElement(spec_element.data[5]),
			toElement(spec_element.data[6]),
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

	if (spec_element.name == "left") {
		// Remember, the braces in the first input will come in a div, due to the way braces are parsed
		// so will need text content probably

		let brace = spec_element.data[0].innerText;
		let content = spec_element.data[1]

		let sub_div = document.createElement("span")
		sub_div.style.display = "inline-block"
		sub_div.classList.add("math-brace-content")
		// sub_div.style.zoom = 0.9;
		sub_div.appendChild(content)


		let out_div = document.createElement("span");
		out_div.style.display = "inline-flex";
		out_div.style.alignItems = "center"; // Center bracket with content
		out_div.style.verticalAlign = "middle"; // Center the whole block with surrounding text like f(x) =

		let outer_sub_div = document.createElement("span");

		outer_sub_div.textContent = brace;
		// I can't get the size of the inner div rn, cause its computed later. 
		// So will have to update the scale later, and hence marking it with class
		outer_sub_div.classList.add("math-brace-symbol")
		outer_sub_div.style.transformOrigin = "center center";
		outer_sub_div.style.lineHeight = "1";
		outer_sub_div.style.display = "inline-block";

		out_div.appendChild(outer_sub_div);

		out_div.appendChild(sub_div);
		return out_div;
		
		throw Error("Not implemented yet!")
	}
	if (spec_element.name == "right") {
		
		let brace = spec_element.data[0].innerText;
		let content = spec_element.data[1]

		let sub_div = document.createElement("span")
		sub_div.style.display = "inline-block"
		sub_div.classList.add("math-brace-content")
		// sub_div.style.zoom = 0.9;
		sub_div.appendChild(content)


		let out_div = document.createElement("span");
		out_div.style.display = "inline-flex";
		out_div.style.alignItems = "center"; // Center bracket with content
		out_div.style.verticalAlign = "middle"; // Center the whole block with surrounding text like f(x) =

		let outer_sub_div = document.createElement("span");

		outer_sub_div.textContent = brace;
		// I can't get the size of the inner div rn, cause its computed later. 
		// So will have to update the scale later, and hence marking it with class
		outer_sub_div.classList.add("math-brace-symbol")
		outer_sub_div.style.transformOrigin = "center center";
		outer_sub_div.style.lineHeight = "1";
		outer_sub_div.style.display = "inline-block";

		out_div.appendChild(sub_div);

		out_div.appendChild(outer_sub_div);
		return out_div;


		throw Error("Not implemented yet!")
	}

}




