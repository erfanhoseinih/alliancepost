import "./navbarStyle.scss";

const Navbar = () => {
  return (
    <div className="navbar">
      <img src="/alliancePost.svg" className="navbar__logo" />
      <div className="navbar__menu">
        <div className="navbar__menu__wide">
          <button>HOME</button>
          <button>ABOUT</button>
          <button>SERVICES</button>
          <button>CONTACT</button>
        </div>
        <div className="navbar__menu__bar-icon">
          <button></button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
