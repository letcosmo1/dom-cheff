import Container from "@mui/material/Container";

// Styles
import styles from "./LoginPage.module.css";

// Icons / Imgs
import img from "../../assets/Hamburguer.png";
import logo from "../../assets/Logo.png";
import { SubmitHandler } from "react-hook-form";

// Services
import { UserForm } from "../../components/UserForm.tsx";
import { toastLoginSuccess, toastMsgError } from "../../utils/toastMsg.ts";
import { useState } from "react";
import { errorMessages } from "../../utils/errosMessages.ts";
import { loginWithEmail } from "../../services/auth.ts";

// Interface
type formData = {
  email: string;
  password: string;
};

export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit: SubmitHandler<formData> = (data) => {
    setIsLoading(true);

    loginWithEmail(data.email, data.password)
      .then(() => {
        toastLoginSuccess();
        setIsLoading(false);
      })
      .catch((error) => {
        let msg = errorMessages(error.code);
        toastMsgError(msg);
        setIsLoading(false);
      });
  };
  
  return (
    <div className={styles.body} data-testid="body-div">
      <Container
        maxWidth={"md"}
        disableGutters
        className={styles.div_form_container}
        data-testid="container"
      >
        <div className={styles.div_image_container} data-testid="img-div">
          <img src={img} />
        </div>
        <div className={styles.div_form_content} data-testid="user-form">
          <img src={logo} />
          <UserForm onSubmit={onSubmit} isLoading={isLoading} />
        </div>
      </Container>
    </div>
  );
};
