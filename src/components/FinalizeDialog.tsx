import styles from "./css/FinalizeDialog.module.css";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { Acrescimo, ProdutoQuantidade } from "../utils/Types";
import InputAdornment from "@mui/material/InputAdornment";
import { toastMsgSuccess } from "../utils/Toasts";

type PropTypes = {
    openDialog: boolean;
    setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    total: number;
    totalFinal: number;
    setTotalFinal: React.Dispatch<React.SetStateAction<number>>;
    setProdutosSelecionados: React.Dispatch<React.SetStateAction<ProdutoQuantidade[]>>;
    setTotal: React.Dispatch<React.SetStateAction<number>>;
    addVenda: (descricao: string, valor: number, desconto: number) => void;
}

export const FinalizeDialog = ({ openDialog, setOpenDialog, total, totalFinal, setTotalFinal, setProdutosSelecionados, setTotal, addVenda }: PropTypes) => {
    const title_style = { width: { xs: 260, md: 500 }, fontSize: 30 };
    const checkbox_style = { marginBottom: 1 };
    const desconto_style = { width: { xs: "100%", md: 130 }, marginBottom: 1 };
    const acrescimo_style = { width: { xs: "100%", md: 130 }, marginRight: { xs: 0, md: 3 }, marginBottom: { xs: 2 } };
    const descricao_style = { width: { xs: "100%", md: 345 } };
    const btn_style = { fontWeight: "bold" };

    const [descontoChecked, setDescontoChecked] = useState<boolean>(false);
    const [acrescimoChecked, setAcrescimoChecked] = useState<boolean>(false);
    const [desconto, setDesconto] = useState<number>(0);
    const [acrescimo, setAcrescimo] = useState<Acrescimo>({ preco: 0, descricao: "" });

    const handleCancelar = () => {
        setDesconto(0);
        setAcrescimo({ preco: 0, descricao: "" });
        setDescontoChecked(false);
        setAcrescimoChecked(false);
        setOpenDialog(false);
    };
    const handleFinalizar = () => {
        addVenda(acrescimo.descricao, acrescimo.preco, desconto);
        setTotal(0);
        setProdutosSelecionados([]);
        setDesconto(0);
        setAcrescimo({ preco: 0, descricao: "" });
        setDescontoChecked(false);
        setAcrescimoChecked(false);
        setOpenDialog(false);
        toastMsgSuccess("Pedido finalizado com sucesso.");
    };
    const handleDescontoCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked: boolean = e.target.checked;
        if(!checked) {
            setTotalFinal(total + acrescimo.preco);
            setDesconto(0);
        }
        setDescontoChecked(checked);
    };
    const handleAcrescimoCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked: boolean = e.target.checked;
        if(!checked) {
            setTotalFinal(total - desconto);
            setAcrescimo({ preco: 0, descricao: "" });
        }
        setAcrescimoChecked(checked);
    };
    const handleDescontoFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const desconto: number = Number(e.target.value);
        setTotalFinal(total - desconto + acrescimo.preco);
        setDesconto(desconto);
    }
    const handleAcrescimoNumberFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valor_acrescimo: number = Number(e.target.value);
        setTotalFinal(total - desconto + valor_acrescimo);
        setAcrescimo({ preco: valor_acrescimo, descricao: acrescimo.descricao });
    }
    const handleAcrescimoFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAcrescimo({preco: acrescimo.preco, descricao: e.target.value });
    }

    return (
        <div>
            <Dialog open={ openDialog } onClose={ handleCancelar }>
                <DialogTitle sx={title_style}>Total do Pedido</DialogTitle>
                <DialogContent>
                    <div className={styles.preco_container}>
                        <Typography variant="h5" component="h2">
                            {totalFinal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                        </Typography>
                    </div>
                    <div className={styles.form_container}>
                        <FormControlLabel control={<Checkbox checked={ descontoChecked } onChange={ handleDescontoCheckBoxChange }/>} label="Adicionar desconto" sx={ checkbox_style }/>
                        <div className={ descontoChecked ? styles.desconto_container : styles.hide_desconto_container }>
                            <TextField
                                label="Desconto"
                                type="number"
                                sx={ desconto_style }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    inputProps: { min: 0 }
                                }}
                                value={ desconto }
                                onChange={ handleDescontoFieldChange }
                            />
                        </div>
                        <FormControlLabel control={<Checkbox  checked={ acrescimoChecked } onChange={ handleAcrescimoCheckBoxChange }/>} label="Adicionar acréscimo" sx={ checkbox_style }/>
                        <div className={ acrescimoChecked ? styles.acrescimo_container :  styles.hide_acrescimo_container }>
                            <TextField
                                label="Acréscimo"
                                type="number"
                                sx={ acrescimo_style }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                    inputProps: { min: 0 }
                                }}
                                value={ acrescimo.preco }
                                onChange={ handleAcrescimoNumberFieldChange }
                            />
                            <TextField
                                label="Descrição do Acréscimo"
                                type="text"
                                sx={ descricao_style }
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={ acrescimo.descricao }
                                onChange={ handleAcrescimoFieldChange }
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={ handleCancelar } size="large" sx={ btn_style }>Cancelar</Button>
                    <Button onClick={ handleFinalizar } size="large" sx={ btn_style }>Finalizar</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}