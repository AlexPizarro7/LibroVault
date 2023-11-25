import React, { useState, useContext, createContext, useEffect} from 'react';
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
/**
 * LibraryList Component
 * 
 * @component
 * @description 
 * Renders a sidebar with a list of libraries associated with a specific user and allows users to add new libraries.
 * It utilizes LibraryContext for accessing and manipulating the library data.
 * 
 * @functionality
 * - Fetches and displays a list of libraries from the database associated with the logged-in user upon component mount.
 * - Provides functionality to add a new library to the database and updates the displayed list accordingly.
 * 
 * @useEffect
 * - Fetches the user's libraries from the database when the component mounts or when the user ID changes.
 * - Utilizes the `fetchLibraries` function to make a GET request to the backend.
 * - Updates the `libraries` state with the fetched data.
 * 
 * @returns {JSX.Element} The rendered sidebar component with library list and add library functionality.
 */
function LibraryList() {
    const { libraries, setLibraries, setSelectedLibrary } = useContext(LibraryContext);
    const userId = '6537cd2a3b3f4201bcb08c9a'; // Replace with dynamic user ID retrieval logic

    // useEffect(() => {
    //     const fetchLibraries = async () => {
    //         try {
    //             const response = await fetch(`http://localhost:8080/api/libraries/user/${userId}`);
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }
    //             const userLibraries = await response.json();
    //             setLibraries(userLibraries);
    //         } catch (error) {
    //             console.error('Error fetching libraries:', error);
    //         }
    //     };

    //     fetchLibraries();
    // }, [userId, setLibraries]); // Dependency array ensures this runs when userId or setLibraries changes

    useEffect(() => {
        const fetchLibraries = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/libraries/user/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const userLibraries = await response.json();
                setLibraries(userLibraries);
            } catch (error) {
                console.error('Error fetching libraries:', error);
            }
        };

        fetchLibraries();
    }, [userId, setLibraries]); // Dependency array ensures this runs when userId or setLibraries changes


/**
 * Adds a new library to the database.
 * 
 * @async
 * @function addLibrary
 * @param {string} name - The name of the library to be added.
 * @description 
 * - Validates the library name to ensure it is provided.
 * - Constructs the library data with the name and associated user ID.
 * - Sends a POST request to the server to add the new library.
 * - On successful addition, updates the local state with the newly added library.
 * - Handles any errors during the fetch operation and logs them.
 * @note 
 * - The userId is currently hardcoded for demonstration purposes. 
 *   In a production environment, it should be dynamically obtained, 
 *   typically from the user's session or authentication context.
 * - The function assumes that the backend API is set up to receive the POST request 
 *   at 'http://localhost:8080/api/libraries' and handle it appropriately.
 * - The function also assumes that the backend will return the newly created library object 
 *   in the response, which is then used to update the local state.
 * - Error handling is implemented for the fetch operation, but additional error handling 
 *   may be required based on specific backend configurations and requirements.
 */
    const addLibrary = async (name) => {
        const userId = '6537cd2a3b3f4201bcb08c9a'; // Replace with the actual user ID when ready

        // Check if the name is provided
        if (!name) {
            alert('Please enter a library name.');
            return;
        }

        // Check if the userId is provided
        // if (!userId) {
        //     alert('User ID is missing.');
        //     return;
        // }

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

    /**
     * Changes the name of an existing library.
     * 
     * @function changeLibraryName
     * @param {string} newName - The new name to be assigned to the library.
     * @description 
     * Sends a PUT request to the server to update the name of a specified library.
     * Updates the local state with the new library data.
     * 
     * @note 
     * - Assumes the existence of a `selectedLibrary` context or state variable with an `id` property.
     * - The `libraryId` should match the format expected by the backend.
     * - The function relies on the `libraries` state and `setLibraries` method from the context or state.
     * - Uses `encodeURIComponent` to encode the `newName` to ensure it is URL-safe.
     * 
     * @errorHandling 
     * - Logs an error message if the update request fails or if the server response is not as expected.
     */
    const changeLibraryName = (newName) => {
        const libraryId = selectedLibrary.id; // Ensure this matches the format expected by your backend
    
        fetch(`http://localhost:8080/api/libraries/update/${libraryId}?newName=${encodeURIComponent(newName)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(updatedLibrary => {
            // Update the local state with the new library data
            const updatedLibraries = libraries.map(lib => {
                if (lib.id === libraryId) {
                    return updatedLibrary; // Replace with the updated library data
                }
                return lib;
            });
            setLibraries(updatedLibraries);
        })
        .catch(error => {
            console.error('Error updating library name:', error);
        });
    };
    
    // const deleteLibrary = () => {
    //     const updatedLibraries = libraries.filter(lib => lib !== selectedLibrary);
    //     setLibraries(updatedLibraries);
    //     setSelectedLibrary(null);
    // };

    /**
     * Deletes a library.
     * 
     * @function deleteLibrary
     * @description 
     * Sends a DELETE request to the server to remove a specified library.
     * Updates the local state to reflect the deletion.
     * 
     * @note 
     * - Assumes the existence of a `selectedLibrary` context or state variable with an `id` property.
     * - The `libraryId` should match the format expected by the backend.
     * - The function relies on the `libraries` state and `setLibraries` method from the context or state.
     * - It also uses `setSelectedLibrary` to reset the selected library state.
     * 
     * @errorHandling 
     * - Logs an error message if the deletion request fails or if the server response is not as expected.
     */
    const deleteLibrary = () => {
        const libraryId = selectedLibrary.id; // Ensure this matches the format expected by your backend
    
        fetch(`http://localhost:8080/api/libraries/${libraryId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.status === 204) {
                // Update the local state to remove the deleted library
                const updatedLibraries = libraries.filter(lib => lib.id !== libraryId);
                setLibraries(updatedLibraries);
                setSelectedLibrary(null);
            } else {
                console.error('Failed to delete library');
            }
        })
        .catch(error => {
            console.error('Error deleting library:', error);
        });
    };
    

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
        setLibraries(updatedLibraries);
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