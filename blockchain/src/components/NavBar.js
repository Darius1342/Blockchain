// components/NavBar.js
import React from 'react';


const NavBar = ({ changePage }) => {
  return (
    <nav className="NavBar">
      <button onClick={() => changePage("home")}>Home</button>
      <button onClick={() => changePage("info")}>Info</button>
      <button onClick={() => changePage("teams")}>Teams</button>
      <button onClick={() => changePage("manage")}>Manage</button> 
      
    </nav>
  );
};

export default NavBar;