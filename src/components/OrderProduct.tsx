import Typography from "@mui/material/Typography";
import styles from "./css/Order.module.css";

type PropTypes = {
    categoria: string;
    nome: string;
    preco: number;
    quantidade: number;
}

export const OrderProduct = ({ categoria, nome, preco, quantidade }: PropTypes) => {
    return (
        <div className={styles.produto}>
            <Typography variant="body2" component="p">
                Categoria: { categoria.toLocaleLowerCase() }
            </Typography>
            <Typography variant="body2" component="p">
                Nome: { nome.toLocaleLowerCase() }
            </Typography>
            <Typography variant="body2" component="p">
                Preço: { preco.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) }
            </Typography>
            <Typography variant="body2" component="p">
                Quantidade: { quantidade }
            </Typography>
        </div>
    )
}