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

function AddBookPopup({ onConfirm, onCancel }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [translator, setTranslator] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [edition, setEdition] = useState('');
  const [volumeNumber, setVolumeNumber] = useState('');
  const [genre, setGenre] = useState('');
  const [subgenre, setSubgenre] = useState('');
  const [isbn, setIsbn] = useState('');

  const handleConfirm = () => {
    onConfirm({ title, author, translator, publicationDate, edition, volumeNumber, genre, subgenre, isbn });
    onCancel();
  };

  return (
    <div className="popup">
      <input type="text" placeholder="Book Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
      <input type="text" placeholder="Translator" value={translator} onChange={e => setTranslator(e.target.value)} />
      <input type="text" placeholder="Publication Date" value={publicationDate} onChange={e => setPublicationDate(e.target.value)} />
      <input type="text" placeholder="Edition" value={edition} onChange={e => setEdition(e.target.value)} />
      <input type="text" placeholder="Volume Number" value={volumeNumber} onChange={e => setVolumeNumber(e.target.value)} />
      <input type="text" placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
      <input type="text" placeholder="Sub-genre" value={subgenre} onChange={e => setSubgenre(e.target.value)} />
      <input type="text" placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} />
      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
}

function Books() {
  const { libraries, setLibraries, selectedLibrary } = useContext(LibraryContext);
  const [showAddBookPopup, setShowAddBookPopup] = useState(false);

  const addBook = (book) => {
    const updatedLibraries = libraries.map((lib) => {
      if (lib === selectedLibrary) {
        return { ...lib, books: [...lib.books, book] };
      }
      return lib;
    });

    setLibraries(updatedLibraries);
  };

  return (
    <div className="books">
      <h2>{selectedLibrary.name}</h2>
      <button onClick={() => setShowAddBookPopup(true)}>Add Book</button>
      
      {showAddBookPopup && (
        <AddBookPopup
          onConfirm={(book) => addBook(book)}
          onCancel={() => setShowAddBookPopup(false)}
        />
      )}

      <div className="book-list">
        {selectedLibrary.books.map((book, index) => (
          <div key={index}>
            <div>{book.title} by {book.author}</div>
            <div>{book.translator}</div>
            <div>{book.publicationDate}</div>
            <div>{book.edition}</div>
            <div>{book.volumeNumber}</div>
            <div>{book.genre}</div>
            <div>{book.subgenre}</div>
            <div>{book.isbn}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
