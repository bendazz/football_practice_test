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
  {
    id: "q8",
    prompt: `What does it mean if a team's win probability is 1?`,
    solution: `It means they have won the game.`,
  },
  {
    id: "q9",
    prompt: `Suppose you have the team information table in your database. The table is named teams. Write a query that returns one column of the team abbreviations:`,
    solution: `
      <pre><code>select team_abbr
from teams;</code></pre>
    `,
  },
  {
    id: "q10",
    prompt: `Suppose you have the team information table in your database. The table is named teams. Write a query that returns two columns, where the first is the team abbreviation and the second is the team division.`,
    solution: `
      <pre><code>select team_abbr, team_division
from teams;</code></pre>
    `,
  },
  {
    id: "q11",
    prompt: `Question 11. Suppose you have the team information table in your database. The table is named teams. Write a query that returns one column that lists only the team abbreviations from the NFC East.`,
    solution: `
      <pre><code>select team_abbr
from teams
where team_division = 'NFC East';</code></pre>
    `,
  },
  {
    id: "q12",
    prompt: `Suppose you have the eagles roster as a table in your database. The table is named roster. Write a query that returns one column of the players' names, ordered alphabetically, with no duplicates.`,
    solution: `
      <p>There are two possibilities.</p>
      <p>Using GROUP BY:</p>
      <pre><code>select player_name
from roster
group by player_name
order by player_name;</code></pre>
      <p>Or using DISTINCT:</p>
      <pre><code>select distinct player_name
from roster
order by player_name;</code></pre>
    `,
  },
  {
    id: "q13",
    prompt: `Suppose you have the eagles roster as a table in your database. The table is named roster. Write a query that returns just one number, which is how many records there are in the table.`,
    solution: `
      <pre><code>select count(*)
from roster;</code></pre>
    `,
  },
  {
    id: "q14",
    prompt: `Suppose you have the eagles play-by-play data as a table in your database. The table is named plays. Write a query that returns two columns, where the first column is the week and the second column is the total air yards achieved by J.Hurts that week.`,
    solution: `
      <pre><code>select week, sum(air_yards)
from plays
where passer_player_name = 'J.Hurts'
group by week;</code></pre>
    `,
  },
  {
    id: "q15",
    prompt: `Suppose you have the eagles play-by-play data as a table in your database. The table is named plays. You also have the teams information table in your database. This table is named teams. Write a query that returns three columns: the week, the FULL name of the possession team, and the number of seconds remaining in the game.`,
    solution: `
      <pre><code>select p.week, t.team_name, p.game_seconds_remaining
from plays p
inner join teams t
  on p.posteam = t.team_abbr;</code></pre>
    `,
  },
  {
    id: "q16",
    prompt: `Suppose you have the eagles play-by-play data as a table in your database. The table is named eagles. Write a query that returns two columns: the play_id and the number of MINUTES ELAPSED in the game, all for just week 1.`,
    solution: `
      <pre><code>select play_id, 60 - game_seconds_remaining/60
from eagles
where week = 1;</code></pre>
    `,
  },
  {
    id: "q17",
    prompt: `Explain what the following query returns. Be as precise as you can:
<pre><code>WITH weekly AS (
  SELECT
    week,
    SUM(air_yards) AS weekly_air_yards
  FROM eagles
  WHERE passer_player_name = 'J.Hurts'
  GROUP BY week
)
SELECT
  week,
  SUM(weekly_air_yards) OVER (
    ORDER BY week
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cum_air_yards
FROM weekly
ORDER BY week;</code></pre>`,
    solution: `This returns two columns where one is the week and the other is Jalen Hurts accumulated air_yards up to and including that week.`,
  },
  {
    id: "q18",
    prompt: `Suppose you have the eagles play-by-play data in your database and the table is named eagles. Write a query that returns just one number: the largest number of air-yards achieved by Jalen Hurts all season.`,
    solution: `
      <pre><code>select max(air_yards)
from eagles
where passer_player_name = 'J.Hurts';</code></pre>
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
