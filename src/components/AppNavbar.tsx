import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/navbar.module.scss";
import { ImExit } from "react-icons/im";

function AppNavbar() {
  const { logout, user } = useContext(AuthContext);

  return (
    <div className={styles['navbar']}>
      <h2>Sistema electoral</h2>
      <div className={styles['login-data']}>
        <p>{user.full_name} - {user.membership_number}</p>
        <ImExit size={30} className={styles['icon']} onClick={logout}/>
      </div>
    </div>
  );
}

export default AppNavbar;

