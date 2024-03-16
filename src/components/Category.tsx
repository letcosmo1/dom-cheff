import Typography from "@mui/material/Typography";
import styles from "./css/Category.module.css";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import { CategoryConfirmDialog } from "./CategoryConfirmDialog";
import { useState } from "react";

type PropTypes = {
    id: string;
    nome: string;
    removeCategoria: (id: string, nome: string) => void;
}

export const Category = ({ id, nome, removeCategoria }: PropTypes) => {
    const nome_categoria_style = { color: "#424242" };
    const btn_style = { padding: { xs: 1.8 } };

    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const handleOpenDialog = () => {
        setOpenDialog(true); 
    };

    return (
        <div className={styles.categoria}>
            <div className={styles.categoria_info}>
                <Typography variant="body1" component="p" sx={ nome_categoria_style }>
                    { nome }
                </Typography>
            </div>
            <Button sx={ btn_style } onClick={ handleOpenDialog } type="submit" variant="contained" color="secondary" disableElevation><DeleteIcon /></Button>
            <CategoryConfirmDialog openDialog={ openDialog } setOpenDialog={ setOpenDialog } id={ id } nome={ nome } removeCategoria={ removeCategoria } />
        </div>
    )
}