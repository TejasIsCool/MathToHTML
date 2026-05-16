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
 * @param {number} [scale=0.6]
 * @return {HTMLDivElement} 
 */
export function attach(main_element, sup, sub, lsup, lsub, up, down, overlap = "0em", scale=0.6) {
	const wrapper = document.createElement("span");
	// Use inline-flex to force the side columns to stretch to the main element's height!
	wrapper.style.display = "inline-flex";
	wrapper.style.alignItems = "stretch";
	wrapper.style.verticalAlign = "middle";

	let scaleMult = 1;
	if (main_element instanceof HTMLElement && main_element.style.zoom) {
		scaleMult = parseFloat(main_element.style.zoom) || 1;
	}

	function makeScript(content, overlapSide) {
		const d = document.createElement("span");
		d.style.zoom = scale;
		d.style.display = "inline-flex";     // <--- ADD THIS
		d.style.alignItems = "center";       // <--- ADD THIS
		
		if (overlap !== "0em" && overlapSide) {
			let val = parseFloat(overlap);
			let unit = overlap.replace(/[\d.\-]/g, '');
			d.style[overlapSide] = `-${val * scaleMult}${unit}`;
		}
		d.append(content);
		return d;
	}

	// 1. Left Attachments (lsup / lsub)
	if (lsup || lsub) {
		const leftCol = document.createElement("span");
		leftCol.style.display = "inline-flex";
		leftCol.style.flexDirection = "column";
		leftCol.style.alignItems = "flex-end";
		// A tiny fixed padding keeps scripts from hitting the absolute razor-edge corners
		leftCol.style.padding = "0.1em 0"; 

		if (lsup && lsub) {
			leftCol.style.justifyContent = "space-between";
			leftCol.appendChild(makeScript(lsup));
			leftCol.appendChild(makeScript(lsub));
		} else if (lsup) {
			leftCol.style.justifyContent = "flex-start";
			leftCol.appendChild(makeScript(lsup));
		} else if (lsub) {
			leftCol.style.justifyContent = "flex-end";
			leftCol.appendChild(makeScript(lsub));
		}
		wrapper.appendChild(leftCol);
	}

	// 2. Center Attachments (up / main / down)
	const centerCol = document.createElement("span");
	centerCol.style.display = "inline-flex";
	centerCol.style.flexDirection = "column";
	centerCol.style.alignItems = "center";
	// CRITICAL: align-self: center prevents the center column from stretching.
	// This preserves all your \attacho overlaps and dictates the container's natural height!
	centerCol.style.alignSelf = "center"; 
	
	if (up) {
		let upScript = makeScript(up, "marginBottom");
		upScript.style.zIndex = "1";
		centerCol.appendChild(upScript);
	}

	const mainSpan = document.createElement("span");
	mainSpan.style.lineHeight = "1";
	mainSpan.append(main_element);
	centerCol.appendChild(mainSpan);

	if (down) {
		let downScript = makeScript(down, "marginTop");
		downScript.style.zIndex = "1";
		centerCol.appendChild(downScript);
	}
	
	wrapper.appendChild(centerCol);

	// 3. Right Attachments (sup / sub)
	if (sup || sub) {
		const rightCol = document.createElement("span");
		rightCol.style.display = "inline-flex";
		rightCol.style.flexDirection = "column";
		rightCol.style.padding = "0.1em 0";

		if (sup && sub) {
			// Center the wrapper perfectly for full-height stacking
			wrapper.style.verticalAlign = "middle"; 

			rightCol.style.alignItems = "flex-start";
			rightCol.style.justifyContent = "space-between";
			rightCol.appendChild(makeScript(sup));
			rightCol.appendChild(makeScript(sub));
		} else if (sup) {
			// NEW FIX: Base-align the wrapper so the main text ignores tall superscripts
			wrapper.style.verticalAlign = "baseline"; 

			rightCol.style.alignItems = "flex-start";
			rightCol.style.justifyContent = "flex-start";
			rightCol.appendChild(makeScript(sup));
		} else if (sub) {
			// NEW FIX: Base-align the wrapper so the main text ignores tall subscripts
			wrapper.style.verticalAlign = "baseline";

			rightCol.style.alignItems = "flex-start";
			rightCol.style.justifyContent = "flex-end";
			rightCol.appendChild(makeScript(sub));
		}
		wrapper.appendChild(rightCol);
	}

	return wrapper;
}

export function toElement(item) {
	if (typeof item === "string") {
		const span = document.createElement("span");
		span.textContent = item;
		return span;
	}
	return item;
}