import { useState } from "react";
import { auth } from "../services/Firebasess";
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
import { toastLogoutMgs } from "../utils/Toasts";
import ListItemText from "@mui/material/ListItemText";

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  const onSign = () => {
    signOut(auth);
    toastLogoutMgs();
  };
  const toggleDrawer = (isOpen: boolean) => () => {
    setOpen(isOpen);
  };
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
