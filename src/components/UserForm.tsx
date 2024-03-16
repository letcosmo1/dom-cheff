import { InputAdornment, TextField, Box, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import PersonIcon from "@mui/icons-material/Person";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useState } from "react";
import { LoadingButton } from "@mui/lab";

import styles from "./css/UserForm.module.css";

type Inputs = {
  email: string;
  password: string;
  isLoading: boolean;
};

type UserFormProps = {
  onSubmit: (data: Inputs) => void;
  isLoading: boolean;
};

export const UserForm = ({ onSubmit, isLoading }: UserFormProps) => {
  const [showPassword, setShowPassword] = useState<Boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          defaultValue={""}
          {...register("email", {
            required: "Campo obrigatorio",
            minLength: {
              value: 5,
              message: "O minimo é 5 caracteres!",
            },
            maxLength: {
              value: 255,
              message: "Você ultrapassou o maximo de caracteres ( 255 ) ",
            },
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Formato de email inválido!",
            },
          })}
          data-testid="email-input"
          id="email"
          label="Email"
          variant="standard"
          color="success"
          sx={{
            width: { md: 350 },
            marginBottom: { md: 1 },
            "& input": {
              fontWeight: "bold",
            },
          }}
          InputLabelProps={{
            className: styles.textfiled_label,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <ErrorMessage
        errors={errors}
        name="email"
        render={({ message }) => <p>{message}</p>}
      />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          defaultValue={""}
          {...register("password", {
            required: "Campo obrigatorio",
            minLength: {
              value: 5,
              message: "O minimo é 5 caracteres!",
            },
            maxLength: {
              value: 255,
              message: "Você ultrapassou o maximo de caracteres ( 255 ) ",
            },
          })}
          id="password"
          data-testid="password-input"
          label="Senha"
          variant="standard"
          color="success"
          type={showPassword ? "text" : "password"}
          sx={{
            width: { md: 350 },
            marginBottom: { md: 2 },
            "& input": {
              fontWeight: "bold",
            },
          }}
          InputLabelProps={{
            className: styles.textfiled_label,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleTogglePassword}
                  edge="end"
                  sx={{
                    right: "3px",
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <ErrorMessage
        errors={errors}
        name="password"
        render={({ message }) => <p>{message}</p>}
      />
      <LoadingButton
        variant="contained"
        id="button"
        loading={isLoading}
        type="submit"
        size={"large"}
        disableElevation
        disableRipple
        sx={{
          display: "flex",
          backgroundColor: "var(--color-light-blue)",
          color: "var(--color-white)",
          width: "180px",
          margin: "25px auto",
          font: "Roboto",
          fontWeight: "bold",
          textTransform: "none",
          fontSize: "16px",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "var(--color-dark-blue)",
          },
        }}
      >
        Entrar
      </LoadingButton>
    </form>
  );
};
