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
  const [translator, setTranslator] = useState('');
  //new things added - eric 
  const [edition, setEdition] = useState('');
  const [volumeNumber, setVolumeNumber] = useState('');
  const [subgenre, setSubgenre] = useState('');
  const [isbn, setIsbn] = useState('');
  const [bookId, setBookId] = useState(''); // Add a state variable for the book ID

  

 


  const addBook = (book) => {
    //Book Data to send to API 
    const bookData = {
      title,
      author,
      translator,
      publicationDate,
      edition,
      volumeNumber,
      genre,
      subgenre,
      isbn,
    };

    fetch('http://localhost:8080/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    })
      .then((response) => response.json())
      .then((book) => {
        if (book.id) {
          console.log('New book added successfully with ID:', book.id);
          // You can update your UI or perform other actions upon successful book addition.

          // Store the book ID in your component's state
          setBookId(book.id);
        } else {
          console.error('Failed to add book');
          // Handle errors and provide user feedback for failed book addition.
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        // Handle network errors or other issues.
      });

    const updatedLibraries = libraries.map(lib => {
      if (lib === selectedLibrary) {
        lib.books.push(book);
      }
      return lib;
    });
    setLibraries(updatedLibraries);
  };

  const editBook = (editedBook) => {
    // Ensure you have a valid bookId stored in the state variable
    if (bookId) {
      // Prepare the updated book data 
      const updatedBookData = {
        title: editedBook.title,
        author: editedBook.author,
        translator: editedBook.translator,
        publicationDate: editedBook.publicationDate,
        edition: editedBook.edition,
        volumeNumber: editedBook.volumeNumber,
        genre: editedBook.genre,
        subgenre: editedBook.subgenre,
        isbn: editedBook.isbn,
      };
  
      // Send a PUT request to update the book with the bookId
      fetch(`http://localhost:8080/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBookData),
      })
        .then((response) => {
          if (response.ok) {
            console.log('Book updated successfully');
            // You can update your UI or perform other actions upon successful book update.
          } else {
            console.error('Failed to update book');
            // Handle errors and provide user feedback for failed book update.
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          // Handle network errors or other issues.
        });
  
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
  };
  



  const deleteBook = (book) => {
    if (bookId) {
      // Make a DELETE request to the backend API to delete the book with the specified bookId
      fetch(`http://localhost:8080/api/books/remove/${bookId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            console.log('Book deleted successfully');
            // Update the frontend state if needed (you may not need to do anything here since you already removed it in the frontend)
            // setLibraries(updatedLibraries);
            setEdit(null);
          } else {
            console.error('Failed to delete book');
            // Handle errors and provide user feedback for failed book deletion.
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          // Handle network errors or other issues.
        });
    } else {
      console.error('bookId is missing or invalid');
      // Handle the case where bookId is missing or invalid (provide user feedback or error handling).
    }
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

  //added the remaining attributes 
  const editButton = (book) => {
    // hold the property values, and the values themselves are constants 
    const { title, author, translator, publicationDate, edition, volumeNumber, genre, subgenre, isbn } = book;
    setEdit(book);
    setTitle(title);
    setAuthor(author);
    setTranslator(translator);
    setPublicationDate(publicationDate);
    setEdition(edition);
    setVolumeNumber(volumeNumber);
    setGenre(genre);
    setSubgenre(subgenre);
    setIsbn(isbn);
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
        {/* Added all the attributes to the book - eric */}
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} />
      <input type="text" placeholder="Translator" value={translator} onChange={(e) => setTranslator(e.target.value)} />
      <input type="text" placeholder="Publication Date" value={publicationDate} onChange={(e) => setPublicationDate(e.target.value)} />
      <input type="text" placeholder="Edition" value={edition} onChange={(e) => setEdition(e.target.value)} />
      <input type="text" placeholder="Volume Number" value={volumeNumber} onChange={(e) => setVolumeNumber(e.target.value)} />
      <input type="text" placeholder="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
      <input type="text" placeholder="Subgenre" value={subgenre} onChange={(e) => setSubgenre(e.target.value)} />
      <input type="text" placeholder="ISBN" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
       {/* Added all the attributes*/}
        {edit ? (
        <button onClick={() => editBook({ 
          title,
          author,
          translator,
          publicationDate,
          edition,
          volumeNumber,
          genre,
          subgenre,
          isbn
        })}>Save Edits</button>
        
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