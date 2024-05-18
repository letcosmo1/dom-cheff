import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import styles from "./css/Cards.module.css"; 
import { GastoDia, GastoMes, LucroDia, LucroMes, VendaDia, VendaMes } from "../utils/Typesss";
import { getDate, getMonth } from "../utils/DateFormat";

type PropTypes = {
  lucrosMes: LucroMes[];
  gastosMes: GastoMes[];
  vendasMes: VendaMes[];
  vendaDia: VendaDia[];
  gastoDia: GastoDia[];
  lucroDia: LucroDia[];
}

export const Cards = ({ lucrosMes, gastosMes, vendasMes, vendaDia, gastoDia, lucroDia }: PropTypes) => {
  const dia: string = getDate();
  const mes: string = getMonth();

  return (
    <div className={styles.card_container} data-testid="card_container">
      <Grid container spacing={1} justifyContent={"center"}>
        <Card
          sx={{ minWidth: 250 }}
          className={styles.Cards}
          data-testid="card-One"
        >
          <CardContent className={styles.card_One}>
            <Typography
              sx={{ fontSize: 14, color: "var(--color-white)" }}
              color="text.secondary"
              gutterBottom
            >
              Total de Vendas
            </Typography>
            <Typography
              sx={{ color: "#fff" }}
              variant="h5"
              component="div"
              className={styles.card_One_body}
            >
              {
                vendaDia.find((venda) => venda.dia === dia)?.total ?
                vendaDia.find((venda) => venda.dia === dia)?.total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) :
                Number(0).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
              }
              <ShoppingCartIcon sx={{ width: "100px", height: "80px", color: "#fff" }} />
            </Typography>
          </CardContent>
          <div className={styles.card_One_final_container}>
            <Typography className={styles.card_One_final} sx={{ color: "#fff" }}>
              Total do Mês {
                vendasMes.find((venda) => venda.mes === mes)?.total ?
                vendasMes.find((venda) => venda.mes === mes)?.total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) :
                Number(0).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
              }
            </Typography>
          </div>
        </Card>
        <Card
          sx={{ minWidth: 250 }}
          className={styles.Cards}
          data-testid="card-Two"
        >
          <CardContent className={styles.card_Two}>
            <Typography
              sx={{ fontSize: 14, color: "var(--color-white)" }}
              color="text.secondary"
              gutterBottom
            >
              Total a Receber
            </Typography>
            <Typography
              variant="h5"
              component="div"
              className={styles.card_Two_body}
              sx={{ color: "#fff" }}
            >
              {
                lucroDia.find((lucro) => lucro.dia === dia)?.total ?
                lucroDia.find((lucro) => lucro.dia === dia)?.total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) :
                Number(0).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
              }
              <QueryStatsIcon sx={{ width: "100px", height: "80px", color: "#fff"  }} />
            </Typography>
          </CardContent>
          <div className={styles.card_Two_final_container}>
            <Typography className={styles.card_Two_final} sx={{ color: "#fff" }}>
              Total do Mês {
                lucrosMes.find((lucro) => lucro.mes === mes)?.total ?
                lucrosMes.find((lucro) => lucro.mes === mes)?.total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) :
                0
              }
            </Typography>
          </div>
        </Card>
        <Card
          sx={{ minWidth: 250 }}
          className={styles.Cards}
          data-testid="card-Three"
        >
          <CardContent className={styles.card_Three}>
            <Typography
              sx={{ fontSize: 14, color: "var(--color-white)" }}
              color="text.secondary"
              gutterBottom
            >
              Total a Pagar
            </Typography>
            <Typography
              variant="h5"
              component="div"
              className={styles.card_Three_body}
              sx={{ color: "#fff" }} 
            >
              {
                gastoDia.find((gasto) => gasto.dia === dia)?.total ?
                gastoDia.find((gasto) => gasto.dia === dia)?.total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) :
                Number(0).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})
              }
              <TrendingDownIcon sx={{ width: "100px", height: "80px", color: "#fff"  }} />
            </Typography>
          </CardContent>
          <div className={styles.card_Three_final_container}>
            <Typography className={styles.card_Three_final} sx={{ color: "#fff" }}>
              Total do Mês -{
                gastosMes.find((gasto) => gasto.mes === mes)?.total ?
                gastosMes.find((gasto) => gasto.mes === mes)?.total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) :
                0
              }
            </Typography>
          </div>
        </Card>
      </Grid>
    </div>
  );
};
