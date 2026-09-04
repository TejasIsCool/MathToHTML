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

// Reusable canvas for measuring text ink height dynamically
let measureCanvas = null;
let measureCtx = null;

function getMeasureCtx() {
	if (!measureCtx && typeof document !== "undefined") {
		measureCanvas = document.createElement("canvas");
		measureCtx = measureCanvas.getContext("2d");
	}
	return measureCtx;
}



// Below code is ai Generated as well

/**
 * Calculates visual ascent (distance from baseline to highest point of text ink or custom elements)
 * @param {HTMLElement} content 
 * @param {HTMLElement} [wrapper] 
 * @returns {number} ascent in pixels
 */
export function getVisualAscent(content, wrapper) {
	let textAscent = 0;
	const ctx = getMeasureCtx();

	if (ctx) {
		const text = content.textContent || "";
		if (text.length > 0) {
			let font = "16px sans-serif";
			if (wrapper && wrapper.isConnected) {
				font = window.getComputedStyle(wrapper).font || font;
			} else if (typeof window !== "undefined" && document.body) {
				font = window.getComputedStyle(document.body).font || font;
			}
			ctx.font = font;
			const metrics = ctx.measureText(text);
			textAscent = metrics.actualBoundingBoxAscent || 0;
		}
	}

	let elementAscent = 0;
	if (wrapper && wrapper.isConnected) {
		const anchor = wrapper.querySelector(":scope > .math-baseline-anchor");
		if (anchor) {
			const baselineY = anchor.getBoundingClientRect().top;
			const children = content.querySelectorAll("img, svg, div:not([data-source]), .math-frac, .math-sqrt-content, .math-attach-wrapper, .math-brace-content, .math-overline-line, [style*='height']");
			for (const child of children) {
				if (child === wrapper.querySelector(":scope > .math-overline-line") || child.classList.contains("math-baseline-anchor")) continue;
				const rect = child.getBoundingClientRect();
				if (rect.height > 0) {
					const asc = baselineY - rect.top;
					if (asc > elementAscent) elementAscent = asc;
				}
			}
		}
	}

	return Math.max(textAscent, elementAscent);
}

/**
 * Calculates visual descent (distance from baseline to lowest point of text ink or custom elements)
 * @param {HTMLElement} content 
 * @param {HTMLElement} [wrapper] 
 * @returns {number} descent in pixels
 */
export function getVisualDescent(content, wrapper) {
	let textDescent = 0;
	const ctx = getMeasureCtx();

	if (ctx) {
		const text = content.textContent || "";
		if (text.length > 0) {
			let font = "16px sans-serif";
			if (wrapper && wrapper.isConnected) {
				font = window.getComputedStyle(wrapper).font || font;
			} else if (typeof window !== "undefined" && document.body) {
				font = window.getComputedStyle(document.body).font || font;
			}
			ctx.font = font;
			const metrics = ctx.measureText(text);
			textDescent = metrics.actualBoundingBoxDescent || 0;
		}
	}

	let elementDescent = 0;
	if (wrapper && wrapper.isConnected) {
		const anchor = wrapper.querySelector(":scope > .math-baseline-anchor");
		if (anchor) {
			const baselineY = anchor.getBoundingClientRect().top;
			const children = content.querySelectorAll("img, svg, div:not([data-source]), .math-frac, .math-sqrt-content, .math-attach-wrapper, .math-brace-content, .math-underline-line, [style*='height']");
			for (const child of children) {
				if (child === wrapper.querySelector(":scope > .math-underline-line") || child.classList.contains("math-baseline-anchor")) continue;
				const rect = child.getBoundingClientRect();
				if (rect.height > 0) {
					const desc = rect.bottom - baselineY;
					if (desc > elementDescent) elementDescent = desc;
				}
			}
		}
	}

	return Math.max(textDescent, elementDescent);
}

/**
 * Dynamically positions the overline bar above the tallest ink or element relative to the baseline
 * @param {HTMLElement} wrapper 
 */
export function updateOverline(wrapper) {
	const content = wrapper.querySelector(".math-overline-content");
	const line = wrapper.querySelector(":scope > .math-overline-line");
	const anchor = wrapper.querySelector(":scope > .math-baseline-anchor");
	if (!content || !line || !anchor) return;

	const wrapperRect = wrapper.getBoundingClientRect();
	const anchorRect = anchor.getBoundingClientRect();
	if (wrapperRect.height === 0) return;

	const baselineFromBottom = wrapperRect.bottom - anchorRect.top;
	const ascent = getVisualAscent(content, wrapper);
	const gap = 2; // 2px gap above ink
	const lineBottom = baselineFromBottom + ascent + gap;

	line.style.bottom = `${lineBottom}px`;

	const neededHeight = lineBottom + 2;
	if (neededHeight > wrapperRect.height) {
		const currentPad = parseFloat(window.getComputedStyle(wrapper).paddingTop) || 0;
		wrapper.style.paddingTop = `${neededHeight - wrapperRect.height + currentPad}px`;
	}
}

/**
 * Dynamically positions the underline bar below the lowest ink or element relative to the baseline
 * @param {HTMLElement} wrapper 
 */
export function updateUnderline(wrapper) {
	const content = wrapper.querySelector(".math-underline-content");
	const line = wrapper.querySelector(":scope > .math-underline-line");
	const anchor = wrapper.querySelector(":scope > .math-baseline-anchor");
	if (!content || !line || !anchor) return;

	const wrapperRect = wrapper.getBoundingClientRect();
	const anchorRect = anchor.getBoundingClientRect();
	if (wrapperRect.height === 0) return;

	const baselineFromBottom = wrapperRect.bottom - anchorRect.top;
	const descent = getVisualDescent(content, wrapper);
	const gap = 2; // 2px gap below ink
	const lineBottom = baselineFromBottom - descent - gap;

	line.style.bottom = `${lineBottom}px`;

	if (lineBottom < 0) {
		const neededPad = Math.abs(lineBottom) + 2;
		const currentPad = parseFloat(window.getComputedStyle(wrapper).paddingBottom) || 0;
		if (neededPad > currentPad) {
			wrapper.style.paddingBottom = `${neededPad}px`;
		}
	}
}

/**
 * Observes all overlines and underlines in root and dynamically positions them on layout/resize
 * @param {HTMLElement} root 
 */
export function setupLineObserver(root) {
	const lineObserver = new ResizeObserver((entries) => {
		for (const entry of entries) {
			const el = entry.target;
			if (el.classList.contains("math-overline")) {
				updateOverline(el);
			} else if (el.classList.contains("math-underline")) {
				updateUnderline(el);
			}
		}
	});

	for (const el of root.querySelectorAll(".math-overline, .math-underline")) {
		lineObserver.observe(el);
		if (el.classList.contains("math-overline")) updateOverline(el);
		else if (el.classList.contains("math-underline")) updateUnderline(el);
	}
}