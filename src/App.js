import './App.css';
import { useState, useEffect } from 'react';
import JoblyApi from "./JoblyApi";
import Nav from "./Nav";
import Routes from "./Routes";
import UserContext from "./userContext";

/** App for rendering Jobly
 * 
 * Props: none
 * 
 * State: 
 *  - user: an object, like{username, firstName, lastName, email, isAdmin}
 *  - token: a string
 * 
 * App -> {Nav, Routes}
 */

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // get back a token after log in
  async function login({ username, password }) {
    const tokenData = await JoblyApi.login({ username, password });
    setToken(tokenData);
    localStorage.setItem('token', tokenData);
  }

  // get back a token after sign up
  async function signup({ username, password, firstName, lastName, email }) {
    const tokenData = await JoblyApi.registerUser({
      username,
      password,
      firstName,
      lastName,
      email
    });
    setToken(tokenData);
    localStorage.setItem('token', tokenData);
  }

  // get back a user after token state changes
  useEffect(function fetchUserWithToken() {
    if (token === null) return;  
    async function getUser() {
      console.log("token from get user", token);
      const userData = await JoblyApi.getUser(token);
      console.log("user from get user", userData);
      setUser(userData);
    }
    getUser();
  }, [token]);

  // update user information
  async function editUser({ username, firstName, lastName, email }) {
    const userData = await JoblyApi.editUser(
      username,
      firstName,
      lastName,
      email
    );
    setUser(userData);
  }

  if((!user) && token) {
    return <i> Loading...</i>;
  }

  // logout
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }

  return (
    <div className="App">
      <UserContext.Provider value={{user, token}}>
        <Nav logout={logout} />
        <Routes
          login={login}
          signup={signup}
          editUser={editUser}
        />
      </UserContext.Provider>
    </div>
  );
}

export default App;
