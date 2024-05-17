import Typography from "@mui/material/Typography";
import styles from "./css/Product.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import { ProdutoQuantidade } from "../utils/Types";
import { useState } from "react";

type PropTypes = {
    nome: string;
    preco: number;
    quantidade: number;
    produtosSelecionados: ProdutoQuantidade[];
    setProdutosSelecionados: React.Dispatch<React.SetStateAction<ProdutoQuantidade[]>>;
    removeProduto: (nome: string) => void;
    changeProdutoTotal: (preco: number, quantidade: number, nova_quantidade: number) => void;
}

export const AddOrderPageProduct = ({ produtosSelecionados, setProdutosSelecionados, nome, preco, quantidade, removeProduto, changeProdutoTotal }: PropTypes) => {
    const nome_produto_style = { width: { md: 350 }};
    const numberfield_style = { width: { xs: "100%", md: 85 } };
    const btn_delete_style = { padding: { xs: 1.8 } };

    const [quantidadeValue, setQuantidadeValue] = useState<number>(quantidade);

    const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const quantidadeValue: number = Number(e.target.value);
        setQuantidadeValue(quantidadeValue);
        setProdutosSelecionados(produtosSelecionados.map((produto) => {
            if(produto.nome === nome) {
                produto.quantidade = quantidadeValue;
                changeProdutoTotal(preco, produto.quantidade, quantidadeValue);
            }
            return produto;
        }));
    }

    return (
        <div className={styles.produto}>
            <div className={styles.produto_info}>
                <Typography variant="body1" component="p" sx={ nome_produto_style }>
                    { nome }
                </Typography>
                <Typography variant="body1" component="p">
                    { preco.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) }
                </Typography>
            </div>
            <TextField
                label="Quantidade"
                type="number"
                variant="filled"
                sx={ numberfield_style }
                InputLabelProps={{
                    shrink: true,
                }}
                value={ quantidadeValue }
                onChange={ (e) => handleQuantidadeChange(e) }
            />
            <Button sx={ btn_delete_style } onClick={ () => removeProduto(nome) } type="submit" variant="contained" color="secondary" disableElevation><DeleteIcon /></Button>
        </div>
    )
}