import React, { useState } from 'react';
import ChatRoom from './ChatRoom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {!user ? (
        <>
          <LoginForm onLogin={handleLogin} />
          <SignupForm onSignup={handleLogin} />
        </>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <ChatRoom user={user} />
        </>
      )}
    </div>
  );
}

export default App;
