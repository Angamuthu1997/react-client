import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      const config = { headers: { Authorization: token } };

      try {
        const userRes = await axios.get('/api/auth/current', config);
        setUser(userRes.data);
        console.log(userRes)

        if (userRes.data.role === 'admin') {
          const usersRes = await axios.get('/api/users', config);
          setUsers(usersRes.data);

          const orgsRes = await axios.get('/api/organizations', config);
          setOrganizations(orgsRes.data);
        } else {
          setUsers([userRes.data]);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Welcome, {user && user.name}</h3>

      {user && user.role === 'admin' && (
        <div>
          <h4>Organizations</h4>
          <ul>
            {organizations.map((org) => (
              <li key={org._id}>{org.name}</li>
            ))}
          </ul>

          <h4>Users</h4>
          <ul>
            {users.map((user) => (
              <li key={user._id}>{user.name}</li>
            ))}
          </ul>
        </div>
      )}

      {user && user.role === 'user' && (
        <div>
          <h4>Your Info</h4>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          {/* <p>Organization: {user.organization.name}</p> */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
