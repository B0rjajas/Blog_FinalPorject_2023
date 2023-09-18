import React from "react";
import { Link, NavLink } from "react-router-dom";
import "../style/Navbar.css";
import Logo from "./Logo";
import { FaBars, FaTimes } from "react-icons/fa";
import { IconContext } from "react-icons/lib";

function Navbar({ loggedInUsername, handleLogout }) {
  const [click, setClick] = React.useState(false);

  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <nav className="navbar">
          <div className="navbar-container container contenedor">
            <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
              <Logo className="navbar-icon" />
            </Link>
            <div className="menu-icon" onClick={handleClick}>
              {click ? (
                <FaTimes style={{ color: "black" }} />
              ) : (
                <FaBars style={{ color: "black" }} />
              )}
            </div>
            <div className="username-container-right">
            {loggedInUsername && (
              <>
                <span className="username">{loggedInUsername}</span>
                <span className="username-line" />
              </>
            )}
            </div>
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/post"
                  className={({ isActive }) =>
                    "nav-links" + (isActive ? " activated" : "")
                  }
                  onClick={closeMobileMenu}
                >
                  Post
                </NavLink>
              </li>
              {loggedInUsername ? (
                <li className="nav-item">
                  <span
                    className="nav-links"
                    onClick={() => {
                      handleLogout(); // Llamar a la función de logout
                      closeMobileMenu();
                    }}
                  >
                    Logout
                  </span>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      "nav-links" + (isActive ? " activated" : "")
                    }
                    onClick={closeMobileMenu}
                  >
                    Login
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
         
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
