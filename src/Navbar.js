import React from 'react';
import {Link} from 'react-router-dom';

function Navbar () {
  return (
    <ul>
      <li><Link to="/">Home</Link></li>
      <li><Link to="/login">Login</Link></li>
      <li><Link to="/board">Board</Link></li>
      <li><Link to="/register">Register</Link></li>
    </ul>
  );
}

export default Navbar;
