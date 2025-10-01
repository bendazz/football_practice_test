# Practice Test (Frontend-only)

Lightweight web app for student practice tests. No backend, no frameworks. Students can reveal solutions without submitting answers.

## Quick start

1. Open `index.html` in a browser.
2. You'll see questions stacked on the page. Use each question's Reveal button to show/hide the solution.

## Add your first question

Edit `script.js` and replace the placeholder entry in the `questions` array, or use the runtime API from the DevTools console.

Option A — edit the file:

- Open `script.js` and find:

	const questions = [
		{ id: "placeholder-1", prompt: "...", solution: "...", tags: ["example"] }
	];

- Replace with something like:

	const questions = [
		{
			id: "q1",
			prompt: "What is 2 + 2?",
			solution: "4",
			tags: ["math", "warmup"],
		},
	];

Option B — add at runtime in the console:

- Open DevTools and run:

	window.practiceTest.addQuestion({
		id: "q1",
		prompt: "What is 2 + 2?",
		solution: "4",
		tags: ["math"],
	});

## Interaction

- Reveal/Hide toggles the solution for that question.
- All questions appear at once; scroll to move through the exam.
- Optional (DevTools): `window.practiceTest.revealAll()` or `window.practiceTest.hideAll()`.

## Notes

- This is frontend-only. No data is stored or sent anywhere.
- You can include simple HTML in `prompt` and `solution` if you need lists, code, or images.