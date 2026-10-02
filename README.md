# QuickNotes

QuickNotes is a lightweight note-taking app for capturing personal, work, and study thoughts in one place. Notes can be searched, removed, and kept between visits using the browser's local storage.

## Features

- Add notes to Personal, Work, or Study categories
- Validate required text and the 200-character limit
- Search note text without case sensitivity
- View each note's category and creation date
- Delete notes individually
- Save notes in local storage so they remain after a refresh
- See the total note count update as notes are added or removed

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern web browser.
3. Add and search notes. Your notes are stored in that browser on that device.

No build step or dependency installation is required.

## What I learned

- Semantic HTML forms make labels and controls clearer to both people and assistive technology.
- Creating elements with `createElement` and assigning `textContent` safely displays user-entered text.
- Arrays of note objects make it practical to add, render, search, and delete records.
- JSON and local storage can preserve structured data between page visits.
