import React, { useContext } from "react";
import { Button, Container, Navbar } from 'react-bootstrap';
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/navbar.module.scss";

function AppNavbar() {
  const { logout } = useContext(AuthContext);

  return (
    <div className={styles['navbar']}>
      <h2>Bienvenido</h2>
      <Button variant='dark' onClick={logout}>Cerrar Sesión</Button>
    </div>
  );
}

export default AppNavbar;

