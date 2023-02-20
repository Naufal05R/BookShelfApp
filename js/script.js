const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

window.addEventListener('DOMContentLoaded', () => {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', () => {
    event.preventDefault();
    addBook();
    resetForm();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function resetForm() {
  const inputForm = document.querySelectorAll('.form-group input');
  const checkForm = document.querySelector('.form-check input');

  for (item in inputForm) {
    inputForm[item].value = '';
  }

  checkForm.checked = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBook() {
  const booksTitle = document.getElementById('title').value;
  const booksAuthor = document.getElementById('author').value;
  const publicationYear = document.getElementById('year').value;
  const isRead = document.getElementById('read').checked;
 
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, booksTitle, booksAuthor, publicationYear, isRead);
  books.push(bookObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}
 
function generateBookObject(id, title, author, year, isRead) {
  return {
    id,
    title,
    author,
    year,
    isRead
  }
}

document.addEventListener(RENDER_EVENT, function () {
  const unreadBookList = document.getElementById('books');
  unreadBookList.innerHTML = '';

  const readBookList = document.getElementById('completed-books');
  readBookList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = displayBook(bookItem);
    if (!bookItem.isRead) 
      unreadBookList.append(bookElement);
    else 
      readBookList.append(bookElement);
  }
});

function displayBook(bookObject) {
  const booksTitle = document.createElement('h2');
  booksTitle.innerText = bookObject.title;

  const booksAuthor = document.createElement('h3');
  booksAuthor.innerText = bookObject.author;

  const publicationYear = document.createElement('p');
  publicationYear.innerText = bookObject.year;

  const bookContainer = document.createElement('div');
  bookContainer.classList.add('inner');
  bookContainer.append(booksTitle, booksAuthor, publicationYear);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(bookContainer);
  container.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isRead) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');

    undoButton.addEventListener('click', () => {
      undoBookFromRead(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');

    trashButton.addEventListener('click', () => {
      removeBookFromRead(bookObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');

    checkButton.addEventListener('click', () => {
      addBookToRead(bookObject.id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');

    trashButton.addEventListener('click', () => {
      removeBookFromRead(bookObject.id);
    });

    container.append(checkButton, trashButton);
  }

  
  return container;
}

function addBookToRead (bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isRead = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}


function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) 
    return bookItem;
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  
  return -1;
}

function removeBookFromRead(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromRead(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isRead = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, () => {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  } 

  document.dispatchEvent(new Event(RENDER_EVENT));
}
