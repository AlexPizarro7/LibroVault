import React, { useState, useContext, createContext, useEffect} from 'react';
import '../App.css';
import LibraryContext from './LibraryContext';
import { useLocation } from 'react-router-dom';



//This context allows child components to access and modify the app's state


//This is the App component, the main component
//uses UseStat eo create 2 state variables: libraries (list of libraries) and selectedLibrary(the currently selected library)

//libraryContext.Provider wraps the child components, so they can access the defined values of the values

function MainApplication() {
    const [libraries, setLibraries] = useState([]);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const location = useLocation();
    const [userId, setUserId] = useState(null); // State for userId
  
    useEffect(() => {
        console.log('location:', location);
        if (location.state?.userId) {
          console.log('userId:', location.state.userId); // Log userId
          setUserId(location.state.userId);
        }
      }, [location.state?.userId]);
      
  
    return (
      <div> {/* This is the opening <div> tag */}
        <LibraryContext.Provider value={{ libraries, setLibraries, selectedLibrary, setSelectedLibrary, userId, setUserId }}>
          <header>LibroVault</header>
          <div className="content">
            <LibraryList />
            {selectedLibrary && <Books />}
          </div>
        </LibraryContext.Provider>
      </div> 
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
    const { libraries, setLibraries, selectedLibrary, setSelectedLibrary, userId } = useContext(LibraryContext);
  


    useEffect(() => {
        const fetchLibraries = async () => {
            if (!userId) {
                console.log("User ID not found");
                return; // Or handle the absence of userId as appropriate
            }
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
        

        // Check if the name is provided
        if (!name) {
            alert('Please enter a library name.');
            return;
        }

        // Check if the name is provided
        if (name.trim === '') {
             alert('Empty Strings are not allowed.');
            return;
        }

        if (!name.trim()) {
            alert('Name requires characters or numbers.');
            return;
        }
        

        // Check if the userId is provided
        if (!userId) {
            alert('User ID is missing.');
            return;
        }

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
        const libraryId = selectedLibrary.libraryId; // Ensure this matches the format expected by your backend
        console.log("Selected Library:", selectedLibrary);
        console.log("Library ID:", libraryId);

        if (!selectedLibrary.libraryId) {
            console.error('libraryId is missing');
            return;
        }
        if(!selectedLibrary){
            console.error('No Library selected');
            return;
        }
        // Check if the name is provided
        if (newName.trim === '') {
             alert('Empty Strings are not allowed.');
            return;
         }
         if (!newName.trim()) {
            alert('Please enter a valid library name.');
            return;
        }
        

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
        const libraryId = selectedLibrary.libraryId; // Ensure this matches the format expected by your backend
    
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
    
    /**
 * Adds a book to the database and then links it to a specific library.
 * 
 * This function first sends a POST request to add a new book to the database.
 * If successful, it then sends another POST request to add the book's reference
 * to a specified library. It handles both success and error cases, logging
 * appropriate messages and updating the component's state as needed.
 *
 * @param {Object} book - The book object to be added. This is not used directly
 *                        but its properties are destructured to form the bookData.
 * @param {string} book.title - The title of the book.
 * @param {string} book.author - The author of the book.
 * @param {string} [book.translator] - The translator of the book, if any.
 * @param {Date} [book.publicationDate] - The publication date of the book.
 * @param {string} [book.edition] - The edition of the book.
 * @param {string} [book.volumeNumber] - The volume number of the book, if applicable.
 * @param {string} book.genre - The genre of the book.
 * @param {string} [book.subgenre] - The subgenre of the book, if applicable.
 * @param {string} [book.isbn] - The ISBN of the book.
 */
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
        // .then((response) => response.json())
        .then((response) => {
            if (!response.ok) {
                // Handle HTTP errors
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((addedBook) => {
            if (addedBook.id) {
                console.log('New book added successfully with ID:', addedBook.id);
                // Store the book ID in your component's state
                setBookId(addedBook.id);
    
                // Now add the book's DBRef to the library
                return fetch(`http://localhost:8080/api/libraries/${selectedLibrary.libraryId}/addBook/${addedBook.id}`, {
                    method: 'POST',
                });
            } else {
                console.error('Failed to add book');
                // Handle errors and provide user feedback for failed book addition.
            }
        })
        .then((libraryResponse) => {
            if (libraryResponse.ok) {
                console.log('Book added to library successfully');
                // Update UI or state as needed
            } else {
                console.error('Failed to add book to library');
                // Handle errors and provide user feedback for failed library addition.
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle network errors or other issues.
        });
    };
    
            
            
            
        
    /**
    * Deletes a book from the system and then removes it from a specific library.
    * This function first checks if the bookId is valid. If not, it logs an error and exits the function.
    * If the bookId is valid, it proceeds to send a DELETE request to the backend API to remove the book from the system.
    * 
    * Upon successful deletion from the system, it then sends another DELETE request to remove the book from the specified library.
    * 
    * After successfully removing the book from both the system and the library, it updates the local state to reflect these changes.
    * If any of the deletion operations fail, it logs the appropriate error messages.
    * 
    * @param {Object} bookToDelete - The book object to be deleted.
    * @param {string} bookToDelete.id - The unique identifier of the book to be deleted.
    */
    const deleteBook = (bookToDelete) => {
        console.log(bookToDelete);
        const bookId = bookToDelete.id;

        if (!bookId) {
            console.error('bookId is missing or invalid');
            return; // Exit the function if bookId is not valid
        }
        // First, delete the book from the system
        fetch(`http://localhost:8080/api/books/remove/${bookId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                console.log('Book deleted successfully from the system');
    
                // Then, remove the book from the specific library
                fetch(`http://localhost:8080/api/libraries/${selectedLibrary.id}/books/${bookId}`, {
                    method: 'DELETE',
                })
                .then(libResponse => {
                    if (libResponse.ok) {
                        console.log('Book removed from the library successfully');
    
                        // Update the local state to reflect these changes
                        const updatedLibraries = libraries.map(lib => {
                            if (lib.id === selectedLibrary.id) {
                                return {
                                    ...lib,
                                    books: lib.books.filter(book => book.id !== bookId),
                                };
                            }
                            return lib;
                        });
                        setLibraries(updatedLibraries);
                        setEdit(null);
                    } else {
                        console.error('Failed to remove book from the library');
                    }
                })
                .catch(error => {
                    console.error('Error removing book from library:', error);
                });
            } else {
                console.error('Failed to delete book from the system');
            }
        })
        .catch(error => {
            console.error('Error deleting book from system:', error);
        });
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

    // let searchedBooks = selectedLibrary.books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));
    let searchedBooks = selectedLibrary.books
    .filter(book => book && book.title.toLowerCase().includes(searchTerm.toLowerCase()));//now it will display null Book lists

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