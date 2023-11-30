import React, { createContext } from 'react';

const LibraryContext = createContext({
  libraries: [],
  setLibraries: () => {},
  selectedLibrary: null,
  setSelectedLibrary: () => {},
  userId: null, // Include userId in the context
  setUserId: () => {}, // And a function to update it
  librariesUpdated: false, // New state for tracking updates
  setLibrariesUpdated: () => {} // Function to update the state
  
});

export default LibraryContext;
