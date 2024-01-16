// import React from "react";
import { Link, useLocation } from "react-router-dom";
// import "./styles/navbar.css";

function NavBar() {
  const { pathname } = useLocation();

  const pages = ["", "les-mis", "social-graphs"];

  const createLinks = () => {
    return pages.map((p) => (
      <Link
        to={`/${p}`}
        key={p}
        className={`nav__link ${
          pathname.substring(1) === p ? "nav__active" : ""
        }`}
        onClick={() => {
          window.scroll(0, 0);
        }}
        style={{ marginRight: "30px" }}
      >
        {p === ""
          ? "Dashboard"
          : p.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())}
      </Link>
    ));
  };
  return <nav>{createLinks()}</nav>;
}

export default NavBar;
