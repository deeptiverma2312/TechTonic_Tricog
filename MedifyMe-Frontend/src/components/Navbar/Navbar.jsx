import { Link, useLocation } from "react-router-dom";
import Brand from "../../assets/Brand.svg";
import styles from "./Navbar.module.css";
import Burger from "../Burger/Burger";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div>
          <Link to="/">
            <div className={styles.logoSection}>
              <img alt="brand" src={Brand} />
              <span className={styles.brand}>
                HEARTIFY<p className={styles.brandIn}>ME</p>
              </span>
            </div>
          </Link>
        </div>
        <div className={styles.nav_elements}>
          <ul>
            <li
              className={
                location.pathname === "/health_history" ? styles.active : ""
              }
            >
              <Link to="/health_history">AI Assistant</Link>
            </li>
            <li className={location.pathname === "/test" ? styles.active : ""}>
              <Link to="/test">Reports</Link>
            </li>
            <li>
              <div className={styles.appointment}>
                <Link style={{ color: "black" }} to="/health_history">
                  Start Assessment
                </Link>
              </div>
            </li>
          </ul>
        </div>
        <div className={styles.hamburger}>
          <Burger />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;