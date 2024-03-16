import { useState, useEffect } from "react";
import { Auth, database } from "../services/firebase";
import { ref, child, get } from "firebase/database";
import { NavLink } from "react-router-dom";
import styles from "./css/Navbar.module.css";
import Button from "@mui/material/Button/Button";
import { signOut } from "firebase/auth";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { toastLogoutMgs } from "../utils/toastMsg";
import ListItemText from "@mui/material/ListItemText";

export const Navbar = () => {
  const [, setName] = useState<string>();
  const [open, setOpen] = useState(false);

  const onSign = () => {
    signOut(Auth);
    toastLogoutMgs();
  };
  const toggleDrawer = (isOpen: boolean) => () => {
    setOpen(isOpen);
  };

  useEffect(() => {
    const user = Auth.currentUser;
    const dbRef = ref(database);
    get(child(dbRef, `users/${user?.uid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          setName(snapshot.val());
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <nav>
      <div className={styles.responsive_container}>
        <AppBar position="static" elevation={0}>
          <Toolbar
            className={styles.Toolbar}
            sx={{ justifyContent: "space-between" }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div">
              <NavLink to={"/"}>Cheff Burguer</NavLink>
            </Typography>
            <Button
              sx={{ color: "var(--color-white)" }}
              onClick={() => onSign()}
            >
              <ExitToAppIcon />
            </Button>
          </Toolbar>
        </AppBar>

        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
          <List className={styles.list_container}>
            <NavLink to={"/"}>
              <ListItemButton onClick={toggleDrawer(false)}>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </NavLink>
            <NavLink to={"/adicionar-pedido"}>
              <ListItemButton onClick={toggleDrawer(false)}>
                <ListItemText primary="Adicionar Pedido" />
              </ListItemButton>
            </NavLink>
            <NavLink to={"/cadastrar-gasto"}>
              <ListItemButton onClick={toggleDrawer(false)}>
                <ListItemText primary="Adicionar Gasto" />
              </ListItemButton>
            </NavLink>
            <NavLink to={"/pedidos"}>
              <ListItemButton onClick={toggleDrawer(false)}>
                <ListItemText primary="Pedidos" />
              </ListItemButton>
            </NavLink>
            <NavLink to={"/gastos"}>
              <ListItemButton onClick={toggleDrawer(false)}>
                <ListItemText primary="Gastos" />
              </ListItemButton>
            </NavLink>
            <NavLink to={"/lucro"}>
              <ListItemButton onClick={toggleDrawer(false)}>
                <ListItemText primary="Lucro" />
              </ListItemButton>
            </NavLink>
            <NavLink to={"/categorias"}>
              <ListItemButton onClick={toggleDrawer(false)}>
                <ListItemText primary="Categorias" />
              </ListItemButton>
            </NavLink>
            <NavLink to={"/produtos"}>
              <ListItemButton onClick={toggleDrawer(false)}>
                <ListItemText primary="Produtos" />
              </ListItemButton>
            </NavLink>
          </List>
        </Drawer>
      </div>
    </nav>
  );
};
