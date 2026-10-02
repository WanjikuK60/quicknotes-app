let notes = [];

const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

const storageKey = "quicknotes-notes";
const categories = ["personal", "work", "study"];

function loadNotes() {
  try {
    const savedNotes = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(savedNotes)) {
      return [];
    }

    return savedNotes.filter((note) =>
      note &&
      typeof note.id === "string" &&
      typeof note.text === "string" &&
      categories.includes(note.category) &&
      typeof note.createdAt === "string",
    );
  } catch {
    return [];
  }
}

function saveNotes() {
  localStorage.setItem(storageKey, JSON.stringify(notes));
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
  category.textContent = note.category[0].toUpperCase() + note.category.slice(1);

  const date = document.createElement("p");
  date.classList.add("note-date");
  date.textContent = note.createdAt;

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");
  deleteButton.type = "button";
  deleteButton.dataset.id = note.id;
  deleteButton.textContent = "Delete";

  details.append(category, date);
  meta.append(details, deleteButton);
  item.append(text, meta);
  return item;
}

function render() {
  notesList.replaceChildren();
  const searchWords = searchInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const visibleNotes = notes.filter((note) => {
    const noteText = note.text.toLowerCase();
    return searchWords.every((word) => noteText.includes(word));
  });

  if (searchWords.length > 0 && visibleNotes.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.classList.add("empty-message");
    emptyMessage.textContent = "No notes match your search.";
    notesList.append(emptyMessage);
  }

  for (const note of visibleNotes) {
    notesList.append(createNoteCard(note));
  }
  updateCount();
}

function updateCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = noteInput.value.trim();
  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }
  if (noteInput.value.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = "";
  const note = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    text,
    category: noteCategory.value,
    createdAt: new Date().toLocaleString(),
  };

  notes.unshift(note);
  saveNotes();
  render();
  noteInput.value = "";
});

notesList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-button");
  if (!deleteButton) {
    return;
  }

  notes = notes.filter((note) => note.id !== deleteButton.dataset.id);
  saveNotes();
  render();
});

searchInput.addEventListener("input", render);

notes = loadNotes();
render();
