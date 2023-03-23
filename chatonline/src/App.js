import React, { useState } from 'react';
import ChatRoom from './ChatRoom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import styles from './App.module.scss';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  const handleLogin = (userData) => {
    console.log('User data:', userData);
    localStorage.setItem('user', JSON.stringify(userData.user));
    localStorage.setItem('token', userData.token);
    setUser(userData.user);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };
  

  return (
    <div className={styles.App}>
      {!user ? (
        <>
          <LoginForm onLogin={handleLogin} />
          <SignupForm onSignup={handleLogin} />
        </>
      ) : (
        <>
          <button className={styles.LogoutButton} onClick={handleLogout}>Logout</button>
          <ChatRoom user={user} />
        </>
      )}
    </div>
  );
}

export default App;
