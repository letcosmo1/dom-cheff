import Typography from "@mui/material/Typography";
import styles from "./css/Expense.module.css";
import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';

type PropTypes = {
    id: string;
    categoria: string;
    descricao: string;
    valor: number;
    data: string;
    removeGasto: (id: string) => void;
}

export const Expense = ({ id, categoria, descricao, valor, data, removeGasto }: PropTypes) => {
    const categoria_style = { width: { md: 130 }, color: "#424242" };
    const descricao_style = { width: { md: 330 }, color: "#424242" };
    const valor_style = { width: { md: 120 }, color: "#424242" };
    const data_style = { width: { md: 90 }, color: "#424242" };
    const btn_style = { padding: { xs: 1.8 } };

    return (
        <div className={styles.gasto}>
            <div className={styles.gasto_info}>
                <Typography variant="body1" component="p" sx={ categoria_style }>
                    { categoria }
                </Typography>
                <Typography variant="body1" component="p" sx={ descricao_style }>
                    { descricao }
                </Typography>
                <Typography variant="body1" component="p" sx={ valor_style }>
                    { valor.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) }
                </Typography>
                <Typography variant="body1" component="p" sx={ data_style }>
                    { data }
                </Typography>
            </div>
            <Button onClick={ () => removeGasto(id) } sx={ btn_style } type="submit" variant="contained" color="secondary" disableElevation><DeleteIcon /></Button>
        </div>
    )
}