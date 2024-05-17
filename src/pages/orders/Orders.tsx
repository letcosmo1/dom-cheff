import styles from "./Orders.module.css";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { useState } from "react";
import {
  GastoDia,
  GastoSemana,
  Pedido,
  VendaDia,
  VendaMes,
  VendaSemana,
} from "../../utils/Types";
import MenuItem from "@mui/material/MenuItem";
import { Order } from "../../components/Order";
import { getDocs, query, where } from "firebase/firestore";
import {
  pedidos_ref,
  vendas_dia_ref,
  vendas_semana_ref,
} from "../../utils/Collections";

type PropTypes = {
  vendasMes: VendaMes[];
};

export const Orders = ({ vendasMes }: PropTypes) => {
  const select_style = {
    width: { sx: "100%", md: 200 },
    marginRight: { xs: 0, md: 3 },
    marginBottom: { xs: 1, md: 0 },
  };
  const radiogroup_style = {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: { xs: "column", md: "row" },
  };

  const [vendasSemana, setVendasSemana] = useState<VendaSemana[]>([]);
  const [vendasDia, setVendasDia] = useState<VendaDia[]>([]);

  const [viewType, setViewType] = useState<string>("Dia");
  const [mes, setMes] = useState<string>("");
  const [semana, setSemana] = useState<string>("");
  const [dia, setDia] = useState<string>("");
  const [pedidosSelecionados, setPedidosSelecionados] = useState<Pedido[]>([]);
  const [vendasSemanaMes, setVendasSemanaMes] = useState<GastoSemana[]>([]);
  const [vendasDiaMes, setVendasDiaMes] = useState<GastoDia[]>([]);
  const [total, setTotal] = useState<number>(0);

  const handleViewTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewType(e.target.value);
    setMes("");
    setSemana("");
    setDia("");
    setPedidosSelecionados([]);
  };
  const handleMesChange = (e: SelectChangeEvent) => {
    const mes: string = e.target.value;
    setMes(mes);

    switch (viewType) {
      case "Mes":
        const total = vendasMes.find((venda) => venda.mes === mes)?.total;
        setTotal(total ? total : 0);
        getPedidosbyMes(mes);
        break;
      case "Semana":
        setPedidosSelecionados([]);
        getVendasSemana(mes);
        break;
      case "Dia":
        setPedidosSelecionados([]);
        getVendasDia(mes);
        break;
    }
  };
  const handleSemanaChange = (e: SelectChangeEvent) => {
    const semana: string = e.target.value;
    setSemana(semana);
    getPedidosbySemana(semana);
    const total = vendasSemana.find(
      (venda) => venda.mes_semana === semana
    )?.total;
    setTotal(total ? total : 0);
  };
  const handleDiaChange = (e: SelectChangeEvent) => {
    const dia: string = e.target.value;
    setDia(dia);
    getPedidosbyDia(dia);
    const total = vendasDia.find((venda) => venda.dia === dia)?.total;
    setTotal(total ? total : 0);
  };
  const getVendasSemana = (mes: string) => {
    getDocs(query(vendas_semana_ref, where("mes", "==", mes))).then(
      (snapshot) => {
        const vendas_semana: any[] = [];
        snapshot.docs.forEach((doc) => {
          vendas_semana.push({ id: doc.id, ...doc.data() });
        });
        setVendasSemanaMes(vendas_semana.filter((venda) => venda.mes === mes));
        setVendasSemana(vendas_semana);
      }
    );
  };
  const getVendasDia = (mes: string) => {
    getDocs(query(vendas_dia_ref, where("mes", "==", mes))).then((snapshot) => {
      const vendas_dia: any[] = [];
      snapshot.docs.forEach((doc) => {
        vendas_dia.push({ id: doc.id, ...doc.data() });
      });
      setVendasDiaMes(vendas_dia.filter((venda) => venda.mes === mes));
      setVendasDia(vendas_dia);
    });
  };
  const getPedidosbyMes = (mes: string) => {
    getDocs(query(pedidos_ref, where("mes", "==", mes))).then((snapshot) => {
      const pedidos: any[] = [];
      snapshot.docs.forEach((doc) => {
        pedidos.push({ id: doc.id, ...doc.data() });
      });
      setPedidosSelecionados(pedidos);
    });
  };
  const getPedidosbySemana = (semana: string) => {
    getDocs(query(pedidos_ref, where("mes_semana", "==", semana))).then(
      (snapshot) => {
        const pedidos: any[] = [];
        snapshot.docs.forEach((doc) => {
          pedidos.push({ id: doc.id, ...doc.data() });
        });
        setPedidosSelecionados(pedidos);
      }
    );
  };
  const getPedidosbyDia = (dia: string) => {
    getDocs(query(pedidos_ref, where("dia", "==", dia))).then((snapshot) => {
      const pedidos: any[] = [];
      snapshot.docs.forEach((doc) => {
        pedidos.push({ id: doc.id, ...doc.data() });
      });
      setPedidosSelecionados(pedidos);
    });
  };

  return (
    <div className={styles.orders_container}>
      <section className={styles.title_container}>
        <Typography variant="h6" component="h2">
          Pedidos
        </Typography>
      </section>

      <div className={styles.main_box}>
        <form className={styles.day_week_form}>
          <RadioGroup
            row
            sx={radiogroup_style}
            value={viewType}
            onChange={handleViewTypeChange}
          >
            <FormControlLabel value="Dia" control={<Radio />} label="Dia" />
            <FormControlLabel
              value="Semana"
              control={<Radio />}
              label="Semana" 
            />
            <FormControlLabel value="Mes" control={<Radio />} label="Mês" />
          </RadioGroup>
        </form>

        <section className={styles.pedidos_container}>
          <form className={styles.month_form}>
            <FormControl variant="filled" sx={select_style}>
              <InputLabel>Mês</InputLabel>
              <Select value={mes} onChange={handleMesChange}>
                {vendasMes.map((venda) => {
                  return (
                    <MenuItem value={venda.mes} key={venda.mes}>
                      {venda.mes}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div className={viewType === "Semana" ? "" : styles.hide_select}>
              <FormControl variant="filled" sx={select_style}>
                <InputLabel>Semana</InputLabel>
                <Select value={semana} onChange={handleSemanaChange}>
                  {vendasSemanaMes.map((venda) => {
                    return (
                      <MenuItem value={venda.mes_semana} key={venda.semana}>
                        {venda.semana}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
            <div className={viewType === "Dia" ? "" : styles.hide_select}>
              <FormControl variant="filled" sx={select_style}>
                <InputLabel>Dia</InputLabel>
                <Select value={dia} onChange={handleDiaChange}>
                  {vendasDiaMes.map((venda) => {
                    return (
                      <MenuItem value={venda.dia} key={venda.dia}>
                        {venda.dia}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </form>
          {pedidosSelecionados.map((pedido) => {
            return (
              <Order
                key={pedido.hora}
                date={pedido.dia}
                time={pedido.hora}
                total={pedido.total}
                desconto={pedido.desconto}
                acrescimo={pedido.acrescimo}
                produtos={pedido.produtos}
              />
            );
          })}
        </section>
        <section
          className={
            setPedidosSelecionados.length > 0
              ? styles.total_container
              : styles.hide_total_container
          }
        >
          <Typography variant="h5" component="h3">
            Total{" "}
            {total.toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
          </Typography>
        </section>
      </div>
    </div>
  );
};
