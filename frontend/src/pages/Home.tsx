import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h2>Welcome to the Residency Tracker</h2>
      <p>
        Please <Link to="/login">Login</Link> or{' '}
        <Link to="/register">Register</Link>.
      </p>
    </div>
  );
};

export default Home;
