import React, { useState, useContext, createContext, useEffect } from 'react'; // added useEffect Import
import '../App.css';


//This context allows child components to access and modify the app's state
const LibraryContext = createContext();

//This is the App component, the main component
//uses UseStat eo create 2 state variables: libraries (list of libraries) and selectedLibrary(the currently selected library)

//libraryContext.Provider wraps the child components, so they can access the defined values of the values

/**
 * MainApplication is the root component of the LibroVault application.
 * It manages the state for the list of libraries and the currently selected library.
 * 
 * The component fetches the list of libraries from a specified API endpoint and 
 * provides this data to its child components via the LibraryContext.
 * 
 * @component
 * @example
 * return (
 *   <MainApplication />
 * )
 */
function MainApplication() {
    const [libraries, setLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);

    /**
     * Fetches the list of libraries from the API and updates the state.
     * This effect runs once on component mount.
     */
    //     useEffect(() => {
    //     fetch('http://localhost:8080/api/libraries')
    //         .then(response => response.json())
    //         .then(data => setLibraries(data))
    //         .catch(error => console.error('Error:', error));
    // }, []);

    //jsx
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

/**
 * Library component for managing library data.
 * Utilizes LibraryContext for state management.
 * 
 * @component
 */
function Library() {
    const { libraries, setLibraries, setSelectedLibrary } = useContext(LibraryContext);

    /**
     * Adds a new library.
     * 
     * @async
     * @function addLibrary
     * @param {string} name - Name of the library to add.
     * @description Sends a POST request to add a new library to the server and updates the local state.
     */
    const addLibrary = async (name) => {

        //temporary userId value. Be sure to add it to the above parameters
        const userId = '6537cd2a3b3f4201bcb08c9a'; // Replace 'fixedUserId' with the actual user ID when ready


        // Construct the libraryData object with all required fields so it matches the DTO
        const libraryData = {
            name: name,
            user: userId,
        };
    
        try {
            const response = await fetch('http://localhost:8080/api/libraries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(libraryData),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const newLibrary = await response.json();
            setLibraries([...libraries, newLibrary]);
        } catch (error) {
            console.error('Error adding library:', error);
        }
    };
    
    /**
     * Deletes a library by its name.
     * 
     * @async
     * @function deleteLibraryByName
     * @param {string} libraryName - Name of the library to delete.
     * @description Sends a DELETE request to remove a library from the server and updates the local state.
     */
    const deleteLibraryByName = async (libraryName) => {
        try {
            // Send DELETE request to the server
            const response = await fetch(`http://localhost:8080/api/libraries/name/${encodeURIComponent(libraryName)}`, {
                method: 'DELETE',
            });
    
            // Check if the deletion was successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            // Update the local state to remove the deleted library
            // Assuming 'libraries' is the state variable holding the array of libraries
            const updatedLibraries = libraries.filter(lib => lib.name !== libraryName);
            setLibraries(updatedLibraries);
    
            //update the UI to reflect the deletion
    
        } catch (error) {
            console.error('Error deleting library:', error);
        }
    };
    

    // const deleteLibrary = async (libraryId) => {
    //     try {
    //         await fetch(`http://localhost:8080/api/libraries/${libraryId}`, {
    //             method: 'DELETE',
    //         });

    //         const updatedLibraries = libraries.filter(lib => lib.id !== libraryId);
    //         setLibraries(updatedLibraries);
    //         setSelectedLibrary(null);
    //     } catch (error) {
    //         console.error('Error deleting library:', error);
    //     }
    // };

    /**
     * Changes the name of an existing library.
     * 
     * @async
     * @function changeLibraryName
     * @param {string} libraryId - ID of the library to update.
     * @param {string} newName - New name for the library.
     * @description Sends a PUT request to update a library's name on the server and updates the local state.
     */
    const changeLibraryName = async (libraryId, newName) => {
        try {
            const response = await fetch(`http://localhost:8080/api/libraries/${libraryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newName }),
            });

            const updatedLibrary = await response.json();
            const updatedLibraries = libraries.map(lib => lib.id === libraryId ? updatedLibrary : lib);
            setLibraries(updatedLibraries);
        } catch (error) {
            console.error('Error updating library:', error);
        }
    };
}


/**
 * LibraryList component - Renders a sidebar with a list of libraries.
 * Allows users to add new libraries using the LibraryContext.
 * 
 * @component
 */
//This is the LibraryList component, this is the sidebar that has the list of libraries.
//This component uses 'useContext' to access 'LibraryContext' and be able to use its functions 
function LibraryList() {
    const { libraries, setLibraries, setSelectedLibrary } = useContext(LibraryContext);

    //needs to be replaces with the method in Library
    const addLibrary = (name) => {
        const newLibrary = { name, books: [] };
        setLibraries([...libraries, newLibrary]);
    };

        //jsx
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
    const [sortMethod, setSortMethod] = useState
        ('default');
    const [bookId, setBookId] = useState('');



    // const changeLibraryName = (newName) => {
    //     const updatedLibraries = libraries.map(lib => {
    //         if (lib === selectedLibrary) {
    //             lib.name = newName;
    //         }
    //         return lib;
    //     });
    //     setLibraries(updatedLibraries);
    // };

    // const deleteLibrary = () => {
    //     const updatedLibraries = libraries.filter(lib => lib !== selectedLibrary);
    //     setLibraries(updatedLibraries);
    //     setSelectedLibrary(null);
    // };

    const addBook = (book) => {
        if (!book.title || !book.author || !book.genre) {
            alert('Please complete the Title, Author, and Genre fields to add the book.');
            return;
        }

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
                    console.error('Failed to add book, Ensure the following attributes are filled in: Author, Title, Genre');
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
        setLibraries(updatedLibraries);//what does this mean
        resetFields();

    };




    const deleteBook = (bookToDelete) => {
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
        resetFields();
    };
    }; //end of editBook

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
            {/* <button onClick={() => {
                const newName = prompt("Edit library name");
                if (newName) changeLibraryName(newName);
            }}>
                Edit Library Name
            </button>
            <button onClick={deleteLibrary}>Delete Library</button> */}
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