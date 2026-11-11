"use strict";

window.FieldTutor = (() => {
  const imageLimit = 5 * 1024 * 1024, totalLimit = 10 * 1024 * 1024;
  const imageTypes = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "webp": "image/webp"};
  const starters = [
    ["Explain it simply", "Explain the key idea with a small example and walk me through it."],
    ["Compare runtimes", "Show me how to count the work in the straightforward and optimized approaches."],
    ["Give me a practice question", "Give me one beginner-friendly practice question. Let me try before you reveal the solution."]
  ];
  const escape = value => String(value).replace(/[&<>"']/g, char =>
    ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[char]));
  const localUrl = day => "http://127.0.0.1:8765/tutor.html" + (day ? "?day=" + day : "");
  const make = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  function page(config) {
    const {day, options, lessonUrl} = config;
    return `<section data-tutor>
      <header class="page-heading tutor-heading"><div class="eyebrow">DSA FIELDNOTES</div>
        <h1>AI Tutor</h1><p>Ask about a concept, trace your Python code, or attach a screenshot of the part that’s confusing.</p></header>
      <div class="tutor-grid">
        <section class="card tutor-chat" aria-labelledby="tutor-chat-title">
          <header class="tutor-chat-header"><div><h2 id="tutor-chat-title">Your conversation</h2>
            <p class="tutor-connection" data-connection role="status">${config.offline ? "Local setup required" : "Checking tutor connection…"}</p></div>
            <button class="button secondary" type="button" data-clear disabled>New chat</button></header>
          <div class="tutor-setup" data-setup ${config.offline ? "" : "hidden"}>
            <strong>Start the tutor on your computer</strong>
            <p data-setup-detail>Run <code>Start_AI_Tutor.bat</code> on Windows or <code>python3 tutor_server.py</code> on Mac or Linux. Enter your OpenAI API key in the terminal window.</p>
            <a class="text-link" href="${localUrl(day)}" data-local>Open local tutor →</a>
          </div>
          <div class="tutor-conversation" data-transcript tabindex="0" aria-label="Conversation">
            <div class="tutor-empty" data-empty><p>What would you like to understand?</p>
              <div class="tutor-starters">${starters.map(([label], i) =>
                `<button type="button" class="button secondary" data-starter="${i}" disabled>${label}</button>`).join("")}</div>
            </div>
            <div role="log" aria-label="Tutor messages" data-messages></div>
          </div>
          <form class="tutor-compose" data-compose aria-label="Ask the AI tutor" aria-describedby="tutor-sharing">
            <fieldset data-composer disabled>
              <label for="tutor-question">Your question</label>
              <textarea id="tutor-question" name="question" rows="3" maxlength="4000" aria-describedby="tutor-image-help tutor-feedback"
                placeholder="Example: Why does this inner loop still take O(n) total?"></textarea>
              <div class="tutor-attachments" data-attachments hidden></div>
              <div class="tutor-reference" data-reference hidden>
                <label><input type="checkbox" data-include-images checked> <span data-reference-label>Include previous images</span></label>
              </div>
              <div class="tutor-controls">
                <label class="button secondary tutor-file" for="tutor-images">Attach images<input class="sr-only" id="tutor-images" type="file"
                  multiple accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" aria-describedby="tutor-image-help"></label>
                <button type="submit" class="button primary" data-send>Send question →</button>
              </div>
              <p class="tutor-help" id="tutor-image-help">PNG, JPEG, or WebP. Up to 3 images, 5 MB each and 10 MB total. You can also paste or drop an image.</p>
            </fieldset>
            <p class="tutor-help" id="tutor-sharing">Sending shares your question, recent turns, lesson notes, and included images with OpenAI.</p>
            <p class="tutor-feedback" id="tutor-feedback" role="status" data-feedback></p>
          </form>
        </section>
        <aside class="tutor-aside">
          <section class="card tutor-context"><div class="eyebrow">LESSON CONTEXT</div>
            <label for="tutor-day">What are you studying?</label>
            <select id="tutor-day"><option value="0">General DSA question</option>${options.map(([value, label]) =>
              `<option value="${value}" ${value === day ? "selected" : ""}>${escape(label)}</option>`).join("")}</select>
            <a class="text-link" href="${day ? lessonUrl(day) : "#"}" data-lesson ${day ? "" : "hidden"}>Back to Day ${day} →</a>
          </section>
          <section class="card tutor-context"><h2>Before sending</h2>
            <p>Crop out private details before attaching a screenshot.</p>
            <p>Chat is held on this page. Your course progress is saved separately.</p>
          </section>
        </aside>
      </div></section>`;
  }

  function inlineMarkup(node, text) {
    const tokens = /(\x60[^\x60\n]+\x60|\*\*[^*\n]+\*\*)/g;
    let end = 0;
    for (const match of text.matchAll(tokens)) {
      node.append(text.slice(end, match.index));
      const chunk = match[0];
      node.append(chunk.startsWith("**") ? make("strong", "", chunk.slice(2, -2)) : make("code", "", chunk.slice(1, -1)));
      end = match.index + chunk.length;
    }
    node.append(text.slice(end));
    return node;
  }

  function answerMarkup(node, text) {
    const lines = text.replace(/\r\n/g, "\n").split("\n");
    const fence = /^\s*\x60{3}([\w+-]*)\s*$/;
    let list = null;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const codeMatch = fence.exec(line);
      if (codeMatch) {
        list = null;
        const code = [];
        while (++i < lines.length && !fence.test(lines[i])) code.push(lines[i]);
        const block = make("div", "code-block");
        const header = make("div", "code-header");
        const copy = make("button", "copy", "Copy code");
        copy.type = "button";
        copy.dataset.copy = "";
        header.append(make("span", "", codeMatch[1] || "Code"), copy);
        const pre = make("pre");
        pre.tabIndex = 0;
        pre.append(make("code", "", code.join("\n")));
        block.append(header, pre);
        node.append(block);
      } else if (/^\s*(?:[-*]|\d+[.)])\s+/.test(line)) {
        const ordered = /^\s*\d/.test(line);
        if (!list || list.localName !== (ordered ? "ol" : "ul")) {
          list = make(ordered ? "ol" : "ul");
          node.append(list);
        }
        list.append(inlineMarkup(make("li"), line.replace(/^\s*(?:[-*]|\d+[.)])\s+/, "")));
      } else {
        list = null;
        if (line.trim()) {
          const heading = /^#{1,6}\s+/.test(line);
          node.append(inlineMarkup(make(heading ? "h3" : "p"), line.replace(/^#{1,6}\s+/, "")));
        }
      }
    }
  }

  function dataUrl(attachment) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("An attachment could not be read. Choose it again."));
      reader.readAsDataURL(attachment.file);
    });
  }

  function attach(host, config) {
    const select = key => host.querySelector(key);
    const form = select("[data-compose]");
    const composer = select("[data-composer]");
    const conversation = select("[data-transcript]");
    const messages = select("[data-messages]");
    const empty = select("[data-empty]");
    const feedback = select("[data-feedback]");
    const question = select("#tutor-question");
    const fileInput = select("#tutor-images");
    const day = select("#tutor-day");
    const connection = select("[data-connection]");
    const setup = select("[data-setup]");
    const local = select("[data-local]");
    const back = select("[data-lesson]");
    const clear = select("[data-clear]");
    const send = select("[data-send]");
    const attachmentList = select("[data-attachments]");
    const referenceRow = select("[data-reference]");
    const includeImages = select("[data-include-images]");
    const starterButtons = [...host.querySelectorAll("[data-starter]")];
    const availability = new AbortController();
    let sending, connected = false, disposed = false;
    let draft = [], reference = [], turns = [];

    function say(message, error = false) {
      feedback.textContent = message;
      feedback.dataset.error = String(error);
    }

    function showConnection(ready, missingKey = false) {
      connected = ready;
      composer.disabled = !ready;
      starterButtons.forEach(button => { button.disabled = !ready; });
      setup.hidden = ready;
      connection.textContent = ready ? "Ready to send questions" : missingKey ? "API key required" : "Local setup required";
      local.hidden = missingKey;
      if (missingKey) {
        select("[data-setup-detail]").textContent = "Close the launcher and start it again. Enter an OpenAI API key with available API credit when prompted.";
      }
    }

    if (!config.offline) {
      const timeout = setTimeout(() => availability.abort(), 4500);
      fetch("api/tutor/status", {signal: availability.signal, cache: "no-store"})
        .then(response => {
          if (!response.ok) throw new Error("Tutor unavailable.");
          return response.json();
        })
        .then(status => { if (!disposed) showConnection(status.configured === true, status.configured === false); })
        .catch(() => { if (!disposed) showConnection(false); })
        .finally(() => clearTimeout(timeout));
    }

    day.addEventListener("change", () => {
      const number = Number(day.value);
      back.hidden = !number;
      back.href = number ? config.lessonUrl(number) : "#";
      back.textContent = "Back to Day " + number + " →";
      local.href = localUrl(number);
    });

    starterButtons.forEach(button => button.addEventListener("click", () => {
      question.value = starters[Number(button.dataset.starter)][1];
      question.focus();
    }));

    function updateAttachments() {
      attachmentList.replaceChildren();
      attachmentList.hidden = !draft.length;
      referenceRow.hidden = draft.length > 0 || !reference.length;
      select("[data-reference-label]").textContent = reference.length === 1
        ? "Include the previous image" : "Include the previous " + reference.length + " images";
      draft.forEach((attachment, index) => {
        const item = make("div", "tutor-attachment");
        const img = make("img");
        img.src = attachment.preview;
        img.alt = "";
        const remove = make("button", "button plain", "Remove");
        remove.type = "button";
        remove.setAttribute("aria-label", "Remove " + attachment.name);
        remove.addEventListener("click", () => {
          URL.revokeObjectURL(attachment.preview);
          draft.splice(index, 1);
          updateAttachments();
          fileInput.focus();
        });
        item.append(img, make("span", "", attachment.name), remove);
        attachmentList.append(item);
      });
    }

    function addFiles(files) {
      if (!connected || sending) return;
      const rejected = new Set();
      for (const original of files) {
        const type = original.type || imageTypes[original.name.split(".").at(-1).toLowerCase()];
        if (!Object.values(imageTypes).includes(type)) {
          rejected.add("Use PNG, JPEG, or WebP.");
        } else if (!original.size || original.size > imageLimit) {
          rejected.add("Each image must be 5 MB or smaller.");
        } else if (draft.length >= 3 || draft.reduce((total, item) => total + item.file.size, original.size) > totalLimit) {
          rejected.add("Attach up to 3 images and 10 MB total.");
        } else {
          const file = original.type === type ? original : new Blob([original], {type});
          draft.push({file, name: original.name || "Pasted image", preview: URL.createObjectURL(file)});
        }
      }
      updateAttachments();
      if (rejected.size) say([...rejected].join(" "), true);
      else say(draft.length + (draft.length === 1 ? " image attached." : " images attached."));
    }

    fileInput.addEventListener("change", () => {
      addFiles(fileInput.files);
      fileInput.value = "";
    });
    question.addEventListener("paste", event => {
      const pictures = [...(event.clipboardData?.files || [])].filter(file => file.type.startsWith("image/"));
      if (pictures.length) { event.preventDefault(); addFiles(pictures); }
    });
    form.addEventListener("dragover", event => {
      if ([...(event.dataTransfer?.types || [])].includes("Files")) event.preventDefault();
    });
    form.addEventListener("drop", event => {
      if (!event.dataTransfer?.files.length) return;
      event.preventDefault();
      addFiles(event.dataTransfer.files);
    });
    question.addEventListener("input", () => question.removeAttribute("aria-invalid"));

    function addMessage(role, text, attachments = [], incomplete = false) {
      const bubble = make("article", "tutor-message " + role);
      bubble.append(make("strong", "tutor-speaker", role === "user" ? "You" : "AI Tutor"));
      const body = make("div", "tutor-message-body");
      if (role === "assistant") answerMarkup(body, text);
      else body.append(make("p", "tutor-user-text", text));
      if (incomplete) body.append(make("p", "tutor-help", "The answer reached its length limit. Ask a follow-up to continue."));
      if (attachments.length) {
        const previews = make("div", "tutor-message-images");
        attachments.forEach(attachment => {
          const image = make("img");
          image.src = attachment.preview;
          image.alt = attachment.name;
          previews.append(image);
        });
        body.append(previews);
      }
      bubble.append(body);
      messages.append(bubble);
      if (role === "user") conversation.scrollTop = conversation.scrollHeight;
      else conversation.scrollTop += bubble.getBoundingClientRect().top - conversation.getBoundingClientRect().top - 12;
      return bubble;
    }

    function reset() {
      if (sending) return;
      [...draft, ...turns.flatMap(turn => turn.attachments || [])].forEach(item => URL.revokeObjectURL(item.preview));
      turns = [];
      draft = [];
      reference = [];
      includeImages.checked = true;
      question.value = "";
      question.removeAttribute("aria-invalid");
      updateAttachments();
      messages.replaceChildren();
      empty.hidden = false;
      clear.disabled = true;
      say("New chat started.");
      question.focus();
    }
    clear.addEventListener("click", reset);

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!connected || sending) return;
      const text = question.value.trim();
      const newImages = draft.slice();
      if (!text && !newImages.length) {
        question.setAttribute("aria-invalid", "true");
        say("Write a question or attach an image.", true);
        question.focus();
        return;
      }
      question.removeAttribute("aria-invalid");
      const priorImages = !newImages.length && includeImages.checked && reference.length > 0;
      const pictures = priorImages ? reference : newImages;
      const controller = new AbortController();
      sending = controller;
      const timeout = setTimeout(() => controller.abort(), 75000);
      const history = turns.slice(-12).map(turn => ({role: turn.role, text: turn.text.slice(0, 8000)}));
      empty.hidden = true;
      const visibleQuestion = text || "Help me understand the attached image.";
      const pending = addMessage("user", visibleQuestion, newImages);
      composer.disabled = true;
      clear.disabled = true;
      day.disabled = true;
      send.textContent = "Waiting for reply…";
      say("The tutor is working on your question.");
      try {
        const images = await Promise.all(pictures.map(dataUrl));
        const response = await fetch("api/tutor", {
          method: "POST", headers: {"Content-Type": "application/json"}, signal: controller.signal,
          body: JSON.stringify({day: Number(day.value), question: text, history, images, prior_images: priorImages}),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || typeof result.reply !== "string" || !result.reply) {
          throw new Error(result.error || "The tutor connection was interrupted. Try sending your question again.");
        }
        if (disposed) return;
        turns.push({role: "user", text: visibleQuestion, attachments: newImages});
        turns.push({role: "assistant", text: result.reply});
        addMessage("assistant", result.reply, [], result.incomplete === true);
        if (newImages.length) {
          reference = newImages;
          includeImages.checked = true;
        }
        draft = [];
        question.value = "";
        updateAttachments();
        say("Reply received.");
      } catch (error) {
        if (disposed) return;
        pending.remove();
        empty.hidden = turns.length > 0;
        say(error.name === "AbortError" ? "The tutor took too long. Your question is ready to retry."
          : error instanceof TypeError ? "Could not reach the local tutor. Keep the launcher open and try again."
            : error.message, true);
      } finally {
        clearTimeout(timeout);
        sending = null;
        if (!disposed) {
          composer.disabled = false;
          day.disabled = false;
          clear.disabled = !turns.length;
          send.textContent = "Send question →";
          if (document.activeElement === document.body) question.focus({preventScroll: true});
        }
      }
    });

    return () => {
      disposed = true;
      availability.abort();
      sending?.abort();
      [...draft, ...turns.flatMap(turn => turn.attachments || [])].forEach(item => URL.revokeObjectURL(item.preview));
    };
  }

  return {page, attach};
})();

