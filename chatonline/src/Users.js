import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Users.module.scss';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await axios.get('http://localhost:4242/auth/users');
      setUsers(response.data);
    }
    fetchUsers();
  }, []);

  return (
    <div className={styles.UserList}>
      <h2 className={styles.Title}>Users</h2>
      <ul className={styles.List}>
        {users.map((user) => (
          <li key={user._id} className={styles.Item}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;