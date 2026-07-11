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
	} else if (spec_element.name == "under") {
		return attach(toElement(spec_element.data[1]), undefined, undefined, undefined, undefined, undefined, toElement(spec_element.data[0]), "0.5em")
	} else if (spec_element.name == "sqrt") {
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
		
	} else if (spec_element.name == "root") {
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
	} else if (spec_element.name == "cancel") {
		let content = toElement(spec_element.data[0]);

		let wrapper = document.createElement("span")
		wrapper.appendChild(content);

		wrapper.style.position = "relative";
		// An svg seems like the smartest way to do this.

		let svgNS = "http://www.w3.org/2000/svg";
		let svg = document.createElementNS(svgNS, "svg");
		svg.style.position = 'absolute';
		svg.style.top = '0';
		svg.style.left = '0';
		svg.style.width = '100%';
		svg.style.height = '100%';
		svg.style.pointerEvents = 'none'; // Allows clicks to pass through

		
		let line = document.createElementNS(svgNS, "line");
		line.setAttribute("x1", "100%"); // Right
		line.setAttribute("y1", "0");    // Top
		line.setAttribute("x2", "0");    // Left
		line.setAttribute("y2", "100%"); // Bottom
		line.setAttribute("stroke", "black");
		line.setAttribute("stroke-width", "1");

		svg.appendChild(line);
		wrapper.appendChild(svg);

		return wrapper;
		// throw Error("Not implemented cancel yet")
	} else if (spec_element.name == "cancelangle") {
		// Simply use css to draw a diagonal line from top right to bottom left over the content
		/** @type {String | HTMLDivElement} */
		let content = toElement(spec_element.data[1]);
		let angle = parseFloat(spec_element.data[0].innerText, 10);
		// console.log(angle);


		let wrapper = document.createElement("span")
		wrapper.appendChild(content);

		// Css here, cause angles very easy with that
		wrapper.style.display = "inline-block"
		wrapper.style.position = "relative";
		wrapper.style.overflow = 'hidden'; // Cause the line is very long, and is just clipped in the div
    	wrapper.style.setProperty('--line-angle', `${angle}deg`);

		let line = document.createElement('div');
    
		line.style.position = 'absolute';
		line.style.top = '50%';
		line.style.left = '50%';
		// Make it very very long
		line.style.width = '200vmax';
		line.style.height = '1px';
		line.style.backgroundColor = 'black';
		
		// Transform puts it in center, and rotate, well, i wonder what that does.
		line.style.transform = 'translate(-50%, -50%) rotate(var(--line-angle))';
		line.style.pointerEvents = 'none';

		let contentStyles = window.getComputedStyle(content);
		let contentZIndex = contentStyles.getPropertyValue('z-index');
		// console.log(contentZIndex);

		// If the content doesn't have a z-index set, it is "auto"
		if (contentZIndex === 'auto') {
			contentZIndex = 0;
		} else {
			contentZIndex = parseInt(contentZIndex, 10);
		}

		line.style.zIndex = contentZIndex + 1;
		wrapper.appendChild(line);

		return wrapper;
	} else if (spec_element.name == "canceldir") {
		
		/** @type {String | HTMLDivElement} */
		let content = toElement(spec_element.data[1]);
		let dir = spec_element.data[0].innerText;

		/** @type {String[]} */
		let dir_directions = [
			"tlbr", "brtl", "diagonal", "diag", "\\", "d",
			"trbl", "bltr", "antidiagonal", "antidiag", "adiag", "/", "ad",
			"ud", "du", "vertical", "vert", "v", "|",
			"lr", "rl", "horizontal", "horiz", "h", "-"
		]

		if (!dir_directions.includes(dir)) {
			throw Error("Invalid direction. ")
		}
		

		let wrapper = document.createElement("span")
		wrapper.appendChild(content);

		wrapper.style.position = "relative";
		// An svg seems like the smartest way to do this.

		let svgNS = "http://www.w3.org/2000/svg";
		let svg = document.createElementNS(svgNS, "svg");
		svg.style.position = 'absolute';
		svg.style.top = '0';
		svg.style.left = '0';
		svg.style.width = '100%';
		svg.style.height = '100%';
		svg.style.pointerEvents = 'none'; // Allows clicks to pass through

		
		let line = document.createElementNS(svgNS, "line");

		if (["tlbr", "brtl", "diagonal", "diag", "\\", "d"].includes(dir)) {
			line.setAttribute("x1", "0");
			line.setAttribute("y1", "0");
			line.setAttribute("x2","100%");
			line.setAttribute("y2","100%")
		} else if (["trbl", "bltr", "antidiagonal", "antidiag", "adiag", "/", "ad",].includes(dir)){
			line.setAttribute("x1", "100%");
			line.setAttribute("y1", "0");
			line.setAttribute("x2", "0");
			line.setAttribute("y2", "100%");
		} else if (["ud", "du", "vertical", "vert", "v", "|"].includes(dir)) {
			line.setAttribute("x1", "50%");
			line.setAttribute("y1", "0");
			line.setAttribute("x2", "50%");
			line.setAttribute("y2", "100%");
		} else if (["lr", "rl", "horizontal", "horiz", "h", "-"].includes(dir)) {
			line.setAttribute("x1", "0");
			line.setAttribute("y1", "50%");
			line.setAttribute("x2", "100%");
			line.setAttribute("y2", "50%");
		}
		line.setAttribute("stroke", "black");
		line.setAttribute("stroke-width", "1");

		svg.appendChild(line);
		wrapper.appendChild(svg);

		return wrapper;
	} else if (spec_element.name == "frac") {
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
	} else if (spec_element.name == "attach") {
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
	} else if (spec_element.name == "attacho") {
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
	} else if (spec_element.name == "attachos") {
		// The attacho is the same as attach, but with an extra parameter of overlap, which is used to control for too much distance, like for summations, use 0.3em
		return attach(
			toElement(spec_element.data[0]),
			toElement(spec_element.data[1]),
			toElement(spec_element.data[2]),
			toElement(spec_element.data[3]),
			toElement(spec_element.data[4]),
			toElement(spec_element.data[5]),
			toElement(spec_element.data[6]),
			spec_element.data[7].innerText, 
            parseFloat(spec_element.data[8].innerText, 10)
		)
	} else if (spec_element.name == "left") {
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
		
	} else if (spec_element.name == "right") {
		
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
	} else if (spec_element.name == "scale") {
        let amount = parseFloat(spec_element.data[0].innerText, 10);
        let content = toElement(spec_element.data[1]);
        content.style.zoom = amount;
        return content;
    } else if (spec_element.name == "scalew") { // NEED O FIX< ITS OINLY VISUAL
        let amount = parseFloat(spec_element.data[0].innerText, 10);
        let content = toElement(spec_element.data[1]);
        content.style.transform = `scaleX(${amount})`;
        content.style.transformOrigin = "left center";
        return content;
    } else if (spec_element.name == "scaleh") {
        let amount = parseFloat(spec_element.data[0].innerText, 10);
        let content = toElement(spec_element.data[1]);
        content.style.transform = `scaleY(${amount})`;
        content.style.transformOrigin = "center top";
        return content;
    } else if (spec_element.name == "rotate") {
        let amount = parseFloat(spec_element.data[0].innerText, 10);
        let content = toElement(spec_element.data[1]);
        content.style.transform = `rotate(${amount}deg)`;
        return content;
    } else {
        throw Error(`Unimplemented special expression ${spec_element.name}`)
    }

}




