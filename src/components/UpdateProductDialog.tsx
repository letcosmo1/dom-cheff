import styles from "./css/UpdateDialog.module.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import InputAdornment from "@mui/material/InputAdornment";

type PropTypes = {
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    id: string;
    nome: string;
    preco: number;
    updateProduto: (id: string, nome: string, updated_nome: string, updated_preco: number) => void;
}

export const UpdateProductDialog = ({ openDialog, setOpenDialog, id, nome, preco, updateProduto }: PropTypes) => {
    const title_style = { width: { xs: 260, md: 500 }, fontSize: 30 };
    const nome_field_style = { marginTop: 0.5 };
    const preco_field_style = { marginTop: 3,  width: { xs: "100%", md: 130 } };
    const btn_style = { fontWeight: "bold" };

    const [updatedNome, setUpdatedNome] = useState<string>(nome);
    const [updatedPreco, setUpdatedPreco] = useState<number>(preco);

    const handleCancelar = () => {
        setOpenDialog(false);
    };
    const handleFinalizar = () => {
        updateProduto(id, nome, updatedNome, updatedPreco);
        setOpenDialog(false);
    };
    const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUpdatedNome(e.target.value);
    }
    const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUpdatedPreco(Number(e.target.value));
    }

    return (
        <div>
            <Dialog open={openDialog} onClose={handleCancelar}>
                <DialogTitle sx={title_style}>Editar Produto</DialogTitle>
                <DialogContent>
                    <div className={styles.form_container}>
                        <TextField
                            label="Nome"
                            type="text"
                            sx={ nome_field_style }
                            value={ updatedNome }
                            onChange={ handleNomeChange }
                        />
                        <TextField
                            label="Preço"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                inputProps: { min: 0 }
                            }}
                            sx={ preco_field_style }
                            value={ updatedPreco }
                            onChange={ handlePrecoChange }
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelar} size="large" sx={btn_style}>Cancelar</Button>
                    <Button onClick={handleFinalizar} size="large" sx={btn_style}>Finalizar</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}