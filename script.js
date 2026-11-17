const MAX_LENGTH = 200;
const STORAGE_KEY = "quicknotes-notes";
const CATEGORIES = ["personal", "work", "study"];

const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const charCount = document.querySelector("#char-count");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

let notes = [];

function loadNotes() {
  try {
    const savedNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(savedNotes)) {
      return [];
    }

    return savedNotes.filter(
      (note) =>
        note &&
        typeof note.id === "string" &&
        typeof note.text === "string" &&
        CATEGORIES.includes(note.category) &&
        typeof note.createdAt === "string",
    );
  } catch {
    return [];
  }
}

// Returns false if the browser refused to save (storage full or blocked).
function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch {
    return false;
  }
}

// New notes store an ISO date; notes saved by older versions store
// already-formatted text, which is shown as it is.
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T/;

function formatDate(createdAt) {
  return ISO_DATE.test(createdAt) ? new Date(createdAt).toLocaleString() : createdAt;
}

function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function createNoteCard(note) {
  const item = document.createElement("li");
  item.classList.add("note-card", `category-${note.category}`);

  const text = document.createElement("p");
  text.classList.add("note-content");
  text.textContent = note.text;

  const meta = document.createElement("div");
  meta.classList.add("note-meta");

  const details = document.createElement("div");
  const category = document.createElement("p");
  category.classList.add("category-label");
  category.textContent = capitalize(note.category);

  const date = document.createElement("time");
  date.classList.add("note-date");
  date.textContent = formatDate(note.createdAt);
  if (ISO_DATE.test(note.createdAt)) {
    date.dateTime = note.createdAt;
  }

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.type = "button";
  deleteButton.dataset.id = note.id;
  deleteButton.textContent = "Delete";
  // Every card has a "Delete" button, so say which note it removes.
  const preview = note.text.length > 40 ? `${note.text.slice(0, 40)}…` : note.text;
  deleteButton.setAttribute("aria-label", `Delete note: ${preview}`);

  details.append(category, date);
  meta.append(details, deleteButton);
  item.append(text, meta);
  return item;
}

function getSearchWords() {
  return searchInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function render() {
  const searchWords = getSearchWords();
  const visibleNotes = notes.filter((note) => {
    const noteText = note.text.toLowerCase();
    return searchWords.every((word) => noteText.includes(word));
  });

  notesList.replaceChildren();
  if (searchWords.length > 0 && visibleNotes.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.classList.add("empty-message");
    emptyMessage.textContent = "No notes match your search.";
    notesList.append(emptyMessage);
  }

  for (const note of visibleNotes) {
    notesList.append(createNoteCard(note));
  }
  updateCount(visibleNotes.length, searchWords.length > 0);
}

function updateCount(visible, searching) {
  const total = notes.length;
  if (total === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (searching) {
    noteCount.textContent = `Showing ${visible} of ${total} ${total === 1 ? "note" : "notes"}.`;
  } else {
    noteCount.textContent = `You have ${total} ${total === 1 ? "note" : "notes"}.`;
  }
}

function updateCharCount() {
  const length = noteInput.value.trim().length;
  charCount.textContent = `${length} / ${MAX_LENGTH}`;
  charCount.classList.toggle("over-limit", length > MAX_LENGTH);
}

function showError(message) {
  errorMessage.textContent = message;
  noteInput.setAttribute("aria-invalid", "true");
  noteInput.focus();
}

function clearError() {
  errorMessage.textContent = "";
  noteInput.removeAttribute("aria-invalid");
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = noteInput.value.trim();
  if (text === "") {
    showError("Please type a note first.");
    return;
  }
  if (text.length > MAX_LENGTH) {
    showError(`Notes must be ${MAX_LENGTH} characters or fewer.`);
    return;
  }

  const note = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text,
    category: noteCategory.value,
    createdAt: new Date().toISOString(),
  };

  notes.unshift(note);
  if (!saveNotes()) {
    notes.shift();
    showError("Your browser couldn't save the note. Storage may be full or turned off.");
    return;
  }

  clearError();
  noteInput.value = "";
  updateCharCount();
  render();
  noteInput.focus();
});

noteInput.addEventListener("input", () => {
  updateCharCount();
  if (errorMessage.textContent) {
    clearError();
  }
});

notesList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-button");
  if (!deleteButton) {
    return;
  }

  notes = notes.filter((note) => note.id !== deleteButton.dataset.id);
  saveNotes();
  render();
  // The clicked button is gone, so keep keyboard users in the list.
  (notesList.querySelector(".delete-button") || searchInput).focus();
});

searchInput.addEventListener("input", render);

notes = loadNotes();
updateCharCount();
render();
