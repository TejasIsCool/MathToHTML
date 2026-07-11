/** @type {Object.<string, string>} */
export const escape_word_map = {
	"sum": "Σ​", // has a U+200 zero with character at end, so it is considered different by the parser
	"sumb": "Σ",
	"prod": "∏​", // U+200
    "prodb": "∏",
	"union": "∪",
	"cup": "∪​", // U+200
	"bigcup": "∪",
	"intersect": "∩",
	"cap": "∩​", // U+200
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

	"int": "∫​",
    "intb": "∫",
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

export let escape_word_list = Object.keys(escape_word_map).sort((a, b) => b.length - a.length);

// This is for functions, which don't also have an explicit symbol
escape_word_list.push(...[
	"over", // So \over{a}{b} means put b above a
	"under",
	"cancel", // \cancel{} Makes a diagonal strikethrough the character/expression, like in ≠
	"cancelangle", // \cancel{angle}{stuff}, angle in degrees.
	"canceldir", // \cancel{dir}{stuff} Cancels in specified directions: trbl (top right bottom left), tlbr (top left bottom right), ud (up to down), lr (left to right)
	"frac", // \frac{a}{b} is explicitly division, so a above b with a horizontal line between
	"root",
	"attach", // \attach{}{}{}{}{}{}{}
	"attacho", // Like attach, but also additional parameter of overlap
    "attachos", // Like attacho, but also option to configure how much smaller the super and subscript go (default = 0.6 on the above)
	// Question, how do i do multi line braces?
	// Latex does it with \left and \right, so can prob do that.
	"left", // \left {(}{....}, the first input is what kind of bracket, the other is the content it is scaled with
	"right", // same iea
	// to make matrix, \left {[}{\right{]}{..tablesomehow...}} // so these should not scale stuff
	// if want to use curly braces, must backslash them, so \left{\{}{....}
	// these can be multilined as they will scale with the content, should be able to make similar to sqrt

    "scale", // scaling the element by some scale
    "scalew",
    "scaleh",
    "rotate", // works in degrees
])
// The idea will be to keep scanning forward, till only one of them satisfies
// If none match, then just print the \ as normal
// If multiple match at one point and then none match, then i want the longest ones, sorted it

// Refers to functions, which pop the next argument behind them.
export let single_pop_list = ["sqrt", "cancel"]; 
export let double_pop_list = ["over","under","frac","root","left","right","scale","scalew","scaleh","rotate","cancelangle", "canceldir"];
export let custom_handling_list = ["attach", "attacho", "attachos"]; // For sqrt, i want it to be usable as a character and a function. SO if sqrt is followed by a string, tis character, if followed by a div, its function

export let updown_modifier = ["Σ", "∏", "∪", "∩", "∫", "∬", "∭", "∮"]