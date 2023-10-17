import React, { useState, useContext, createContext } from 'react';
import './App.css';

const LibraryContext = createContext();

function App() {
  const [libraries, setLibraries] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);

  return (
    <LibraryContext.Provider value={{ libraries, setLibraries, selectedLibrary, setSelectedLibrary }}>
      <div className="App">
        <header>LibroVault</header>
        <div className="content">
          <LibraryList />
          {selectedLibrary && <Books />}
        </div>
      </div>
    </LibraryContext.Provider>
  );
}

function LibraryList() {
  const { libraries, setLibraries, setSelectedLibrary } = useContext(LibraryContext);

  const addLibrary = (name) => {
    const newLibrary = { name, books: [] };
    setLibraries([...libraries, newLibrary]);
  };

  return (
    <div className="sidebar">
      {libraries.map((library, index) => (
        <button key={index} onClick={() => setSelectedLibrary(library)}>
          {library.name}
        </button>
      ))}
      <button onClick={() => {
        const name = prompt("Enter library name");
        if (name) addLibrary(name);
      }}>
        + Add Library
      </button>
    </div>
  );
}


function Books() {
  const { libraries, setLibraries, selectedLibrary } = useContext(LibraryContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [genre, setGenre] = useState('');
  const [edit, setEdit] = useState(null);

  const addBook = (book) => {
    const updatedLibraries = libraries.map(lib => {
      if (lib === selectedLibrary) {
        lib.books.push(book);
      }
      return lib;
    });
    setLibraries(updatedLibraries);
  };

  const editBook = (editedBook) => {
    const updatedLibraries = libraries.map(lib => {
      if (lib === selectedLibrary) {
        lib.books = lib.books.map(book => {
          if (book === edit) {
            return editedBook;
          }
          return book;
        });
      }
      return lib;
    });
    setLibraries(updatedLibraries);
    setEdit(null);
  };


  const deleteBook = (book) => {
    const updatedLibraries = libraries.map(lib => {
      if (lib === selectedLibrary) {
        const index = lib.books.findIndex(b => b === book);
        if (index !== -1) {
          lib.books.splice(index, 1);
        }
      }
      return lib;
    });
    setLibraries(updatedLibraries);
    setEdit(null);
  };

  const editButton = (book) => {
    setEdit(book);
    setTitle(book.title);
    setAuthor(book.author);
    setPublicationDate(book.publicationDate);
    setGenre(book.genre);
  };

  const searchedBooks = selectedLibrary.books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="books">
      <h2>{selectedLibrary.name}</h2>
      <input type="text" placeholder="Search for a book..." onChange={e => setSearchTerm(e.target.value)} />

      {searchedBooks.map((book, index) => (
        <div key={index}>
          <h4>{book.title}</h4>
          <p>{book.author}</p>
          <p>{book.publicationDate}</p>
          <p>{book.genre}</p>
          <button onClick={() => deleteBook(book)}>Delete book</button>
          <button onClick={() => editButton(book)}>Edit book</button>
        </div>
      ))}

      <div>
        <input type="text" placeholder="Book Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
        <input type="text" placeholder="Publication Date" value={publicationDate} onChange={e => setPublicationDate(e.target.value)} />
        <input type="text" placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
        {edit ? (
          <button onClick={() => editBook({ title, author, publicationDate, genre })}>
            Save Edits
          </button>
        ) : (
          <button onClick={() => {
            if (title && author) {
              addBook({ title, author, publicationDate, genre });
              setTitle('');
              setAuthor('');
              setPublicationDate('');
              setGenre('');
            }
          }}>
            + Add Book
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
