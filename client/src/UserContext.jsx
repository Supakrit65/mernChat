import { useEffect } from "react";
import { createContext, useState } from "react";
import axios from 'axios'

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/profile');
        setId(response.data.userId);
        setUsername(response.data.username);
      } catch (err) {
        throw new Error(err);
      }
    }
    fetchData();
  }, []) // add an empty dependency array to ensure the effect runs only once

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
