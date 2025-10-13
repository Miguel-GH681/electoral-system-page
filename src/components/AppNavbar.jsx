import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/navbar.module.scss";
import { ImExit } from "react-icons/im";

function AppNavbar() {
  const { logout } = useContext(AuthContext);

  return (
    <div className={styles['navbar']}>
      <h2>Sistema electoral</h2>
      <ImExit size={30} className={styles['icon']} onClick={logout}/>
    </div>
  );
}

export default AppNavbar;

