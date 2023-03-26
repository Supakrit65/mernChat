import { useEffect } from "react";
import { createContext, useState } from "react";
import axios from 'axios'

// Create a new context for storing user data
export const UserContext = createContext({});

// Define a component that will provide the user data to child components
export function UserContextProvider({ children }) {
  // Define state variables for the user's ID and username
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  // Use an effect hook to fetch the user data from the server when the component mounts
  useEffect(() => {
    // Define an async function to make the API call
    async function fetchData() {
      try {
        // Make an HTTP GET request to the '/profile' endpoint to get the user data
        const response = await axios.get('/profile');
        // Store the user's ID and username in state variables
        setId(response.data.userId);
        setUsername(response.data.username);
      } catch (err) {
        // If there's an error, throw a new error with the error message
        throw new Error(err);
      }
    }
    // Call the fetchData function when the component mounts (using an empty dependency array)
    fetchData();
  }, [])

  // Render the child components and pass them the user data as props via the context
  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
