"use strict";

window.FieldVisuals = (() => {
  const rows = (...items) => items.map(([name, values]) => [
    name, Array.isArray(values) ? values.join(" ") || "∅" : String(values)
  ]);
  const mark = (values, state) => values.map((value, i) => (state(i) || "") + value);
  const integers = text => {
    const fields = text.trim().split(/[,\s]+/);
    if (!text.trim() || fields.length > 12 || fields.some(x => !/^-?\d{1,5}$/.test(x))) {
      throw new Error("Enter 1–12 integers, separated by commas.");
    }
    return fields.map(Number);
  };
  const integer = text => {
    if (!/^-?\d{1,6}$/.test(text.trim())) throw new Error("Enter a whole number for the target.");
    return Number(text);
  };
  const arraySpecs = {
    "running-sum-of-1d-array": ["Values", "4, -2, 3", "", ""],
    "contains-duplicate": ["Values", "7, 4, 9, 7", "", ""],
    "two-sum": ["Values", "2, 7, 11, 15", "Target", "9"],
    "two-sum-ii-input-array-is-sorted": ["Sorted values", "1, 2, 4, 8, 11", "Target", "10"],
    "binary-search": ["Strictly increasing values", "-1, 0, 3, 5, 9, 12", "Target", "9"],
    "longest-substring-without-repeating-characters": ["Lowercase letters", "abba", "", ""],
    "valid-parentheses": ["Brackets", "([])", "", ""],
    "daily-temperatures": ["Temperatures", "72, 70, 71, 74", "", ""],
    "jump-game": ["Nonnegative jumps", "2, 0, 1, 0, 3", "", ""],
    "house-robber": ["Nonnegative amounts", "2, 7, 9, 3, 1", "", ""],
    "single-number": ["Values", "5, 3, 5", "", ""]
  };

  function makeFrames(slug, input, targetText) {
    const frames = [];
    const add = (message, ...data) => frames.push([message, rows(...data)]);
    if (slug === "longest-substring-without-repeating-characters") {
      if (!/^[a-z]{0,12}$/.test(input)) throw new Error("Enter up to 12 lowercase English letters.");
      const chars = [...input], seen = new Set();
      let left = 0, best = 0;
      add("Start with an empty window.", ["String", chars], ["Best", best]);
      chars.forEach((char, i) => {
        const before = left;
        while (seen.has(char)) seen.delete(chars[left++]);
        seen.add(char);
        best = Math.max(best, i - left + 1);
        const note = left === before ? "No repeat. " : "Move the left boundary to " + left + ". ";
        add(note + "Add " + char + " and compare the new length with the best.",
          ["String", mark(chars, j => j === i ? "*" : j < left ? "!" : j < i ? "+" : "")],
          ["Window", chars.slice(left, i + 1)], ["Best", best]);
      });
      add("The longest valid window has length " + best + ".", ["Best", "+" + best]);
      return frames;
    }

    if (slug === "valid-parentheses") {
      if (input.length > 16 || [...input].some(c => !"()[]{}".includes(c))) {
        throw new Error("Enter up to 16 bracket characters.");
      }
      const chars = [...input], stack = [], matching = {")": "(", "]": "[", "}": "{"};
      add("The stack starts empty.", ["Read", chars], ["Stack", stack]);
      for (let i = 0; i < chars.length; i++) {
        const char = chars[i], read = mark(chars, j => j === i ? "*" : "");
        if (char in matching) {
          if (stack.at(-1) !== matching[char]) {
            add("The closer " + char + " has no matching opener on top.", ["Read", read],
              ["Stack (top at right)", stack], ["Result", "!invalid"]);
            return frames;
          }
          stack.pop();
          add("Match " + char + " and pop its opener.", ["Read", read], ["Stack (top at right)", stack]);
        } else {
          stack.push(char);
          add("Push opening bracket " + char + ".", ["Read", read], ["Stack (top at right)", stack]);
        }
      }
      add(stack.length ? "Unclosed brackets remain." : "All openers were matched.",
        ["Stack (top at right)", stack], ["Result", stack.length ? "!invalid" : "+valid"]);
      return frames;
    }

    const values = integers(input);
    const array = (name, state) => [name, mark(values, state)];
    if (slug === "binary-search" || slug === "two-sum-ii-input-array-is-sorted") {
      const binary = slug === "binary-search", target = integer(targetText);
      if (values.some((v, i) => i > 0 && (binary ? v <= values[i - 1] : v < values[i - 1]))) {
        throw new Error(binary ? "Enter values in strictly increasing order." : "Sort the values in ascending order first.");
      }
      let left = 0, right = values.length - 1;
      add("Start with the whole candidate range.", ["Array", values], ["Target", target]);
      while (binary ? left <= right : left < right) {
        const mid = Math.floor((left + right) / 2);
        const candidate = binary ? values[mid] : values[left] + values[right];
        const match = candidate === target;
        const action = match ? "Match found." : candidate < target ? "Move the left boundary right." : "Move the right boundary left.";
        add("Compared " + candidate + " with " + target + ". " + action,
          array("Array", i => i < left || i > right ? "!" :
            (binary ? i === mid : i === left || i === right) ? (match ? "+" : "*") : ""),
          ["Bounds", ["L=" + left, ...(binary ? ["M=" + mid] : []), "R=" + right]],
          ["Value tested", candidate]);
        if (match) {
          add(binary ? "Return the zero-based index." : "Return the one-based positions.",
            ["Answer", binary ? "+" + mid : ["+" + (left + 1), "+" + (right + 1)]]);
          return frames;
        }
        if (candidate < target) left = (binary ? mid : left) + 1;
        else right = (binary ? mid : right) - 1;
      }
      add("No candidate remains.", ["Answer", binary ? "!-1" : "!no-pair"]);
      return frames;
    }

    if (slug === "running-sum-of-1d-array" || slug === "single-number" || slug === "house-robber") {
      const xor = slug === "single-number", dp = slug === "house-robber";
      if (dp && values.some(x => x < 0)) throw new Error("House amounts must be nonnegative.");
      let total = 0, older = 0;
      const name = xor ? "XOR so far" : dp ? "Prefix best" : "Running totals";
      const output = dp ? [0, ...values.map(() => "·")] : values.map(() => "·");
      add("Start with a state of zero.", ["Input", values], [name, output]);
      values.forEach((value, i) => {
        const previous = total;
        total = xor ? total ^ value : dp ? Math.max(total, older + value) : total + value;
        const message = dp ? "Compare skipping (" + previous + ") with taking (" + older + " + " + value + ")."
          : xor ? previous + " XOR " + value + " = " + total + "." : previous + " + " + value + " = " + total + ".";
        older = previous;
        const index = dp ? i + 1 : i;
        output[index] = total;
        add(message, array("Input", j => i === j ? "*" : ""),
          [name, mark(output, j => index === j ? "+" : "")]);
      });
      if (xor) add("The XOR fold is " + total + ". It identifies the unique item when all others occur twice.", ["XOR", "+" + total]);
      return frames;
    }

    if (slug === "contains-duplicate" || slug === "two-sum") {
      const pair = slug === "two-sum", target = pair ? integer(targetText) : 0;
      const seen = new Map(), label = pair ? "Value → index" : "Seen values";
      add("Start with an empty lookup.", ["Input", values], [label, []]);
      for (let i = 0; i < values.length; i++) {
        const value = values[i], key = pair ? target - value : value;
        const lookup = () => [...seen].map(([v, j]) => pair ? v + "→" + j : v);
        if (seen.has(key)) {
          const j = seen.get(key);
          add(pair ? "The complement is at index " + j + ". Return indices " + j + " and " + i + "."
            : "Value " + value + " already appeared at index " + j + ".",
          array("Input", k => k === i || k === j ? "+" : ""), [label, lookup()],
          ["Answer", pair ? ["+" + j, "+" + i] : "+True"]);
          return frames;
        }
        seen.set(value, i);
        add((pair ? "Complement " + key : "Value " + key) + " was absent. Store " + value + ".",
          array("Input", j => j === i ? "*" : ""), [label, lookup()]);
      }
      add(pair ? "There is no pair for this target." : "Every value was distinct.",
        ["Answer", pair ? "!no-pair" : "+False"]);
      return frames;
    }

    if (slug === "daily-temperatures") {
      const stack = [], answer = values.map(() => 0);
      add("Start with all days unresolved.", ["Temperatures", values], ["Answer", answer]);
      values.forEach((value, i) => {
        const resolved = [];
        while (stack.length && values[stack.at(-1)] < value) {
          const index = stack.pop();
          answer[index] = i - index;
          resolved.push(index);
        }
        stack.push(i);
        add(resolved.length ? "Resolve day indices " + resolved.join(", ") + ", then push " + i + "." : "Push day index " + i + ".",
          array("Temperatures", j => i === j ? "*" : ""), ["Pending indices", stack],
          ["Answer", mark(answer, j => resolved.includes(j) ? "+" : "")]);
      });
      return frames;
    }

    if (slug === "jump-game") {
      if (values.some(x => x < 0)) throw new Error("Jump lengths must be nonnegative.");
      let frontier = 0;
      for (let i = 0; i < values.length; i++) {
        if (i > frontier) {
          add("Index " + i + " is beyond the reachable frontier.",
            array("Jumps", j => j === i ? "!" : j <= frontier ? "+" : ""), ["Result", "!False"]);
          break;
        }
        frontier = Math.max(frontier, i + values[i]);
        add("Index " + i + " extends or preserves reach through " + frontier + ".",
          array("Jumps", j => j === i ? "*" : j <= frontier ? "+" : ""), ["Farthest", frontier]);
        if (frontier >= values.length - 1) {
          add("The last index is reachable.", ["Result", "+True"]);
          break;
        }
      }
      return frames;
    }
    return frames;
  }

  function attach(topic, host) {
    const board = host.querySelector("[data-board]");
    const note = host.querySelector("[data-frame-note]");
    const step = host.querySelector("[data-step]");
    const timeline = host.querySelector("[data-timeline]");
    const prior = host.querySelector("[data-prior]");
    const next = host.querySelector("[data-next]");
    const play = host.querySelector("[data-play]");
    const speed = host.querySelector("[data-speed]");
    const reset = host.querySelector("[data-reset]");
    const form = host.querySelector("form");
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frames = topic.frames, graph = topic.graph, index = 0, timer = 0;
    const rowElements = new Map();
    let graphElement, graphNodes, graphObserver;
    const make = (tag, cls, text) => {
      const el = document.createElement(tag);
      if (cls) el.className = cls;
      if (text != null) el.textContent = text;
      return el;
    };
    const states = {"*": "active", "+": "kept", "!": "discarded"};
    const getState = token => states[token[0]] || "";
    const getValue = token => getState(token) ? token.slice(1) : token;
    const tokens = values => values.split(/\s+/).filter(Boolean);

    function drawGraph() {
      if (!graph) return;
      graphElement = make("div", "graph");
      graphElement.setAttribute("aria-hidden", "true");
      const canvas = make("canvas");
      graphElement.append(canvas);
      const positions = new Map();
      graphNodes = new Map();
      graph[0].forEach(spec => {
        const [label, x, y] = spec.split(",");
        positions.set(label, [Number(x) / 100, Number(y) / 100]);
        const node = make("span", "graph-node", label);
        node.style.left = x + "%";
        node.style.top = y + "%";
        graphNodes.set(label, node);
        graphElement.append(node);
      });
      function paint() {
        const width = graphElement.clientWidth, height = graphElement.clientHeight;
        const ratio = Math.min(devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        const ctx = canvas.getContext("2d");
        if (!ctx || !width || !height) return;
        ctx.scale(ratio, ratio);
        const colors = getComputedStyle(host);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = colors.getPropertyValue("--graph-line").trim();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.font = "700 12px system-ui";
        ctx.textAlign = "center";
        for (const edge of graph[1]) {
          const [pair, weight] = edge.split(":");
          const [from, to] = pair.split(/[>-]/);
          const [x1, y1] = positions.get(from).map((v, i) => v * (i === 0 ? width : height));
          const [x2, y2] = positions.get(to).map((v, i) => v * (i === 0 ? width : height));
          const angle = Math.atan2(y2 - y1, x2 - x1);
          const directed = pair.includes(">");
          const endX = x2 - 19 * Math.cos(angle), endY = y2 - 19 * Math.sin(angle);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(directed ? endX : x2, directed ? endY : y2);
          ctx.stroke();
          if (directed) {
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - 8 * Math.cos(angle - 0.48), endY - 8 * Math.sin(angle - 0.48));
            ctx.lineTo(endX - 8 * Math.cos(angle + 0.48), endY - 8 * Math.sin(angle + 0.48));
            ctx.closePath();
            ctx.fill();
          }
          if (weight) ctx.fillText(weight, (x1 + x2) / 2, (y1 + y2) / 2 - 8);
        }
      }
      board.prepend(graphElement);
      paint();
      if (typeof ResizeObserver === "function") {
        graphObserver = new ResizeObserver(paint);
        graphObserver.observe(graphElement);
      }
    }

    function render() {
      const [explanation, data] = frames[index];
      note.textContent = explanation;
      step.textContent = "Step " + (index + 1) + " of " + frames.length;
      prior.disabled = index === 0;
      next.disabled = index === frames.length - 1;
      timeline.value = index;
      timeline.setAttribute("aria-valuetext", step.textContent);
      const present = new Set(data.map(([label]) => label));
      rowElements.forEach((row, name) => { row.hidden = !present.has(name); });
      for (const [label, values] of data) {
        let row = rowElements.get(label);
        if (!row) {
          row = make("div", "trace-row");
          row.append(make("div", "trace-label", label), make("div", "trace-cells"));
          rowElements.set(label, row);
          board.append(row);
        }
        row.hidden = false;
        board.append(row);
        const cells = row.lastChild;
        const parts = tokens(values);
        parts.forEach((token, i) => {
          let cell = cells.children[i];
          if (!cell) {
            cell = make("span", "trace-cell");
            cells.append(cell);
          }
          const state = getState(token), value = getValue(token);
          if (cell.textContent !== value || cell.dataset.state !== state) {
            cell.textContent = value;
            cell.dataset.state = state;
            if (!motion.matches && state && cell.animate) {
              cell.getAnimations().forEach(animation => animation.cancel());
              cell.animate([{transform: "translateY(4px)", opacity: 0.67}, {transform: "translateY(0)", opacity: 1}],
                {duration: 230, easing: "ease-out"});
            }
          }
        });
        while (cells.children.length > parts.length) cells.lastChild.remove();
      }
      if (graphNodes) {
        const nodeRow = data.find(([label]) => label === "Nodes");
        if (nodeRow) tokens(nodeRow[1]).forEach(token => {
          const node = graphNodes.get(getValue(token));
          if (node) node.dataset.state = getState(token);
        });
      }
    }

    function stop() {
      clearInterval(timer);
      timer = 0;
      play.textContent = "Play";
    }

    function move(value) {
      index = Math.max(0, Math.min(frames.length - 1, value));
      render();
      if (index === frames.length - 1 && timer) stop();
    }

    function start() {
      if (index === frames.length - 1) move(0);
      play.textContent = "Pause";
      timer = setInterval(() => move(index + 1), Number(speed.value));
    }

    function setTrace(newFrames, newGraph) {
      stop();
      graphObserver?.disconnect();
      frames = newFrames;
      graph = newGraph;
      graphNodes = null;
      rowElements.clear();
      board.replaceChildren();
      drawGraph();
      timeline.max = frames.length - 1;
      play.disabled = frames.length < 2;
      move(0);
    }

    prior.addEventListener("click", () => { stop(); move(index - 1); });
    next.addEventListener("click", () => { stop(); move(index + 1); });
    timeline.addEventListener("input", () => { stop(); move(Number(timeline.value)); });
    speed.addEventListener("change", () => { if (timer) { stop(); start(); } });
    play.addEventListener("click", () => timer ? stop() : start());
    reset.addEventListener("click", () => { stop(); move(0); });
    if (form) {
      form.addEventListener("submit", event => {
        event.preventDefault();
        const data = new FormData(form);
        const feedback = form.querySelector("[role=status]");
        try {
          setTrace(makeFrames(topic.slug, data.get("values"), data.get("target")), null);
          feedback.textContent = "Custom trace ready. Step forward to inspect it.";
        } catch (error) {
          feedback.textContent = error.message;
        }
      });
      form.querySelector("[data-example]").addEventListener("click", () => {
        form.reset();
        form.querySelector("[role=status]").textContent = "Lesson example restored.";
        setTrace(topic.frames, topic.graph);
      });
    }
    const redraw = () => {
      if (graph) {
        graphObserver?.disconnect();
        graphElement.remove();
        drawGraph();
        render();
      }
    };
    window.addEventListener("field-theme", redraw);
    setTrace(topic.frames, topic.graph);
    return () => { stop(); graphObserver?.disconnect(); window.removeEventListener("field-theme", redraw); };
  }

  return {attach, specs: arraySpecs, makeFrames};
})();
