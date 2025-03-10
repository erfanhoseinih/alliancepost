
import "./navbarStyle.scss";
import { ReactComponent as Logo } from '../assets/alliancePost.svg';
import { ReactComponent as Bar } from '../assets/bar.svg'
const Navbar = () => {
    return (
        <div className="navbar">
            <Logo className="navbar__logo" />
            <div className="navbar__menu">
                <div className="navbar__menu__wide">
                    <button>HOME</button>
                    <button>ABOUT</button>
                    <button>SERVICES</button>
                    <button>CONTACT</button>
                </div>
                <div className="navbar__menu__bar-icon">
                    <button>
                        < Bar />
                    </button>

                </div>

            </div>


        </div>
    )
}

export default Navbar;