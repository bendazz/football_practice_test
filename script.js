// Practice Test - Frontend only
// No frameworks, small footprint, accessible.

/**
 * Contract
 * - questions: array of { id, prompt (string|HTML), solution (string|HTML), tags?: string[] }
 * - Renders ALL questions stacked with individual Reveal Solution toggles.
 * - No persistence by default (no localStorage), but easy to add later.
 */

const state = {
  // Track which questions are revealed by id
  revealedById: new Set(),
};

/**
 * Starter questions. We'll replace/extend this together.
 * For now, include a single placeholder so the UI is visible.
 */
const questions = [
  {
    id: "q1",
    prompt: `What is the name of the database engine we've been using?`,
    solution: `SQLite`,
  },
  {
    id: "q2",
    prompt: `What are the three extensions we have been using in our codespaces?`,
    solution: `GitHub Copilot, Live Server, and SQLite`,
  },
  {
    id: "q3",
    prompt: `What is the name of the website we have been using to store the code for our projects?`,
    solution: `GitHub`,
  },
  {
    id: "q4",
    prompt: `When you've made changes to your code, you push these changes to a __________.`,
    solution: `Repository`,
  },
  {
    id: "q5",
    prompt: `When developing a website with the help of GitHub Copilot, we usually first give instructions about the structure of the app. List as many of these instructions as you can.`,
    solution: `
      <ul>
        <li>front-end only</li>
        <li>no frameworks</li>
        <li>javascript</li>
        <li>index.html in the root directory</li>
      </ul>
    `,
  },
  {
    id: "q6",
    prompt: `Suppose you have loaded a file called football.csv into your codespace. You now would like to create a database with this file forming the only table. Write a sample prompt that would get this done.`,
    solution: `
      <blockquote>
        I have just uploaded a file named <strong>football.csv</strong>. I would like to create an <strong>SQLite</strong> database with this as the only table. I want to make sure that numeric data is imported correctly. Perhaps <strong>Pandas</strong> would be helpful with this. Could you do this for me?
      </blockquote>
    `,
  },
  {
    id: "q7",
    prompt: `Suppose you have a database with one table called "roster". Write an SQL query that would select everything from this table.`,
    solution: `
      <pre><code>select *
from roster;</code></pre>
    `,
  },
];

function $(sel, root = document) {
  return root.querySelector(sel);
}

function createEl(tag, opts = {}) {
  const el = document.createElement(tag);
  if (opts.className) el.className = opts.className;
  if (opts.text) el.textContent = opts.text;
  if (opts.html) el.innerHTML = opts.html;
  if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";

  if (!questions.length) {
    app.append(
      createEl("div", { className: "card", html: `<div class='card-body'>No questions yet. Please add some in script.js.</div>` })
    );
    return;
  }

  questions.forEach((q, i) => {
    const card = createEl("section", { className: "card", attrs: { role: "region", "aria-labelledby": `q-${q.id}` } });

    const header = createEl("div", { className: "card-header" });
    const title = createEl("div", { className: "meta" });
    title.append(
      createEl("span", { className: "chip", text: `Question ${i + 1}` })
    );
    header.appendChild(title);

    const body = createEl("div", { className: "card-body" });
    const promptEl = createEl("div", { className: "question-text", html: q.prompt, attrs: { id: `q-${q.id}` } });
    body.appendChild(promptEl);

    const controls = createEl("div", { className: "controls" });
    const isRevealed = state.revealedById.has(q.id);
    const revealBtn = createEl("button", {
      className: "primary",
      text: isRevealed ? "Hide solution" : "Reveal solution",
      attrs: { "aria-expanded": String(isRevealed), "aria-controls": `sol-${q.id}`, "data-qid": q.id },
    });
    revealBtn.addEventListener("click", () => {
      if (state.revealedById.has(q.id)) {
        state.revealedById.delete(q.id);
      } else {
        state.revealedById.add(q.id);
      }
      render();
      // Restore focus to the toggled question's button for accessibility
      setTimeout(() => {
        const btn = document.querySelector(`button[data-qid="${q.id}"]`);
        if (btn) btn.focus();
      }, 0);
    });
    controls.appendChild(revealBtn);

    const solution = createEl("div", {
      className: `solution ${isRevealed ? "" : "hidden"}`.trim(),
      html: q.solution,
      attrs: { id: `sol-${q.id}` },
    });

    body.appendChild(controls);
    body.appendChild(solution);

    card.append(header, body);
    app.appendChild(card);
  });
}

window.addEventListener("DOMContentLoaded", render);

// Export minimal API for future enhancements (optional)
window.practiceTest = {
  addQuestion(q) {
    questions.push(q);
    render();
  },
  setQuestions(qs) {
    questions.splice(0, questions.length, ...qs);
    state.revealedById.clear();
    render();
  },
  revealAll() {
    questions.forEach(q => state.revealedById.add(q.id));
    render();
  },
  hideAll() {
    state.revealedById.clear();
    render();
  },
  get state() { return { revealed: Array.from(state.revealedById) }; },
};
