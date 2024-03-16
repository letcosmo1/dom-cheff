import Typography from "@mui/material/Typography";
import styles from "./css/Product.module.css";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { useState } from "react";
import { UpdateProductDialog } from "./UpdateProductDialog";

type PropTypes = {
    id: string;
    nome: string;
    preco: number;
    removeProduto: (id: string, nome: string) => void;
    updateProduto: (id: string, nome: string, updated_nome: string, updated_preco: number) => void;
}

export const ProductsPageProduct = ({ id, nome, preco, removeProduto, updateProduto }: PropTypes) => {
    const nome_produto_style = { width: 350, color: "#424242" };
    const preco_style = { color: "#424242" };
    const btn_style = { padding: { xs: 1.8 } };

    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleOpenDialog = () => {
        setOpenDialog(true); 
    };

    return (
        <div className={styles.produto}>
            <div className={styles.produto_info}>
                <Typography variant="body1" component="p" sx={ nome_produto_style }>
                    { nome }
                </Typography>
                <Typography variant="body1" component="p" sx={ preco_style }>
                    { preco.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) }
                </Typography>
            </div>
            <Button sx={ btn_style } onClick={ handleOpenDialog } type="submit" variant="contained" color="secondary" disableElevation><BorderColorRoundedIcon /></Button>
            <Button sx={ btn_style } onClick={ () => removeProduto(id, nome) } type="submit" variant="contained" color="secondary" disableElevation><DeleteIcon /></Button>
            <UpdateProductDialog openDialog={ openDialog } setOpenDialog={ setOpenDialog } id={ id } nome={ nome } preco={ preco } updateProduto={ updateProduto }/>
        </div>
    )
}