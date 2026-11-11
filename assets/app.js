"use strict";

(() => {
  const {topics, weeks} = window.FIELDNOTES;
  const app = document.querySelector("#app");
  const offline = location.protocol === "file:";
  const base = document.documentElement.dataset.base;
  const initialRoute = document.documentElement.dataset.route;
  const key = "dsa-fieldnotes-v1";
  const pad = n => String(n).padStart(2, "0");
  const stageNames = ["Learn", "Warm-up", "LeetCode", "Review"];
  const pages = {
    "": ["Study desk", "⌂"], roadmap: ["Roadmap", "≡"],
    practice: ["Problem bank", "⌘"], tutor: ["AI Tutor", "✦"], progress: ["Progress", "▥"], guide: ["Quick reference", "◇"]
  };
  const durations = [
    [[8, "Read the concept"], [12, "Step through the example"], [10, "Compare approaches and explain the invariant"]],
    [[5, "Recall yesterday's idea"], [18, "Predict the output and write Python"], [7, "Compare with the solution and test an edge case"]],
    [[5, "Read and restate the problem"], [20, "Attempt a solution on LeetCode"], [5, "Review the approach or record what blocked you"]],
    [[8, "Recall both techniques"], [17, "Solve the review prompt and retry a weak spot"], [5, "Compare reasoning and log what to revisit"]]
  ];
  const dayInfo = day => {
    const week = Math.floor((day - 1) / 7);
    const offset = (day - 1) % 7;
    const stage = Math.floor(offset / 3);
    const topicIndex = week * 2 + Math.min(stage, 1);
    return {day, week, offset, type: offset === 6 ? 3 : offset % 3, topicIndex, topic: topics[topicIndex]};
  };
  const firstDay = index => Math.floor(index / 2) * 7 + (index % 2) * 3 + 1;
  const dayRoute = day => "day/" + day;
  const days = Array.from({length: weeks.length * 7}, (_, i) => i + 1);
  const url = route => {
    if (offline) return base + "index.html" + (route ? "#" + route : "");
    if (route.startsWith("tutor/")) return base + "tutor.html?day=" + Number(route.slice(6));
    return base + (route.startsWith("day/") ?
      "sessions/day-" + String(Number(route.slice(4))).padStart(3, "0") + ".html" :
      (route || "index") + ".html");
  };
  const queryDay = Number(new URLSearchParams(location.search).get("day"));
  if (offline && initialRoute) {
    location.replace(url(initialRoute === "tutor" && days.includes(queryDay) ? "tutor/" + queryDay : initialRoute));
    return;
  }
  const escape = value => String(value).replace(/[&<>"']/g, char => (
    {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[char]
  ));
  const link = (route, label, cls = "") => `<a class="${cls}" href="${url(route)}">${label}</a>`;
  const problemUrl = topic => "https://leetcode.com/problems/" + topic.slug + "/";
  const defaults = () => ({complete: [], practice: {}, theme: "light"});
  let persistent = true;
  let state = defaults();
  let cleanups = [];

  function validate(candidate) {
    if (!candidate || !Array.isArray(candidate.complete) || typeof candidate.practice !== "object" ||
        !candidate.practice || Array.isArray(candidate.practice)) throw new Error("Invalid progress format.");
    const complete = [...new Set(candidate.complete.filter(day => Number.isInteger(day) && days.includes(day)))];
    const practice = Object.fromEntries(topics.map(t => [t.slug, candidate.practice[t.slug]])
      .filter(([, status]) => ["Attempted", "Solved", "Revisit"].includes(status)));
    return {complete, practice, theme: candidate.theme === "dark" ? "dark" : "light"};
  }
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      try { state = validate(JSON.parse(raw)); } catch { state = defaults(); }
    }
  } catch { persistent = false; }
  function save() {
    try { localStorage.setItem(key, JSON.stringify(state)); }
    catch {
      persistent = false;
      const notice = app.querySelector("[data-storage]");
      if (notice) notice.hidden = false;
    }
  }
  function theme() {
    document.documentElement.dataset.theme = state.theme;
    const button = app.querySelector("[data-theme-switch]");
    if (button) {
      button.textContent = state.theme === "dark" ? "☀ Light" : "☾ Dark";
      button.setAttribute("aria-label", state.theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
    window.dispatchEvent(new Event("field-theme"));
  }
  const completed = day => state.complete.includes(day);
  const pct = (count, total) => Math.round(count * 100 / total);
  const label = info => info.type === 3 ? weeks[info.week][0] + " review" : info.topic.title;
  const statusFor = topic => state.practice[topic.slug] || "Unstarted";
  const continueDay = () => days.find(day => !completed(day)) || 112;
  const badge = (value, style = "") => `<span class="badge ${style}">${escape(value)}</span>`;
  const plan = type => durations[type].map(([minutes, instruction]) =>
    `<li><b>${minutes}m</b><span>${instruction}</span></li>`).join("");

  function sidebar(active) {
    const count = state.complete.length;
    const nav = Object.entries(pages).map(([route, [title, icon]]) =>
      `<a href="${url(route)}" ${active === route ? 'aria-current="page"' : ""}><span class="nav-icon" aria-hidden="true">${icon}</span>${title}</a>`).join("");
    return `<aside class="sidebar" id="navigation">
      <a class="brand" href="${url("")}"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
        <span>DSA Fieldnotes<small>INTERVIEW STUDY PLAN</small></span></a>
      <nav aria-label="Main navigation">${nav}</nav>
      <div class="side-bottom">
        <div class="side-progress">
          <div><span>Course progress</span><strong data-course-percent>${pct(count, 112)}%</strong></div>
          <progress aria-label="Course progress" data-course-progress value="${count}" max="112"></progress>
          <small data-course-count>${count} of 112 sessions complete</small>
        </div>
      </div>
    </aside>`;
  }

  function weekRow(week, full) {
    const [title, goal] = weeks[week];
    const start = week * 7 + 1;
    const done = days.slice(start - 1, start + 6).filter(completed).length;
    const head = `<div class="week-head"><span class="week-num">${pad(week + 1)}</span>
      <div><h3>${escape(title)}</h3><p>${escape(goal)}</p></div><span class="week-count">${done}/7</span></div>`;
    if (!full) return `<article class="card week-card">${head}
      <div class="week-links">${[start, start + 3].map(day => link(dayRoute(day),
        escape(dayInfo(day).topic.title) + ' <span aria-hidden="true">→</span>')).join("")}</div></article>`;
    const topicCards = [start, start + 3].map(day => {
      const info = dayInfo(day), topic = info.topic;
      return `<div class="road-topic"><div><strong>${escape(topic.title)}</strong><small>LC ${topic.number} · ${escape(topic.problem)}</small></div>
        <div class="road-days">${[0, 1, 2].map(i => link(dayRoute(day + i),
        (completed(day + i) ? "✓ " : "") + "D" + (day + i) + " · " + stageNames[i], completed(day + i) ? "done" : "")).join("")}</div></div>`;
    }).join("");
    return `<article class="card road-week">${head}<div class="road-topics">${topicCards}</div>
      <div class="road-review">${link(dayRoute(start + 6), (completed(start + 6) ? "✓ " : "") + "Day " + (start + 6) + " · Weekly review →")}</div></article>`;
  }

  function home() {
    const info = dayInfo(continueDay()), count = state.complete.length;
    const heading = count === 112 ? "All sessions complete" : label(info);
    const heroDemo = `<div class="hero-demo" aria-hidden="true">
      <div class="demo-top"><span><i></i> BINARY SEARCH</span><span>TARGET 9</span></div>
      <div class="demo-mid"><span>LOW</span><span>MID</span><span>HIGH</span></div>
      <div class="demo-array">${[-1, 0, 3, 5, 9, 12].map((value, i) => `<div class="${i === 2 ? "demo-current" : ""}"><b>${value}</b><small>${i}</small></div>`).join("")}</div>
      <div class="demo-bottom"><span></span> Compare, discard, repeat</div>
    </div>`;
    return `<section class="hero"><div class="hero-content">
      <div class="eyebrow hero-kicker"><span></span> 30 MINUTES A DAY</div>
      <h1>Build your DSA<br>foundations.</h1>
      <p>Start with arrays and work up to graphs and dynamic programming. See each pattern in action, practice it in Python, then try it on LeetCode.</p>
      <div class="hero-actions">${link(dayRoute(info.day), count ? "Continue studying <span>→</span>" : "Start Day 1 <span>→</span>", "button primary")}
      ${link("roadmap", "Explore the roadmap", "button hero-link")}</div></div>${heroDemo}
    </section>
    <div class="dashboard-grid">
      <section class="card today"><div class="eyebrow">${count === 112 ? "COURSE COMPLETE" : "YOUR NEXT SESSION"}</div>
        <div class="today-title"><div><h2>${escape(heading)}</h2><p>Day ${info.day} · Week ${info.week + 1} · ${stageNames[info.type]}</p></div>
        ${link(dayRoute(info.day), '<span aria-hidden="true">→</span><span class="sr-only">Open session</span>', "square-button")}</div>
        <ol class="plan today-plan">${plan(info.type)}</ol></section>
      <section class="card overview"><div class="eyebrow">YOUR PROGRESS</div>
        <div class="overview-content"><div class="ring" style="--progress:${pct(count, 112)}%" role="img" aria-label="${pct(count, 112)} percent complete">
          <strong>${pct(count, 112)}<small>%</small></strong></div>
          <div><b>${count} / 112</b><span>sessions complete</span>${link("progress", "View progress →", "text-link")}</div></div>
        <div class="overview-foot"><span><b>32</b> topics</span><span><b>16</b> weeks</span><span><b>32</b> problems</span></div>
      </section>
    </div>
    <section class="home-roadmap"><header class="section-heading"><div><div class="eyebrow">CURRICULUM</div><h2>The study plan</h2></div>${link("roadmap", "All 16 weeks →", "text-link")}</header>
      <div class="week-grid">${[0, 1, 2].map(week => weekRow(week, false)).join("")}</div></section>`;
  }

  function roadmap() {
    return `<header class="page-heading"><div class="eyebrow">112 DAILY SESSIONS</div><h1>Roadmap</h1>
      <p>Each topic gets three 30-minute sessions. Learn the pattern, solve an original warm-up, then try a matched LeetCode problem. Day seven is for recall and retries.</p></header>
    <section class="card roadmap-bar"><div><label for="topic-search">Find a topic or problem</label><input id="topic-search" type="search" placeholder="Try binary search or #704"></div>
      <div><label for="week-filter">Weeks</label><select id="week-filter"><option value="">All 16 weeks</option>
      ${weeks.map(([title], i) => `<option value="${i}">${pad(i + 1)} · ${escape(title)}</option>`).join("")}</select></div>
    </section>
    <p class="result-count" id="road-count" role="status"></p>
    <div class="road-grid" id="road-results"></div>
    <section class="card next-topics"><h2>Where to go after the core course</h2><p>Choose based on the interviews you are preparing for.</p>
      <ul><li><strong>More interview patterns</strong> · permutations, combinations, knapsack, coin change, edit distance, and interval scheduling.</li>
      <li><strong>More graph algorithms</strong> · unweighted shortest paths, Bellman–Ford, Floyd–Warshall, strongly connected components, bridges, and bipartite matching.</li>
      <li><strong>More range and string tools</strong> · segment trees, sparse tables, KMP, and rolling hashes.</li></ul>
    </section>`;
  }

  function practice() {
    return `<header class="page-heading"><div class="eyebrow">MATCHED TO THE CURRICULUM</div><h1>Problem bank</h1>
      <p>Find the warm-up and solution for every problem. Log your attempt here after working through the topic’s example.</p></header>
    <section class="card roadmap-bar problem-bar">
      <div><label for="problem-search">Find a problem</label><input id="problem-search" type="search" placeholder="Search title, topic, or number"></div>
      <div><label for="difficulty-filter">Difficulty</label><select id="difficulty-filter"><option value="">All difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
      <div><label for="status-filter">Your status</label><select id="status-filter"><option value="">All statuses</option><option>Unstarted</option><option>Attempted</option><option>Solved</option><option>Revisit</option></select></div>
    </section>
    <p id="problem-count" class="result-count" role="status"></p>
    <div class="problem-list" id="problem-results"></div>
    <div class="resource-links"><a href="https://leetcode.com/studyplan/leetcode-75/" target="_blank" rel="noopener noreferrer">LeetCode 75 →</a>
      <a href="https://leetcode.com/studyplan/top-interview-150/" target="_blank" rel="noopener noreferrer">Top Interview 150 →</a></div>`;
  }

  function progress() {
    const counts = ["Solved", "Attempted", "Revisit"].map(status => Object.values(state.practice).filter(value => value === status).length);
    return `<header class="page-heading"><div class="eyebrow">STUDY LOG</div><h1>Your progress</h1>
      <p>Session completion and LeetCode status are tracked separately. Use a backup to move your progress between browsers or devices.</p></header>
    <div class="progress-stats">
      ${[[state.complete.length + " / 112", "Sessions complete"], [counts[0] + " / 32", "Problems solved"],
        [counts[1], "Attempted"], [counts[2], "Flagged for revisit"]].map(([value, name]) =>
        `<div class="card progress-stat"><strong>${value}</strong><span>${name}</span></div>`).join("")}
    </div>
    <section class="card progress-map"><h2>Session history</h2><p>Open any day to review it. A filled day marks a completed session.</p>
      ${weeks.map(([title], i) => `<div class="progress-week"><div><b>Week ${pad(i + 1)}</b><span>${escape(title)}</span></div><div class="day-dots">
        ${days.slice(i * 7, i * 7 + 7).map(day => `<a aria-label="Day ${day}, ${completed(day) ? "complete" : "incomplete"}" class="${completed(day) ? "done" : ""}" href="${url(dayRoute(day))}">${day}</a>`).join("")}
        </div></div>`).join("")}
    </section>
    <section class="card backup"><h2>Progress backup</h2><p>Importing a backup combines completed sessions and applies the imported statuses for its problems.</p>
      <button type="button" class="button secondary" id="export">Download backup</button>
      <label class="button secondary import" for="import">Import backup<input id="import" type="file" accept=".json,application/json" class="sr-only"></label>
      <p role="status" id="backup-note"></p></section>`;
  }

  function guide() {
    const reference = [
      ["List (dynamic array)", "Index O(1) · append amortized O(1) · membership O(n)"],
      ["Dictionary / set", "Lookup, insert, and delete expected O(1)"],
      ["Deque", "Append and pop from either end O(1)"],
      ["Min-heap", "Peek O(1) · push/pop O(log n) · heapify O(n)"],
      ["Balanced BST", "Search, insert, delete O(log n) · a skewed BST can take O(n)"],
      ["Adjacency-list graph", "Storage O(V + E) · BFS/DFS O(V + E)"],
      ["Fenwick tree", "Point update and prefix sum O(log n) · storage O(n)"]
    ];
    return `<header class="page-heading"><div class="eyebrow">PYTHON AND COMPLEXITY</div><h1>Quick reference</h1>
      <p>Use this page when a solution introduces a Python idiom or when you need to explain a time–space trade-off.</p></header>
    <section class="card note-section"><h2>Before Day 1</h2>
      <p>Make sure you can write a function, loop through a list, use an if statement, and return a value. This five-line example returns the indices of the positive values. Try it with [−2, 3, 0, 7] and an empty list.</p>
      ${codeBlock("def positive_indices(values):\n    result = []\n    for index, value in enumerate(values):\n        if value > 0:\n            result.append(index)\n    return result", "Python 3")}
      <details><summary>Check the outputs</summary><p>[1, 3] for the first list and [] for the empty list. enumerate yields each zero-based index together with its value.</p></details>
    </section>
    <section class="card note-section"><h2>Python idioms in the course</h2>
      <dl class="reference"><dt><code>range(left, right)</code></dt><dd>Visits left through right − 1. Use it for half-open index ranges.</dd>
      <dt><code>counts.get(key, 0)</code></dt><dd>Reads a dictionary entry, using zero when the key is absent.</dd>
      <dt><code>path.copy()</code></dt><dd>Takes a shallow snapshot of a list so later pushes and pops do not change the saved path.</dd>
      <dt><code>from collections import deque</code></dt><dd>Use popleft() for a fast FIFO removal.</dd>
      <dt><code>import heapq</code></dt><dd>Use heapq.heappop(heap) for the least item. Tuples compare element by element.</dd>
      <dt><code>node is other</code></dt><dd>Tests whether two variables reference the same object.</dd></dl>
    </section>
    <section class="card note-section"><h2>Common operation costs</h2><p>n is the number of items. V and E are graph vertices and edges. Extra space counts auxiliary storage, with output space named separately when relevant.</p>
      <dl class="reference">${reference.map(([term, detail]) => `<dt>${term}</dt><dd>${detail}</dd>`).join("")}</dl>
      <p>Typical growth from smaller to larger: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ). Report expected or amortized cost when the guarantee depends on it.</p>
    </section>
    <section class="card note-section"><h2>How to use your 30 minutes</h2><ol class="steps">
      <li>Say the input and output in one sentence. Start with a straightforward solution and count its work.</li>
      <li>Find the invariant or state that lets you reuse earlier work. Explain why any discarded candidate is safe to discard.</li>
      <li>Test a typical case and an edge case. Say the time and extra space aloud.</li>
      <li>If a problem needs another session, log Revisit and use a weekly review block to retry before reading the answer.</li>
    </ol></section>`;
  }

  function highlighted(code) {
    const pattern = /#[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|\b(?:def|class|return|import|from|for|in|while|if|elif|else|and|or|not|is|continue|break|lambda|True|False|None)\b|\b\d+\b/g;
    let result = "", last = 0;
    for (const hit of code.matchAll(pattern)) {
      const [word] = hit;
      const kind = word.startsWith("#") ? "comment" : /^['"]/.test(word) ? "string" : /^\d/.test(word) ? "number" : "keyword";
      result += escape(code.slice(last, hit.index)) + `<span class="code-${kind}">${escape(word)}</span>`;
      last = hit.index + word.length;
    }
    return result + escape(code.slice(last));
  }

  function codeBlock(code, title) {
    return `<div class="code-block"><div class="code-header"><span>${escape(title)}</span>
      <button type="button" class="copy" data-copy>Copy code</button></div>
      <pre tabindex="0" aria-label="${escape(title)} code"><code>${highlighted(code)}</code></pre></div>`;
  }

  function tracePanel(topic) {
    const spec = window.FieldVisuals.specs[topic.slug];
    const custom = spec ? `<details class="custom-inputs"><summary>Try your own input</summary>
      <form class="trace-form"><label>${escape(spec[0])}<input name="values" value="${escape(spec[1])}" autocomplete="off" maxlength="140"></label>
      ${spec[2] ? `<label>${spec[2]}<input name="target" value="${spec[3]}" inputmode="numeric" maxlength="8" required></label>` : ""}
      <div class="actions"><button class="button secondary" type="submit">Run input</button>
      <button class="button plain" type="button" data-example>Restore example</button></div>
      <p role="status"></p></form></details>` : "";
    const diagram = topic.graph ? `<details><summary>Diagram connections</summary><p>${topic.graph[1].map(edge =>
      escape(edge.replace(">", " → ").replace("-", " — ").replace(":", " · weight "))).join(", ")}</p></details>` : "";
    return `<section class="card note-section visual" id="visualizer" data-visual>
      <div class="visual-heading"><div><div class="eyebrow">VISUAL LAB</div><h2>Step through the algorithm</h2></div><span class="step-badge" data-step></span></div>
      <div class="trace-board" data-board aria-label="Current algorithm state"></div>
      <p class="frame-note" data-frame-note aria-live="polite"></p>
      <div class="trace-controls">
        <button type="button" class="button secondary" data-prior>← Back</button>
        <button type="button" class="button primary" data-play>Play</button>
        <button type="button" class="button secondary" data-next>Next →</button>
        <button type="button" class="button plain" data-reset>Reset</button>
        <label class="speed">Speed <select data-speed><option value="2300">Slow</option><option value="1450" selected>Normal</option><option value="750">Fast</option></select></label>
      </div>
      <label class="timeline"><span class="sr-only">Trace timeline</span><input type="range" min="0" value="0" step="1" data-timeline></label>
      <div class="trace-legend"><span><i></i> Current</span><span><i></i> Confirmed / updated</span><span><i></i> Discarded / invalid</span></div>
      ${diagram}${custom}</section>`;
  }

  function concept(info) {
    const topic = info.topic;
    return `<section class="card note-section" id="concept"><div class="eyebrow">THE PATTERN</div><h2>How it works</h2>
      <p>${escape(topic.idea)}</p><ol class="steps">${topic.steps.map(step => `<li>${escape(step)}</li>`).join("")}</ol>
      <p class="recognize"><strong>When to use it.</strong> ${escape(topic.recognize)}</p>
      <div class="callout"><strong>Watch for this</strong><p>${escape(topic.pitfall)}</p></div></section>
      ${tracePanel(topic)}
      <section class="card note-section" id="complexity"><div class="eyebrow">TIME AND SPACE</div><h2>Compare the approaches</h2>
      <div class="compare">${topic.cost.map(([name, time, memory, detail]) => `<article><h3>${escape(name)}</h3>
      <dl><dt>Time</dt><dd>${escape(time)}</dd><dt>Space</dt><dd>${escape(memory)}</dd></dl><p>${escape(detail)}</p></article>`).join("")}</div>
      ${topic.number === 217 ? operationLab() : ""}
      <p><strong>Optimization checkpoint.</strong> ${escape(topic.checkpoint[0])}</p>
      <details><summary>Check your reasoning</summary><p>${escape(topic.checkpoint[1])}</p></details></section>
      <section class="card note-section next-callout"><div><h2>Practice this pattern in Python</h2><p>Predict the output and try the original exercise before opening the worked code.</p></div>
      ${link(dayRoute(info.day + 1), "Open the warm-up →", "button secondary")}</section>`;
  }

  function operationLab() {
    return `<div class="operation-lab" data-operations><h3>Operation count lab</h3>
      <p>Change the size of an all-distinct array. Compare pair checks with set membership checks on the same scale.</p>
      <label for="operation-size">Array size <output for="operation-size" data-operation-size>16</output></label>
      <input id="operation-size" type="range" min="2" max="128" value="16" step="1">
      <div class="operation-bar"><span>Pair checks</span><progress aria-label="Pair checks" data-pair-bar value="120" max="120"></progress><b data-pair-count>120</b></div>
      <div class="operation-bar"><span>Set lookups</span><progress aria-label="Set membership checks" data-set-bar value="16" max="120"></progress><b data-set-count>16</b></div>
      <p>Pair checks use n(n−1)/2. Set lookups use n, plus one insertion per distinct value.</p></div>`;
  }

  function warmup(info) {
    const topic = info.topic, [example] = topic.examples;
    return `<section class="card note-section" id="warmup"><div class="eyebrow">ORIGINAL PRACTICE EXERCISE</div><h2>Try it before seeing the code</h2>
      <p>${escape(topic.warmup)}</p>
      <form id="warm-form" class="warm-form"><label for="warm-answer">Predict the return value</label>
      <pre class="example-code"><code>${escape(example[0])}</code></pre>
      <div class="warm-input"><input id="warm-answer" name="answer" placeholder="Enter the expected output" autocomplete="off" maxlength="200" required>
      <button class="button primary" type="submit">Check answer</button></div>
      <p id="warm-feedback" role="status"></p></form>
      <details><summary>Show sample outputs</summary>
      <div class="sample-list">${topic.examples.map(([call, answer]) => `<div><code>${escape(call)}</code><span aria-hidden="true">→</span><code>${escape(answer)}</code></div>`).join("")}</div></details>
      </section>
      <section class="card note-section" id="warm-code"><div class="eyebrow">WORKED CODE</div><h2>Check your implementation</h2>
      <p>Write your own function, then open the code and compare the loop state, edge cases, and returned value.</p>
      <details><summary>Reveal the Python warm-up solution</summary>${codeBlock(topic.warm, "Python 3 · Warm-up")}</details>
      </section>
      <section class="card note-section next-callout"><div><h2>Apply the pattern</h2><p>Try the matched interview problem after you can explain the warm-up.</p></div>
      ${link(dayRoute(info.day + 1), "Open LeetCode session →", "button secondary")}</section>`;
  }

  function practiceLesson(info) {
    const t = info.topic, choices = ["Unstarted", "Attempted", "Solved", "Revisit"];
    return `<section class="card note-section" id="problem"><div class="eyebrow">LEETCODE ${t.number}</div>
      <h2>${escape(t.problem)}</h2><p>${escape(t.lc)}</p>
      <div class="actions"><a class="button primary" href="${problemUrl(t)}" target="_blank" rel="noopener noreferrer">Open on LeetCode →</a>
      ${badge(t.difficulty, t.difficulty.toLowerCase())}
      ${link(dayRoute(info.day - 1), "Revisit the warm-up", "text-link")}</div>
      <details><summary>Reveal a hint</summary><p>${escape(t.hint)}</p></details>
      <div class="status-row"><label for="session-status">My problem status</label>
      <select id="session-status">${choices.map(s => `<option ${statusFor(t) === s ? "selected" : ""}>${s}</option>`).join("")}</select>
      <span role="status" id="status-note"></span></div></section>
      <section class="card note-section" id="solution"><div class="eyebrow">AFTER YOUR ATTEMPT</div><h2>Check a possible solution</h2>
      <p>Compare the invariant, runtime, and extra space with your own approach.</p>
      <details><summary>Reveal the explanation and Python code</summary>
      <h3>Why it works</h3><p>${escape(t.why)}</p><dl class="solution-cost"><dt>Time</dt><dd>${escape(t.cost[1][1])}</dd>
      <dt>Space</dt><dd>${escape(t.cost[1][2])}</dd></dl>
      ${codeBlock(t.solution, "Python 3 · LeetCode")}</details></section>`;
  }

  function reviewLesson(info) {
    const [title, goal, prompt, answer] = weeks[info.week];
    return `<section class="card note-section" id="review"><div class="eyebrow">ACTIVE RECALL</div><h2>${escape(title)} review</h2>
      <p>${escape(goal)}</p><div class="callout"><strong>Try this without your notes</strong><p>${escape(prompt)}</p></div>
      <details><summary>Check the reasoning</summary><p>${escape(answer)}</p></details>
    </section>
    <section class="card note-section"><h2>Return to either topic</h2><p>Explain what each approach remembers, trace a small example, then retry one exercise that slowed you down.</p>
      <div class="week-links">${[info.day - 6, info.day - 3].map(day => link(dayRoute(day), escape(dayInfo(day).topic.title) + " →")).join("")}</div></section>`;
  }

  function lesson(info) {
    const {type, day, week, topic, topicIndex} = info;
    const header = type === 3 ? weeks[week][0] + " review" : topic.title;
    const stageDetails = ["Learn the invariant, follow the visual trace, and compare the time–space trade-off.",
      "Recall the pattern, predict the output, and write your own Python function.",
      "Solve the matched problem on LeetCode, then compare your reasoning and code.",
      "Retrieve both patterns from memory before reopening the notes."];
    const content = [concept, warmup, practiceLesson, reviewLesson][type](info);
    const done = completed(day);
    const routeNav = type === 3 ? "" : `<nav class="stage-nav" aria-label="Topic sessions">${stageNames.slice(0, 3).map((name, i) =>
      `<a ${i === type ? 'aria-current="page"' : ""} href="${url(dayRoute(firstDay(topicIndex) + i))}">
        <span>${i + 1}</span>${name}</a>`).join("")}</nav>`;
    return `<header class="page-heading lesson-heading"><div class="eyebrow">WEEK ${pad(week + 1)} · DAY ${String(day).padStart(3, "0")} · ${stageNames[type].toUpperCase()}</div>
      <h1>${escape(header)}</h1><p>${stageDetails[type]}</p></header>
      <div class="lesson-toolbar">${routeNav}${link("tutor/" + day, "Ask AI Tutor →", "button secondary lesson-tutor")}</div>
      <div class="lesson-grid"><div class="lesson-content">${content}
        <section class="card completion"><div><h2>Session checklist</h2><p>${type === 2 ? "Log your problem status, even if you need another attempt." : "Explain the main idea in your own words before moving on."}</p></div>
        <button type="button" class="button primary" data-complete aria-pressed="${done}">${done ? "✓ Completed" : "Mark complete"}</button>
        <span class="sr-only" role="status" data-completion-note></span></section>
        <nav class="lesson-pagination" aria-label="Adjacent sessions">
          ${day > 1 ? link(dayRoute(day - 1), "← Day " + (day - 1)) : link("roadmap", "← Roadmap")}
          ${day < 112 ? link(dayRoute(day + 1), "Day " + (day + 1) + " →") : link("progress", "View progress →")}
        </nav></div>
        <aside class="lesson-aside"><section class="card session-plan"><div class="eyebrow">TODAY’S 30 MINUTES</div><ol class="plan">${plan(type)}</ol>
          <div class="timer" data-timer><span data-time role="timer" aria-label="Session time remaining">30:00</span><div>
            <button type="button" class="button secondary" data-timer-start>Start</button><button type="button" class="button plain" data-timer-reset>Reset</button>
          </div><span class="sr-only" role="status" data-timer-note></span></div></section>
          ${type < 3 ? `<section class="card session-links"><div class="eyebrow">THIS TOPIC</div>
            ${stageNames.slice(0, 3).map((name, i) => {
              const number = firstDay(topicIndex) + i;
              return `<a href="${url(dayRoute(number))}" ${day === number ? 'aria-current="page"' : ""}>
                <span data-day-marker="${number}">${completed(number) ? "✓" : "D" + number}</span>${name}</a>`;
            }).join("")}</section>` : ""}
        </aside>
      </div>`;
  }

  function refreshSidebar() {
    const count = state.complete.length;
    app.querySelector("[data-course-percent]").textContent = pct(count, 112) + "%";
    app.querySelector("[data-course-progress]").value = count;
    app.querySelector("[data-course-count]").textContent = count + " of 112 sessions complete";
  }

  function searchMatches(topic, query) {
    const haystack = [topic.title, topic.number, topic.problem, topic.category].join(" ").toLowerCase();
    return query.trim().toLowerCase().replace(/#/g, "").split(/\s+/).every(word => haystack.includes(word));
  }

  function bindRoadmap() {
    const search = document.querySelector("#topic-search");
    const filter = document.querySelector("#week-filter");
    const output = document.querySelector("#road-results");
    const render = () => {
      const visible = weeks.map((_, i) => i).filter(i => (filter.value === "" || Number(filter.value) === i) &&
        (weeks[i][0].toLowerCase().includes(search.value.trim().toLowerCase()) ||
          topics.slice(i * 2, i * 2 + 2).some(topic => searchMatches(topic, search.value))));
      document.querySelector("#road-count").textContent = visible.length + (visible.length === 1 ? " week" : " weeks");
      output.innerHTML = visible.length ? visible.map(i => weekRow(i, true)).join("") :
        '<p class="card empty">No matching weeks. Try a different topic or clear the filter.</p>';
    };
    search.addEventListener("input", render);
    filter.addEventListener("change", render);
    render();
  }

  function setStatus(topic, status) {
    if (status === "Unstarted") delete state.practice[topic.slug];
    else state.practice[topic.slug] = status;
    save();
  }

  function bindPractice() {
    const search = document.querySelector("#problem-search");
    const difficulty = document.querySelector("#difficulty-filter");
    const status = document.querySelector("#status-filter");
    const output = document.querySelector("#problem-results");
    function render() {
      const visible = topics.filter(topic => searchMatches(topic, search.value) &&
        (!difficulty.value || difficulty.value === topic.difficulty) &&
        (!status.value || status.value === statusFor(topic)));
      document.querySelector("#problem-count").textContent = visible.length + (visible.length === 1 ? " problem" : " problems");
      output.innerHTML = visible.length ? visible.map(topic => {
        const day = firstDay(topics.indexOf(topic));
        return `<article class="card problem-card"><span class="problem-number">#${topic.number}</span>
          <div><h2>${escape(topic.problem)}</h2><p>${escape(topic.title)} · Week ${dayInfo(day).week + 1}</p></div>
          ${badge(topic.difficulty, topic.difficulty.toLowerCase())}
          <label class="problem-status"><span class="sr-only">Status for ${escape(topic.problem)}</span>
            <select data-slug="${topic.slug}">${["Unstarted", "Attempted", "Solved", "Revisit"].map(s =>
              `<option ${s === statusFor(topic) ? "selected" : ""}>${s}</option>`).join("")}</select></label>
          <div class="problem-actions">${link(dayRoute(day + 1), "Warm-up", "text-link")}${link(dayRoute(day + 2), "Hint & solution", "text-link")}
            <a href="${problemUrl(topic)}" target="_blank" rel="noopener noreferrer" class="text-link">LeetCode →</a></div></article>`;
      }).join("") : '<p class="card empty">No matching problems. Try clearing a filter.</p>';
    }
    output.addEventListener("change", event => {
      const topic = topics.find(item => item.slug === event.target.dataset.slug);
      if (!topic) return;
      setStatus(topic, event.target.value);
      if (status.value) { render(); status.focus(); }
    });
    search.addEventListener("input", render);
    difficulty.addEventListener("change", render);
    status.addEventListener("change", render);
    render();
  }

  function bindBackup() {
    document.querySelector("#export").addEventListener("click", () => {
      const file = new Blob([JSON.stringify(state, null, 2)], {type: "application/json"});
      const download = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = download;
      a.download = "dsa-fieldnotes-progress.json";
      a.click();
      setTimeout(() => URL.revokeObjectURL(download), 2000);
      document.querySelector("#backup-note").textContent = "Progress backup downloaded.";
    });
    const input = document.querySelector("#import");
    input.addEventListener("change", async () => {
      const file = input.files[0];
      if (!file) return;
      try {
        if (file.size > 100000) throw new Error("File too large.");
        const imported = validate(JSON.parse(await file.text()));
        state.complete = [...new Set([...state.complete, ...imported.complete])];
        Object.assign(state.practice, imported.practice);
        save();
        if (document.querySelector("#import") === input) {
          render("progress");
          document.querySelector("#backup-note").textContent = "Progress restored.";
          document.querySelector("#import").focus();
        }
      } catch {
        const note = document.querySelector("#backup-note");
        if (note) note.textContent = "Could not import this file. Choose a Fieldnotes progress backup.";
        input.value = "";
      }
    });
  }

  function canonicalLiteral(text) {
    const lexer = /\s*(?:("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|([+-]?\d+(?:\.\d+)?)|(True|False|None|true|false|null)|([\[\]{}(),:]))/gy;
    const tokens = [];
    let pos = 0;
    const input = text.trim();
    while (pos < input.length) {
      const token = lexer.exec(input);
      if (!token) throw new Error("Expected a Python literal.");
      tokens.push(token.slice(1));
      pos = lexer.lastIndex;
    }
    let cursor = 0;
    function read() {
      const [quoted, number, name, symbol] = tokens[cursor++] || [];
      if (quoted) return ["string", quoted.slice(1, -1).replace(/\\(['"\\nrt])/g,
        (_, char) => ({n: "\n", r: "\r", t: "\t"}[char] || char))];
      if (number) return ["number", Number(number)];
      if (name) return ["literal", name === "None" || name === "null" ? "null" : name.toLowerCase()];
      const ends = {"[": "]", "(": ")", "{": "}"};
      if (!Object.hasOwn(ends, symbol)) throw new Error("Invalid literal.");
      const end = ends[symbol];
      const items = [];
      const current = () => tokens[cursor]?.[3];
      while (current() !== end) {
        const item = read();
        if (symbol === "{") {
          if (current() !== ":") throw new Error("Expected a colon.");
          cursor++;
          items.push([JSON.stringify(item), read()]);
        } else items.push(item);
        if (current() === ",") cursor++;
        else if (current() !== end) throw new Error("Expected a comma.");
      }
      cursor++;
      if (symbol === "{") items.sort((a, b) => a[0].localeCompare(b[0]));
      return [symbol === "{" ? "map" : "sequence", items];
    }
    const result = read();
    if (cursor !== tokens.length) throw new Error("Extra input.");
    return JSON.stringify(result);
  }

  function bindTimer() {
    const host = document.querySelector("[data-timer]");
    const display = host.querySelector("[data-time]");
    const button = host.querySelector("[data-timer-start]");
    const note = host.querySelector("[data-timer-note]");
    let remaining = 1800000, deadline = 0, interval = 0;
    function update() {
      if (interval) remaining = Math.max(0, deadline - Date.now());
      const seconds = Math.ceil(remaining / 1000);
      display.textContent = pad(Math.floor(seconds / 60)) + ":" + pad(seconds % 60);
      if (!remaining && interval) {
        clearInterval(interval);
        interval = 0;
        button.textContent = "Restart";
        note.textContent = "Thirty minutes have passed.";
      }
    }
    button.addEventListener("click", () => {
      if (interval) {
        update();
        clearInterval(interval);
        interval = 0;
        button.textContent = remaining ? "Resume" : "Restart";
      } else {
        if (!remaining) remaining = 1800000;
        deadline = Date.now() + remaining;
        interval = setInterval(update, 250);
        button.textContent = "Pause";
        note.textContent = "";
        update();
      }
    });
    host.querySelector("[data-timer-reset]").addEventListener("click", () => {
      clearInterval(interval);
      interval = 0;
      remaining = 1800000;
      button.textContent = "Start";
      note.textContent = "";
      update();
    });
    cleanups.push(() => clearInterval(interval));
  }

  function bindLesson(info) {
    const completion = document.querySelector("[data-complete]");
    completion.addEventListener("click", () => {
      const done = !completed(info.day);
      state.complete = done ? [...state.complete, info.day] : state.complete.filter(day => day !== info.day);
      save();
      completion.setAttribute("aria-pressed", String(done));
      completion.textContent = done ? "✓ Completed" : "Mark complete";
      const marker = document.querySelector("[data-day-marker='" + info.day + "']");
      if (marker) marker.textContent = done ? "✓" : "D" + info.day;
      document.querySelector("[data-completion-note]").textContent = done ? "Session marked complete." : "Session marked incomplete.";
      refreshSidebar();
    });
    bindTimer();
    if (info.type === 0) {
      cleanups.push(window.FieldVisuals.attach(info.topic, document.querySelector("[data-visual]")));
      const operationLab = document.querySelector("[data-operations]");
      if (operationLab) {
        const slider = operationLab.querySelector("#operation-size");
        slider.addEventListener("input", () => {
          const n = Number(slider.value), pairs = n * (n - 1) / 2;
          const scale = Math.max(n, pairs);
          slider.setAttribute("aria-valuetext", n + " values: " + pairs + " pair checks, " + n + " set lookups");
          operationLab.querySelector("[data-operation-size]").value = n;
          operationLab.querySelector("[data-pair-count]").textContent = pairs.toLocaleString();
          operationLab.querySelector("[data-set-count]").textContent = n.toLocaleString();
          const pairBar = operationLab.querySelector("[data-pair-bar]"), setBar = operationLab.querySelector("[data-set-bar]");
          pairBar.max = setBar.max = scale;
          pairBar.value = pairs;
          setBar.value = n;
        });
      }
    }
    if (info.type === 1) {
      document.querySelector("#warm-form").addEventListener("submit", event => {
        event.preventDefault();
        const input = document.querySelector("#warm-answer").value;
        const feedback = document.querySelector("#warm-feedback");
        try {
          const correct = canonicalLiteral(input) === canonicalLiteral(info.topic.examples[0][1]);
          feedback.dataset.result = correct ? "correct" : "retry";
          feedback.textContent = correct ? "Correct. Now write the function and test the second example."
            : "Try again. Trace the state after each input, then compare the final value.";
        } catch {
          feedback.dataset.result = "retry";
          feedback.textContent = "Enter the return value in Python notation, such as 4, [1, 2], or True.";
        }
      });
    }
    if (info.type === 2) {
      const select = document.querySelector("#session-status");
      select.addEventListener("change", () => {
        setStatus(info.topic, select.value);
        document.querySelector("#status-note").textContent = "Status updated.";
      });
    }
  }

  function render(route, focus = false) {
    cleanups.forEach(cleanup => cleanup());
    cleanups = [];
    const day = route.startsWith("day/") ? Number(route.slice(4)) : 0;
    const info = days.includes(day) ? dayInfo(day) : null;
    const tutorDay = route.startsWith("tutor/") ? Number(route.slice(6)) : queryDay;
    const isTutor = route === "tutor" || route.startsWith("tutor/");
    const contextDay = days.includes(tutorDay) ? tutorDay : 0;
    const tutorOptions = isTutor ? days.map(number => {
      const item = dayInfo(number);
      return [number, "Day " + number + " · " + label(item) + (item.type === 3 ? "" : " · " + stageNames[item.type])];
    }) : [];
    const tutorConfig = {offline, day: contextDay, options: tutorOptions, lessonUrl: number => url(dayRoute(number))};
    const routes = {"": home, roadmap, practice, progress, guide};
    const view = info ? lesson(info) : isTutor ? window.FieldTutor.page(tutorConfig)
      : (Object.hasOwn(routes, route) ? routes[route]() : home());
    const section = isTutor ? "tutor" : route;
    const name = info ? "Day " + day + " · " + stageNames[info.type] : (pages[section] || pages[""])[0];
    document.title = (info ? label(info) + " · " + name : name) + " · DSA Fieldnotes";
    app.innerHTML = `<div class="shell">${sidebar(info ? "" : section)}<div class="main-shell">
      <header class="topbar"><div class="topbar-left"><button type="button" class="button menu-toggle" data-menu
        aria-expanded="false" aria-controls="navigation">☰ Menu</button>
        <span class="top-path">${info ? link("roadmap", "Roadmap") + '<span aria-hidden="true">/</span>' : ""}${escape(name)}</span></div>
        <button type="button" class="button theme-switch" data-theme-switch></button></header>
      <main class="content" id="content" tabindex="-1">
        <p class="storage-note" data-storage ${persistent ? "hidden" : ""}>Browser storage is unavailable. Progress stays in this tab until you leave or reload. Use Progress to download a backup.</p>
        ${view}<footer class="footer"><span>DSA Fieldnotes</span>${link("guide", "Quick reference")}<span>Python 3</span></footer></main>
      </div></div>`;
    theme();
    app.querySelector("[data-theme-switch]").addEventListener("click", () => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      save();
      theme();
    });
    const menu = app.querySelector("[data-menu]");
    function toggleMenu(show) {
      menu.setAttribute("aria-expanded", String(show));
      app.querySelector(".shell").classList.toggle("menu-open", show);
      if (show) app.querySelector(".sidebar nav a").focus();
      else menu.focus();
    }
    menu.addEventListener("click", () => toggleMenu(menu.getAttribute("aria-expanded") === "false"));
    app.querySelector(".shell").addEventListener("keydown", event => {
      if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") toggleMenu(false);
    });
    if (info) bindLesson(info);
    else if (isTutor) cleanups.push(window.FieldTutor.attach(app.querySelector("[data-tutor]"), tutorConfig));
    else if (route === "roadmap") bindRoadmap();
    else if (route === "practice") bindPractice();
    else if (route === "progress") bindBackup();
    if (focus) {
      const main = app.querySelector("#content");
      main.focus({preventScroll: true});
      window.scrollTo(0, 0);
    }
  }

  app.addEventListener("click", async event => {
    const button = event.target.closest("[data-copy]");
    if (!button) return;
    const code = button.closest(".code-block").querySelector("code");
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = "Copied ✓";
    } catch {
      const selection = window.getSelection(), range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = "Code selected";
    }
    setTimeout(() => { button.textContent = "Copy code"; }, 1800);
  });

  function routeFromHash() {
    const route = location.hash.slice(1);
    if (!route || Object.hasOwn(pages, route) || /^(?:day|tutor)\/(?:[1-9]\d{0,2})$/.test(route)) return route;
    return null;
  }
  if (offline) window.addEventListener("hashchange", () => {
    const route = routeFromHash();
    if (route !== null) render(route, true);
  });
  render(offline ? routeFromHash() || "" : initialRoute);
})();

