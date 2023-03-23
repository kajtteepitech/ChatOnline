import React, { useState } from 'react';
import axios from 'axios';

const SignupForm = ({ onSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:4242/auth/signup', { username, password });
      onSignup(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign up</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignupForm;
