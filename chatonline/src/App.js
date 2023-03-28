import React, { useState, useEffect } from 'react';
import ChatRoom from './ChatRoom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import UserList from './Users';
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
          <div className={styles.HeaderAndButton}>
          <h1 className={styles.TextHeader}>Welcome to ChatOnline {user.username}</h1>
          <button className={styles.LogoutButton} onClick={handleLogout}>Logout</button>
          </div>
          <div className={styles.MainContent}>
            <div className={styles.Users}>
              <UserList />
            </div>
            <div className={styles.Chat}>
              <ChatRoom user={user} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
