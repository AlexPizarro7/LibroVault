import React, { useState, useContext, createContext } from 'react';
import '../App.css';


//This context allows child components to access and modify the app's state
const LibraryContext = createContext();

//This is the App component, the main component
//uses UseStat eo create 2 state variables: libraries (list of libraries) and selectedLibrary(the currently selected library)

//libraryContext.Provider wraps the child components, so they can access the defined values of the values

function MainApplication() {
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

//This is the LibraryList component, this is the sidebar that has the list of libraries.
//This component uses 'useContext' to access 'LibraryContext' and be able to use its functions 
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

//This is the Books Component 
//This is the main area content that displays the information and details of each book in a library

//This component defines the following functions: changeLibraryName, deleteLibrary, addBook, deleteBook, editButton, editBook, resetFields

//This also has the algorithms to search books and sort them
function Books() {
  const { libraries, setLibraries, selectedLibrary, setSelectedLibrary } = useContext(LibraryContext);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [translator, setTranslator] = useState('');
  const [publicationDate, setPublicationDate] = useState('');
  const [edition, setEdition] = useState('');
  const [volumeNumber, setVolumeNumber] = useState('');
  const [genre, setGenre] = useState('');
  const [subgenre, setSubgenre] = useState('');
  const [isbn, setIsbn] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [edit, setEdit] = useState(null);
  const [sortMethod, setSortMethod] = useState('default');

  const changeLibraryName = (newName) => {
    const updatedLibraries = libraries.map(lib => {
      if (lib === selectedLibrary) {
        lib.name = newName;
      }
      return lib;
    });
    setLibraries(updatedLibraries);
  };

  const deleteLibrary = () => {
    const updatedLibraries = libraries.filter(lib => lib !== selectedLibrary);
    setLibraries(updatedLibraries);
    setSelectedLibrary(null);
  };

  const addBook = (book) => {
    if (!book.title || !book.author || !book.genre) {
      alert('Please complete the Title, Author, and Genre fields to add the book.');
      return;
    }
    const updatedLibraries = libraries.map(lib => {
      if (lib === selectedLibrary) {
        lib.books.push(book);
      }
      return lib;
    });
    setLibraries(updatedLibraries);
    resetFields();
  };

  const deleteBook = (bookToDelete) => {
    const updatedLibraries = libraries.map(lib => {
      if (lib === selectedLibrary) {
        lib.books = lib.books.filter(book => book !== bookToDelete);
      }
      return lib;
    });
    setLibraries(updatedLibraries);
  };

  const editButton = (book) => {
    setTitle(book.title);
    setAuthor(book.author);
    setTranslator(book.translator);
    setPublicationDate(book.publicationDate);
    setEdition(book.edition);
    setVolumeNumber(book.volumeNumber);
    setGenre(book.genre);
    setSubgenre(book.subgenre);
    setIsbn(book.isbn);
    setEdit(book);
  };

  const editBook = (editedBook) => {
    if (!editedBook.title || !editedBook.author || !editedBook.genre) {
      alert('Please complete the Title, Author, and Genre fields to edit the book.');
      return;
    }
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
    resetFields();
  };

  const resetFields = () => {
    setTitle('');
    setAuthor('');
    setPublicationDate('');
    setGenre('');
    setTranslator('');
    setEdition('');
    setVolumeNumber('');
    setSubgenre('');
    setIsbn('');
    setEdit(null);
  };

  let searchedBooks = selectedLibrary.books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (sortMethod === 'alphabetical') {
    searchedBooks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortMethod === 'byAuthor') {
    searchedBooks.sort((a, b) => a.author.localeCompare(b.author));
  } else if (sortMethod === 'byGenre') {
    searchedBooks.sort((a, b) => a.genre.localeCompare(b.genre));
  }

  return (
    <div className="books">
      <h2>{selectedLibrary.name}</h2>
      <button onClick={() => {
        const newName = prompt("Edit library name");
        if (newName) changeLibraryName(newName);
      }}>
        Edit Library Name
      </button>
      <button onClick={deleteLibrary}>Delete Library</button>
      <input type="text" placeholder="Search for a book..." onChange={e => setSearchTerm(e.target.value)} />

      <select value={sortMethod} onChange={(e) => setSortMethod(e.target.value)}>
        <option value="default">Default Order</option>
        <option value="alphabetical">Sort Alphabetically By Title</option>
        <option value="byAuthor">Sort Alphabetically By Author</option>
        <option value="byGenre">Group By Genre</option>
      </select>

      {searchedBooks.map((book, index) => (
        <div key={index}>
          <h4>{book.title}</h4>
          <p>{book.author}</p>
          <p>{book.translator}</p>
          <p>{book.publicationDate}</p>
          <p>{book.edition}</p>
          <p>{book.volumeNumber}</p>
          <p>{book.genre}</p>
          <p>{book.subgenre}</p>
          <p>{book.isbn}</p>
          <button onClick={() => deleteBook(book)}>Delete book</button>
          <button onClick={() => editButton(book)}>Edit book</button>
        </div>
      ))}

      <div>
        <input type="text" placeholder="Book Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} />
        <input type="text" placeholder="Translator" value={translator} onChange={e => setTranslator(e.target.value)} />
        <input type="text" placeholder="Publication Date" value={publicationDate} onChange={e => setPublicationDate(e.target.value)} />
        <input type="text" placeholder="Edition" value={edition} onChange={e => setEdition(e.target.value)} />
        <input type="text" placeholder="Volume Number" value={volumeNumber} onChange={e => setVolumeNumber(e.target.value)} />
        <input type="text" placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
        <input type="text" placeholder="Sub-genre" value={subgenre} onChange={e => setSubgenre(e.target.value)} />
        <input type="text" placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} />

        {edit ? (
          <button onClick={() => editBook({ title, author, translator, publicationDate, edition, volumeNumber, genre, subgenre, isbn })}>
            Update Book
          </button>
        ) : (
          <button onClick={() => addBook({ title, author, translator, publicationDate, edition, volumeNumber, genre, subgenre, isbn })}>
            Add Book
          </button>
        )}
      </div>
    </div>
  );
}



export default MainApplication;