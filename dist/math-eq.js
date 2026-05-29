// src/constants.js
var escape_word_map = {
  "sum": "\u03A3\u200B",
  // has a U+200 zero with character at end, so it is considered different by the parser
  "sumb": "\u03A3",
  "prod": "\u220F\u200B",
  "prodb": "\u220F",
  "union": "\u222A",
  "cup": "\u222A\u200B",
  "bigcup": "\u222A",
  "intersect": "\u2229",
  "cap": "\u2229\u200B",
  "bigcap": "\u2229",
  "alpha": "\u03B1",
  "a": "\u03B1",
  "beta": "\u03B2",
  "b": "\u03B2",
  "gamma": "\u03B3",
  "g": "\u03B3",
  "delta": "\u03B4",
  "d": "\u03B4",
  "epsilon": "\u03B5",
  "e": "\u03B5",
  "zeta": "\u03B6",
  "z": "\u03B6",
  "eta": "\u03B7",
  "h": "\u03B7",
  "theta": "\u03B8",
  "th": "\u03B8",
  "iota": "\u03B9",
  "i": "\u03B9",
  "kappa": "\u03BA",
  "k": "\u03BA",
  "lambda": "\u03BB",
  "l": "\u03BB",
  "mu": "\u03BC",
  "m": "\u03BC",
  "nu": "\u03BD",
  "n": "\u03BD",
  "xi": "\u03BE",
  "x": "\u03BE",
  "omicron": "\u03BF",
  "o": "\u03BF",
  "pi": "\u03C0",
  "p": "\u03C0",
  "rho": "\u03C1",
  "r": "\u03C1",
  "sigma": "\u03C3",
  "s": "\u03C3",
  "tau": "\u03C4",
  "t": "\u03C4",
  "upsilon": "\u03C5",
  "u": "\u03C5",
  "phi": "\u03C6",
  "f": "\u03C6",
  "chi": "\u03C7",
  "c": "\u03C7",
  "psi": "\u03C8",
  "ps": "\u03C8",
  "omega": "\u03C9",
  // Capitals
  "Alpha": "\u0391",
  "A": "\u0391",
  "Beta": "\u0392",
  "B": "\u0392",
  "Gamma": "\u0393",
  "G": "\u0393",
  "Delta": "\u0394",
  "D": "\u0394",
  "Epsilon": "\u0395",
  "E": "\u0395",
  "Zeta": "\u0396",
  "Z": "\u0396",
  "Eta": "\u0397",
  "H": "\u0397",
  "Theta": "\u0398",
  "Th": "\u0398",
  "Iota": "\u0399",
  "I": "\u0399",
  "Kappa": "\u039A",
  "K": "\u039A",
  "Lambda": "\u039B",
  "L": "\u039B",
  "Mu": "\u039C",
  "M": "\u039C",
  "Nu": "\u039D",
  "N": "\u039D",
  "Xi": "\u039E",
  "X": "\u039E",
  "Omicron": "\u039F",
  "O": "\u039F",
  "Pi": "\u03A0",
  "P": "\u03A0",
  "Rho": "\u03A1",
  "R": "\u03A1",
  "Sigma": "\u03A3",
  "S": "\u03A3",
  "Tau": "\u03A4",
  "T": "\u03A4",
  "Upsilon": "\u03A5",
  "U": "\u03A5",
  "Phi": "\u03A6",
  "F": "\u03A6",
  "Chi": "\u03A7",
  "C": "\u03A7",
  "Psi": "\u03A8",
  "Ps": "\u03A8",
  "Omega": "\u03A9",
  // Maths
  "leq": "\u2264",
  "geq": "\u2265",
  "neq": "\u2260",
  "times": "\xD7",
  "div": "\xF7",
  "pm": "\xB1",
  "mp": "\u2213",
  "cdot": "\u22C5",
  "to": "\u2192",
  "infty": "\u221E",
  "approx": "\u2248",
  "cong": "\u2245",
  "equiv": "\u2261",
  "sim": "\u223C",
  "simeq": "\u2243",
  "nequiv": "\u2262",
  "ncong": "\u2247",
  "nsim": "\u2241",
  "nsimeq": "\u2244",
  "napprox": "\u2249",
  "prop": "\u221D",
  "propto": "\u221D",
  "in": "\u2208",
  "notin": "\u2209",
  "subset": "\u2282",
  "subseteq": "\u2286",
  "supset": "\u2283",
  "supseteq": "\u2287",
  "int": "\u222B\u200B",
  "intb": "\u222B",
  "iint": "\u222C",
  "iiint": "\u222D",
  "oint": "\u222E",
  "sqrt": "\u221A",
  // Arrows
  "leftarrow": "\u2190",
  "rightarrow": "\u2192",
  "uparrow": "\u2191",
  "downarrow": "\u2193",
  "leftrightarrow": "\u2194",
  "rightleftarrows": "\u21CC",
  "mapsto": "\u21A6",
  "equivalent": "\u21D4",
  "implies": "\u21D2",
  "iff": "\u21D4",
  "Leftarrow": "\u21D0",
  "Rightarrow": "\u21D2",
  "Uparrow": "\u21D1",
  "Downarrow": "\u21D3",
  "LeftRightarrow": "\u21D4",
  "Longrightarrow": "\u27F6",
  "Longleftarrow": "\u27F5",
  "Longleftrightarrow": "\u27F7",
  "Longmapsto": "\u27FC",
  "LongLeftarrow": "\u27F8",
  "LongRightarrow": "\u27F9",
  "LongEquiv": "\u27FA",
  "^": "^",
  // Like printing the characters, not actually using them
  "_": "_",
  "\\": "\\"
};
var escape_word_list = Object.keys(escape_word_map).sort((a, b) => b.length - a.length);
escape_word_list.push(...[
  "over",
  // So \over{a}{b} means put b above a
  "under",
  "cancel",
  // \cancel{} Makes a diagonal strikethrough the character/expression, like in ≠
  "frac",
  // \frac{a}{b} is explicitly division, so a above b with a horizontal line between
  "root",
  "attach",
  // \attach{}{}{}{}{}{}{}
  "attacho",
  // Like attach, but also additional parameter of overlap
  "attachos",
  // Like attacho, but also option to configure how much smaller the super and subscript go (default = 0.6 on the above)
  // Question, how do i do multi line braces?
  // Latex does it with \left and \right, so can prob do that.
  "left",
  // \left {(}{....}, the first input is what kind of bracket, the other is the content it is scaled with
  "right",
  // same iea
  // to make matrix, \left {[}{\right{]}{..tablesomehow...}} // so these should not scale stuff
  // if want to use curly braces, must backslash them, so \left{\{}{....}
  // these can be multilined as they will scale with the content, should be able to make similar to sqrt
  "scale",
  // scaling the element by some scale
  "scalew",
  "scaleh",
  "rotate"
  // works in degrees
]);
var single_pop_list = ["sqrt", "cancel"];
var double_pop_list = ["over", "under", "frac", "root", "left", "right", "scale", "scalew", "scaleh", "rotate"];
var custom_handling_list = ["attach", "attacho", "attachos"];
var updown_modifier = ["\u03A3", "\u220F", "\u222A", "\u2229", "\u222B", "\u222C", "\u222D", "\u222E"];

// src/utils.js
function attach(main_element, sup, sub, lsup, lsub, up, down, overlap = "0em", scale = 0.6) {
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
  const centerCol = document.createElement("span");
  if (up || down) {
    centerCol.style.display = "inline-flex";
    centerCol.style.flexDirection = "column";
    centerCol.style.alignItems = "center";
    centerCol.style.verticalAlign = "middle";
  }
  if (up) centerCol.appendChild(makeScript(up, "marginBottom"));
  const mainSpan = document.createElement("span");
  mainSpan.style.display = "inline-block";
  mainSpan.style.lineHeight = "1";
  mainSpan.classList.add("math-attach-main");
  mainSpan.append(main_element);
  centerCol.appendChild(mainSpan);
  if (down) centerCol.appendChild(makeScript(down, "marginTop"));
  wrapper.appendChild(centerCol);
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
  const baselineHack = document.createElement("span");
  baselineHack.style.display = "inline-block";
  baselineHack.style.width = "0";
  baselineHack.style.height = "0";
  baselineHack.style.verticalAlign = "baseline";
  wrapper.appendChild(baselineHack);
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

// src/extra_renderers.js
var SpecialExpressions = class {
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
};
function special_to_div(spec_element) {
  if (spec_element.name == "over") {
    return attach(toElement(spec_element.data[1]), void 0, void 0, void 0, void 0, toElement(spec_element.data[0]), void 0, "0.5em");
  } else if (spec_element.name == "under") {
    return attach(toElement(spec_element.data[1]), void 0, void 0, void 0, void 0, void 0, toElement(spec_element.data[0]), "0.5em");
  } else if (spec_element.name == "sqrt") {
    let content = spec_element.data[0];
    let sub_div = document.createElement("span");
    sub_div.style.display = "inline-block";
    sub_div.style.borderTop = "solid thin";
    sub_div.classList.add("math-sqrt-content");
    sub_div.style.zoom = 0.9;
    sub_div.appendChild(content);
    let out_div = document.createElement("span");
    out_div.style.display = "inline-flex";
    out_div.style.alignItems = "flex-end";
    out_div.style.verticalAlign = "middle";
    let outer_sub_div = document.createElement("span");
    outer_sub_div.textContent = "\u221A";
    outer_sub_div.classList.add("math-sqrt-symbol");
    outer_sub_div.style.transformOrigin = "bottom center";
    outer_sub_div.style.lineHeight = "1";
    outer_sub_div.style.display = "inline-block";
    out_div.appendChild(outer_sub_div);
    out_div.appendChild(sub_div);
    return out_div;
  } else if (spec_element.name == "root") {
    let content = spec_element.data[1];
    let sub_div = document.createElement("span");
    sub_div.style.display = "inline-block";
    sub_div.style.borderTop = "solid thin";
    sub_div.classList.add("math-sqrt-content");
    sub_div.style.zoom = 0.9;
    sub_div.appendChild(content);
    let out_div = document.createElement("span");
    out_div.style.display = "inline-flex";
    out_div.style.alignItems = "flex-end";
    out_div.style.verticalAlign = "middle";
    let outer_sub_div = document.createElement("span");
    outer_sub_div.textContent = "\u221A";
    outer_sub_div.classList.add("math-sqrt-symbol");
    outer_sub_div.style.transformOrigin = "bottom center";
    outer_sub_div.style.lineHeight = "1";
    outer_sub_div.style.display = "inline-block";
    out_div.appendChild(outer_sub_div);
    out_div.appendChild(sub_div);
    let upper_element = toElement(spec_element.data[0]);
    upper_element.style.zoom = 0.7;
    return attach(out_div, void 0, void 0, upper_element);
  } else if (spec_element.name == "cancel") {
    throw Error("Not implemented cancel yet");
  } else if (spec_element.name == "frac") {
    let numerator = toElement(spec_element.data[0]);
    let denominator = toElement(spec_element.data[1]);
    let frac_div = document.createElement("span");
    frac_div.style.display = "inline-flex";
    frac_div.style.flexDirection = "column";
    frac_div.style.alignItems = "center";
    frac_div.style.verticalAlign = "middle";
    frac_div.style.whiteSpace = "nowrap";
    frac_div.style.lineHeight = "1";
    frac_div.style.zoom = 0.8;
    let numSpan = document.createElement("span");
    numSpan.style.display = "inline-block";
    numSpan.style.paddingBottom = "0.05em";
    numSpan.appendChild(numerator);
    frac_div.appendChild(numSpan);
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
      toElement(spec_element.data[6])
    );
  } else if (spec_element.name == "attacho") {
    return attach(
      toElement(spec_element.data[0]),
      toElement(spec_element.data[1]),
      toElement(spec_element.data[2]),
      toElement(spec_element.data[3]),
      toElement(spec_element.data[4]),
      toElement(spec_element.data[5]),
      toElement(spec_element.data[6]),
      spec_element.data[7].innerText
      // The overlap parameter
    );
  } else if (spec_element.name == "attachos") {
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
    );
  } else if (spec_element.name == "left") {
    let brace = spec_element.data[0].innerText;
    let content = spec_element.data[1];
    let sub_div = document.createElement("span");
    sub_div.style.display = "inline-block";
    sub_div.classList.add("math-brace-content");
    sub_div.appendChild(content);
    let out_div = document.createElement("span");
    out_div.style.display = "inline-flex";
    out_div.style.alignItems = "center";
    out_div.style.verticalAlign = "middle";
    let outer_sub_div = document.createElement("span");
    outer_sub_div.textContent = brace;
    outer_sub_div.classList.add("math-brace-symbol");
    outer_sub_div.style.transformOrigin = "center center";
    outer_sub_div.style.lineHeight = "1";
    outer_sub_div.style.display = "inline-block";
    out_div.appendChild(outer_sub_div);
    out_div.appendChild(sub_div);
    return out_div;
  } else if (spec_element.name == "right") {
    let brace = spec_element.data[0].innerText;
    let content = spec_element.data[1];
    let sub_div = document.createElement("span");
    sub_div.style.display = "inline-block";
    sub_div.classList.add("math-brace-content");
    sub_div.appendChild(content);
    let out_div = document.createElement("span");
    out_div.style.display = "inline-flex";
    out_div.style.alignItems = "center";
    out_div.style.verticalAlign = "middle";
    let outer_sub_div = document.createElement("span");
    outer_sub_div.textContent = brace;
    outer_sub_div.classList.add("math-brace-symbol");
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
  } else if (spec_element.name == "scalew") {
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
    throw Error(`Unimplemented special expression ${spec_element.name}`);
  }
}

// src/parser.js
function sense_maker(str) {
  return escape_word_list.filter((word) => word.startsWith(str));
}
function tex_to_div(tokens) {
  let current_character_index = 0;
  let expression_array = [];
  while (current_character_index < tokens.length) {
    if (tokens[current_character_index] == "\\") {
      if (current_character_index + 1 < tokens.length && tokens[current_character_index + 1] == "{" || tokens[current_character_index + 1] == "}") {
        expression_array.push(tokens[current_character_index + 1]);
        current_character_index += 2;
        continue;
      }
    }
    if (tokens[current_character_index] == "{") {
      if (current_character_index + 1 == tokens.length) {
        expression_array.push("{");
        current_character_index += 1;
        continue;
      }
      let inner_expression = [];
      var current_scope = 1;
      while (current_scope != 0) {
        current_character_index += 1;
        if (current_character_index > tokens.length) {
          break;
        }
        if (tokens[current_character_index] == "\\") {
          if (current_character_index + 1 < tokens.length && (tokens[current_character_index + 1] == "{" || tokens[current_character_index + 1] == "}")) {
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
        if (current_scope != 0) {
          inner_expression.push(tokens[current_character_index]);
        }
      }
      let inner_div = tex_to_div(inner_expression);
      expression_array.push(inner_div);
    } else {
      expression_array.push(tokens[current_character_index]);
    }
    current_character_index += 1;
  }
  let final_expression_array = [];
  let element_index = 0;
  let expr_length = expression_array.length;
  while (element_index < expr_length) {
    let element = expression_array[element_index];
    if (element == "^" || element == "_") {
      if (element_index + 1 < expr_length) {
        element_index += 1;
        let first_component = expression_array[element_index];
        let isSup = element == "^";
        let otherSymbol = isSup ? "_" : "^";
        let hasPair = element_index + 2 < expr_length && expression_array[element_index + 1] == otherSymbol;
        let prev_raw = final_expression_array.pop() ?? document.createElement("span");
        if (prev_raw instanceof SpecialExpressions) {
          prev_raw = special_to_div(prev_raw);
        }
        let isBigOp = false;
        if (typeof prev_raw === "string" && updown_modifier.includes(prev_raw)) {
          isBigOp = true;
        } else if (prev_raw instanceof HTMLElement && updown_modifier.includes(prev_raw.textContent)) {
          isBigOp = true;
        }
        let prev = toElement(prev_raw);
        if (isBigOp) {
          prev.style.display = "inline-block";
          prev.style.transform = "translateY(0.08em)";
        }
        if (hasPair) {
          element_index += 2;
          let second_component = expression_array[element_index];
          let sup_component = isSup ? first_component : second_component;
          let sub_component = isSup ? second_component : first_component;
          let wrapper;
          if (isBigOp) {
            wrapper = attach(prev, void 0, void 0, void 0, void 0, sup_component, sub_component, "0.3em");
          } else {
            wrapper = attach(prev, sup_component, sub_component);
          }
          final_expression_array.push(wrapper);
        } else {
          if (isSup) {
            if (isBigOp) {
              final_expression_array.push(attach(prev, void 0, void 0, void 0, void 0, first_component, void 0, "0.3em"));
            } else {
              final_expression_array.push(attach(prev, first_component));
            }
          } else {
            if (isBigOp) {
              final_expression_array.push(attach(prev, void 0, void 0, void 0, void 0, void 0, first_component, "0.3em"));
            } else {
              final_expression_array.push(attach(prev, void 0, first_component));
            }
          }
        }
      } else {
        final_expression_array.push(element);
      }
    } else if (element == "\\") {
      element_index += 1;
      let matches = [];
      let previous_word = "";
      let current_word = "";
      do {
        matches = sense_maker(current_word);
        previous_word = current_word;
        let next = "";
        if (element_index >= expr_length || typeof (next = expression_array[element_index]) != "string" || sense_maker(current_word + next).length == 0) {
          if (matches.includes(current_word)) {
            if (single_pop_list.includes(current_word)) {
              if (next == " " || next == "\xA0") {
                if (Object.keys(escape_word_map).includes(current_word)) {
                  final_expression_array.push(escape_word_map[current_word]);
                } else {
                  throw Error("Haven't implemented a space after a singlepop escape thingy");
                }
              } else {
                final_expression_array.push(new SpecialExpressions(current_word, [next]));
              }
              element_index += 1;
            } else if (double_pop_list.includes(current_word)) {
              let data1 = next;
              if (element_index + 1 < expr_length) {
                let data2 = expression_array[element_index + 1];
                final_expression_array.push(new SpecialExpressions(current_word, [data1, data2]));
              } else {
                throw Error("No two elements to pop!");
              }
              element_index += 2;
            } else if (custom_handling_list.includes(current_word)) {
              if (current_word == "attach") {
                let data = [];
                for (let i = 0; i < 7; i++) {
                  if (element_index + i < expr_length) {
                    data.push(expression_array[element_index + i]);
                  } else {
                    data.push(void 0);
                  }
                }
                final_expression_array.push(new SpecialExpressions(current_word, data));
                element_index += 7;
              } else if (current_word == "attacho") {
                let data = [];
                for (let i = 0; i < 8; i++) {
                  if (element_index + i < expr_length) {
                    data.push(expression_array[element_index + i]);
                  } else {
                    data.push(void 0);
                  }
                }
                final_expression_array.push(new SpecialExpressions(current_word, data));
                element_index += 8;
              } else if (current_word == "attachos") {
                let data = [];
                for (let i = 0; i < 9; i++) {
                  if (element_index + i < expr_length) {
                    data.push(expression_array[element_index + i]);
                  } else {
                    data.push(void 0);
                  }
                }
                final_expression_array.push(new SpecialExpressions(current_word, data));
                element_index += 9;
              }
            } else {
              let out_str = escape_word_map[current_word];
              if (out_str === "\u222B" || out_str === "\u222B\u200B" || out_str === "\u222C" || out_str === "\u222D" || out_str === "\u222E") {
                let intSpan = document.createElement("span");
                intSpan.textContent = out_str;
                intSpan.style.display = "inline-block";
                intSpan.style.transform = "translateY(0.2em)";
                final_expression_array.push(intSpan);
              } else {
                final_expression_array.push(out_str);
              }
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
  let div_element = document.createElement("div");
  div_element.style.display = "inline-block";
  for (let element of final_expression_array) {
    if (element instanceof SpecialExpressions) {
      element = special_to_div(element);
    }
    div_element.append(element);
  }
  div_element.dataset.source = tokens;
  return div_element;
}

// src/index.js
function setupAttachObserver(root) {
  const attachObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const main = entry.target;
      const wrapper = main.closest(".math-attach-wrapper");
      if (!wrapper) continue;
      const rightCol = wrapper.querySelector(".math-attach-right");
      if (!rightCol) continue;
      if (!rightCol.dataset.originalVerticalAlign) {
        rightCol.dataset.originalVerticalAlign = rightCol.style.verticalAlign || "baseline";
      }
      rightCol.style.height = "";
      rightCol.style.justifyContent = "";
      rightCol.style.verticalAlign = rightCol.dataset.originalVerticalAlign;
      const mainHeight = main.offsetHeight;
      const rightHeight = rightCol.offsetHeight;
      if (mainHeight > rightHeight * 1.8 && rightHeight > 0) {
        rightCol.style.height = mainHeight + "px";
        rightCol.style.verticalAlign = "bottom";
        const hasSup = rightCol.querySelector(".math-attach-sup");
        const hasSub = rightCol.querySelector(".math-attach-sub");
        if (hasSup && hasSub) {
          rightCol.style.justifyContent = "space-between";
        } else if (hasSup) {
          rightCol.style.justifyContent = "flex-start";
        } else if (hasSub) {
          rightCol.style.justifyContent = "flex-end";
        }
      }
    }
  });
  const attachMains = root.querySelectorAll(".math-attach-main");
  for (let main of attachMains) {
    attachObserver.observe(main);
  }
}
var MEqElement = class extends HTMLElement {
  connectedCallback() {
    let source = this.childNodes;
    let tokens = [];
    for (let token of source) {
      if (token.nodeType == Node.TEXT_NODE) {
        let cleanText = token.textContent.replace(/\n\s*/g, "");
        cleanText = cleanText.replaceAll(" ", "\xA0");
        tokens.push(...cleanText);
      } else {
        tokens.push(token.cloneNode(true));
      }
    }
    this.innerHTML = "";
    this.appendChild(tex_to_div(tokens));
    const observer = new ResizeObserver(() => {
      let symbols = Array.from(this.querySelectorAll(".math-sqrt-symbol")).reverse();
      for (let sym of symbols) {
        let cont = sym.nextElementSibling;
        if (!cont || !cont.classList.contains("math-sqrt-content")) continue;
        sym.style.transform = "none";
        let contHeight = cont.getBoundingClientRect().height;
        let symHeight = sym.getBoundingClientRect().height;
        if (symHeight > 0) {
          let scaleY = contHeight / symHeight * 0.95;
          sym.style.transform = `scale(1, ${scaleY})`;
        }
      }
    });
    let contents = this.querySelectorAll(".math-sqrt-content");
    for (let cont of contents) {
      observer.observe(cont);
    }
    const observer2 = new ResizeObserver(() => {
      let symbols = Array.from(this.querySelectorAll(".math-brace-symbol")).reverse();
      for (let sym of symbols) {
        let cont = sym.nextElementSibling;
        if (!cont || !cont.classList.contains("math-brace-content")) {
          cont = sym.previousElementSibling;
        }
        if (!cont || !cont.classList.contains("math-brace-content")) continue;
        sym.style.transform = "none";
        let contHeight = cont.getBoundingClientRect().height;
        let symHeight = sym.getBoundingClientRect().height;
        if (symHeight > 0) {
          let scaleY = contHeight / symHeight * 1;
          let shiftY = contHeight * -0.07;
          sym.style.transform = `translateY(${shiftY}px) scale(1, ${scaleY})`;
        }
      }
    });
    contents = this.querySelectorAll(".math-brace-content");
    for (let cont of contents) {
      observer2.observe(cont);
    }
    setupAttachObserver(this);
  }
};
var MEqIElement = class extends HTMLElement {
  connectedCallback() {
    let source = this.childNodes;
    let tokens = [];
    for (let token of source) {
      if (token.nodeType == Node.TEXT_NODE) {
        tokens.push(...token.textContent);
      } else {
        tokens.push(token.cloneNode(true));
      }
    }
    this.innerHTML = "";
    this.appendChild(tex_to_div(tokens));
    const observer = new ResizeObserver(() => {
      let symbols = Array.from(this.querySelectorAll(".math-sqrt-symbol")).reverse();
      for (let sym of symbols) {
        let cont = sym.nextElementSibling;
        if (!cont || !cont.classList.contains("math-sqrt-content")) continue;
        sym.style.transform = "none";
        let contHeight = cont.getBoundingClientRect().height;
        let symHeight = sym.getBoundingClientRect().height;
        if (symHeight > 0) {
          let scaleY = contHeight / symHeight * 0.95;
          sym.style.transform = `scale(1, ${scaleY})`;
        }
      }
    });
    let contents = this.querySelectorAll(".math-sqrt-content");
    for (let cont of contents) {
      observer.observe(cont);
    }
    const observer2 = new ResizeObserver(() => {
      let symbols = Array.from(this.querySelectorAll(".math-brace-symbol")).reverse();
      for (let sym of symbols) {
        let cont = sym.nextElementSibling;
        if (!cont || !cont.classList.contains("math-brace-content")) {
          cont = sym.previousElementSibling;
        }
        if (!cont || !cont.classList.contains("math-brace-content")) continue;
        sym.style.transform = "none";
        let contHeight = cont.getBoundingClientRect().height;
        let symHeight = sym.getBoundingClientRect().height;
        if (symHeight > 0) {
          let scaleY = contHeight / symHeight * 1;
          let shiftY = contHeight * -0.07;
          sym.style.transform = `translateY(${shiftY}px) scale(1, ${scaleY})`;
        }
      }
    });
    contents = this.querySelectorAll(".math-brace-content");
    for (let cont of contents) {
      observer2.observe(cont);
    }
    setupAttachObserver(this);
  }
};
customElements.define("m-eq", MEqElement);
customElements.define("m-eqi", MEqIElement);
//# sourceMappingURL=math-eq.js.map
