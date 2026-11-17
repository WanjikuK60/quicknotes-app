# QuickNotes

QuickNotes is a lightweight note-taking app for capturing personal, work, and study thoughts in one place. Notes can be searched, removed, and kept between visits using the browser's local storage.

**Live site:** https://wanjikuk60.github.io/quicknotes-app/

## Features

- Add notes to Personal, Work, or Study categories
- Validate required text and the 200-character limit, with a live character counter
- Search note text without case sensitivity, with a "Showing X of Y" count
- View each note's category and creation date, shown in your own date format
- Delete notes individually
- Save notes in local storage so they remain after a refresh, with a clear message if the browser refuses to save
- Use it fully by keyboard and screen reader: labelled delete buttons, focus kept in place after adding or deleting

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern web browser.
3. Add and search notes. Your notes are stored in that browser on that device.

No build step or dependency installation is required.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Page structure: the add-note form and the notes list |
| `style.css` | Layout, colours and the mobile layout below 600px |
| `script.js` | Adding, validating, searching, deleting and saving notes |
| `favicon.svg` | Browser tab icon |

## What I learned

- Semantic HTML forms make labels and controls clearer to both people and assistive technology.
- Creating elements with `createElement` and assigning `textContent` safely displays user-entered text.
- Arrays of note objects make it practical to add, render, search, and delete records.
- JSON and local storage can preserve structured data between page visits.
