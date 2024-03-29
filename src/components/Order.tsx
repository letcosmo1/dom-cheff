import styles from "./css/Order.module.css";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { OrderProduct } from "./OrderProduct";
import { ProdutoQuantidade } from "../utils/types";

type PropTypes = {
    date: string;
    time: number;
    total: number;
    desconto: number;
    acrescimo: {
        descricao: string;
        preco: number;
    }
    produtos: ProdutoQuantidade[];
} 

export const Order = ({ date, time, total, desconto, acrescimo, produtos }: PropTypes) => {
    const icon_style = { color: "#757575" };
    const divider_style = { backgroundColor: "#9e9e9e" };
    const active_divider_style = { backgroundColor: "#0013BA", height: 1.1 };

    const [pedidoView, setPedidoView] = useState<boolean>(false);

    const handlePedidoView = () => {
        setPedidoView(!pedidoView);
    }

    const getTime = () => {
        if(time > 99999) {
            return String(time);
        }
        return String(time).padStart(6, '0');
    }

    return (
        <div className={ styles.pedido }>
            <div className={ styles.pedido_preview } onClick={ handlePedidoView }>
                <Typography variant="body1" component="p">
                    { date }
                </Typography>
                <Typography variant="body1" component="p">
                    { getTime().slice(0, 2) }:{ getTime().slice(2, 4) }:{ getTime().slice(4) }
                </Typography>
                <Typography variant="body1" component="p">
                    { total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) }
                </Typography>
                <ArrowDropDownIcon sx={ icon_style } />
            </div>
            <Divider sx={ pedidoView ? active_divider_style : divider_style } />
            <div className={ pedidoView ? styles.pedido_info : styles.hide_pedido_info } >
                {produtos.map((produto) => { 
                    return <OrderProduct 
                                key={ produto.nome } 
                                categoria={ produto.categoria } 
                                nome={ produto.nome }
                                preco={ produto.preco }
                                quantidade={ produto.quantidade }
                            /> })}
                <Typography variant="body2" component="p">
                    Desconto: { desconto.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) }
                </Typography>
                <Typography variant="body2" component="p">
                    Acréscimo: { acrescimo.preco.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) }
                </Typography>
                <Typography variant="body2" component="p">
                    Descrição do acréscimo: { acrescimo.descricao.toLocaleLowerCase() }
                </Typography>
            </div>
        </div>
    )
}