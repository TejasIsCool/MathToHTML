// This attach function below was written by llms (gemini pro preview + kimi k2.6), not me, sorry
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
	wrapper.style.display = "inline-block";
	wrapper.style.whiteSpace = "nowrap";
	wrapper.classList.add("math-attach-wrapper");

	function makeScript(content, overlapSide) {
		const d = document.createElement("span");
		d.style.zoom = scale;
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
	if (up || down) {
		centerCol.style.display = "inline-flex";
		centerCol.style.flexDirection = "column";
		centerCol.style.alignItems = "center";
		centerCol.style.verticalAlign = "middle";
	}
	if (up) centerCol.appendChild(makeScript(up, "marginBottom"));

	const mainSpan = document.createElement("span");
	mainSpan.style.display = "inline-block";  // Key fix: captures zoomed height properly
	mainSpan.style.lineHeight = "1";
	mainSpan.classList.add("math-attach-main");
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
		rightCol.classList.add("math-attach-right");
		if (sup && sub) rightCol.style.verticalAlign = "middle";
		else if (sup) rightCol.style.verticalAlign = "super";
		else if (sub) rightCol.style.verticalAlign = "sub";

		if (sup) {
			const s = makeScript(sup, "marginBottom");
			s.classList.add("math-attach-sup");
			rightCol.appendChild(s);
		}
		if (sub) {
			const s = makeScript(sub, "marginTop");
			s.classList.add("math-attach-sub");
			rightCol.appendChild(s);
		}
		wrapper.appendChild(rightCol);
	}

	// Baseline hack: zero-size inline-block at the end forces the wrapper's
	// baseline to the line's baseline (which is set by centerCol / mainSpan).
	// This prevents a stretched rightCol from hijacking the wrapper baseline.
	const baselineHack = document.createElement("span");
	baselineHack.style.display = "inline-block";
	baselineHack.style.width = "0";
	baselineHack.style.height = "0";
	baselineHack.style.verticalAlign = "baseline";
	wrapper.appendChild(baselineHack);

	return wrapper;
}

/**
 * Converts strings to spans, and leaves the rest as it is
 *
 * @export
 * @template T
 * @param {T} item
 * @return {T extends string ? HTMLSpanElement : T} 
 */
export function toElement(item) {
	if (typeof item === "string") {
		const span = document.createElement("span");
		span.textContent = item;
		return span;
	}
	return item;
}