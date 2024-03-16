import styles from "./Profile.module.css";
import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Auth, database } from "../../services/firebase";
import { child, get, ref } from "firebase/database";

// Types
import { cpfUser, emailUser, imageUser, nameUser } from "../../utils/types";

export const Profile = () => {
  const [name, setName] = useState<nameUser>("");
  const [email, setEmail] = useState<emailUser>("");
  const [cpf] = useState<cpfUser>();
  const [image, setImage] = useState<imageUser>("");

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        let email = user.email;
        setEmail(email!);
      }
    });
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
  }, [name, email, cpf]);

  // Style
  const textfield_style = { width: { md: 350 }, marginBottom: { md: 1 } };
  const loadingButton_style = {
    display: "flex",
    backgroundColor: "var(--color-light-blue)",
    color: "var(--color-white)",
    width: "180px",
    margin: "25px auto",
    fontSize: "20px",
    borderRadius: "10px",
    "&:hover": {
      backgroundColor: "var(--color-dark-blue)",
    },
  };

  return (
    <Container maxWidth={"sm"} className={styles.main_container}>
      <Box>
        <form className={styles.form_container}>
          <h1>Meu Perfil</h1>
          <div className={styles.line_h1}></div>
          <Box>
            <img src={image} />
          </Box>
          <Box>
            <TextField
              id="name"
              label="Nome"
              value={name}
              variant="standard"
              color="success"
              sx={textfield_style}
              InputLabelProps={{
                shrink: name !== "",
              }}
            />
          </Box>
          <Box>
            <TextField
              id="email"
              value={email}
              label="Email"
              variant="standard"
              color="success"
              sx={textfield_style}
              InputLabelProps={{
                shrink: email !== "",
              }}
            />
          </Box>
          <Box>
            <TextField
              id="cpf"
              label="CPF"
              variant="standard"
              color="success"
              sx={textfield_style}
            />
          </Box>
          <Box>
            <TextField
              id="image"
              label="Url da imagem"
              variant="standard"
              color="success"
              onChange={(e) => setImage(e.target.value)}
              sx={textfield_style}
            />
          </Box>
          <Box className={styles.box_button_container}>
            <LoadingButton
              id="button"
              type="submit"
              size={"large"}
              disableElevation
              disableRipple
              sx={loadingButton_style}
            >
              Atualizar
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Container>
  );
};
