import Typography from "@mui/material/Typography";
import styles from "./Profit.module.css";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { LucroDia, LucroMes, LucroSemana, VendaMes, GastoMes } from "../../utils/Types";
import { getDocs, query, where } from "firebase/firestore";
import { gastos_dia_ref, gastos_semana_ref, lucros_dia_ref, lucros_semana_ref, vendas_dia_ref, vendas_semana_ref } from "../../utils/Collections";

type PropTypes = {
    lucrosMes: LucroMes[];
    gastosMes: GastoMes[];
    vendasMes: VendaMes[];
}

export const Profit = 
            ({ 
                lucrosMes,
                gastosMes,
                vendasMes, 
            }: PropTypes) => {
    const select_style = { width: { sx: "100%", md: 200 }, marginRight: { xs: 0, md: 3 }, marginBottom: { xs: 1, md: 0 } };
    const radiogroup_style = { display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", md: "row" } };

    const [viewType, setViewType] = useState<string>("Dia");
    const [mes, setMes] = useState<string>("");
    const [semana, setSemana] = useState<string>("");
    const [dia, setDia] = useState<string>("");
    const [lucrosSemanaMes, setLucrosSemanaMes] = useState<LucroSemana[]>([]);
    const [lucrosDiaMes, setLucrosDiaMes] = useState<LucroDia[]>([]);
    const [lucroSelecionado, setLucroSelecionado] = useState<number>(0);
    const [gastoSelecionado, setGastoSelecionado] = useState<number>(0);
    const [vendaSelecionada, setVendaSelecionada] = useState<number>(0);
    const [showLucroView, setShowLucroView] = useState<boolean>(false);

    const handleViewTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setViewType(e.target.value);
        setMes("");
        setSemana("");
        setDia("");
        setShowLucroView(false);
    };
    const handleMesChange = (e: SelectChangeEvent) => {
        const mes: string = e.target.value;
        setMes(mes);

        switch(viewType) {
            case "Mes":
                setShowLucroView(true);
                const lucro = lucrosMes.find((lucro) => lucro.mes === mes)?.total;
                setLucroSelecionado(lucro ? lucro : 0);
                const gasto = gastosMes.find((gasto) => gasto.mes === mes)?.total;
                setGastoSelecionado(gasto ? gasto : 0);
                const venda = vendasMes.find((venda) => venda.mes === mes)?.total;
                setVendaSelecionada(venda ? venda : 0);
                break;
            case "Semana":
                getLucrosSemana(mes);
                break;
            case "Dia":
                getLucrosDia(mes);
                break;
        }
    }
    const handleSemanaChange = (e: SelectChangeEvent) => {
        setShowLucroView(true);
        const semana: string = e.target.value;
        setSemana(semana);
        getLucrobySemana(semana);
        getGastobySemana(semana);
        getVendabySemana(semana);
    }
    const handleDiaChange = (e: SelectChangeEvent) => {
        setShowLucroView(true);
        const dia: string = e.target.value;
        setDia(dia);
        getLucrobyDia(dia);
        getGastobyDia(dia);
        getVendabyDia(dia);
    }
    //carregar selects
    const getLucrosSemana = (mes: string) => {
        getDocs(query(lucros_semana_ref, where("mes", "==", mes))).then((snapshot) => {
          const lucros_semana: any[] = [];
          snapshot.docs.forEach((doc) => {
              lucros_semana.push({ id: doc.id, ...doc.data() });
          });
          setLucrosSemanaMes(lucros_semana.filter((lucro) => lucro.mes === mes));
        });
    }
    const getLucrosDia = (mes: string) => {
        getDocs(query(lucros_dia_ref, where("mes", "==", mes))).then((snapshot) => {
          const lucros_dia: any[] = [];
          snapshot.docs.forEach((doc) => {
              lucros_dia.push({ id: doc.id, ...doc.data() });
          });
          setLucrosDiaMes(lucros_dia.filter((lucro) => lucro.mes === mes));
        });
    }

    //carregar dados
    const getLucrobySemana = (semana: string) => {
        getDocs(query(lucros_semana_ref, where("mes_semana", "==", semana))).then((snapshot) => {
            setLucroSelecionado(snapshot.docs[0].data().total);
        }).catch(() => {
            setLucroSelecionado(0);
        });
    }
    const getGastobySemana = (semana: string) => {
        getDocs(query(gastos_semana_ref, where("mes_semana", "==", semana))).then((snapshot) => {
            setGastoSelecionado(snapshot.docs[0].data().total);
        }).catch(() => {
            setGastoSelecionado(0);
        });
    }
    const getVendabySemana = (semana: string) => {
        getDocs(query(vendas_semana_ref, where("mes_semana", "==", semana))).then((snapshot) => {
            setVendaSelecionada(snapshot.docs[0].data().total);
        }).catch(() => {
            setVendaSelecionada(0);
        });
    }
    const getLucrobyDia = (dia: string) => {
        getDocs(query(lucros_dia_ref, where("dia", "==", dia))).then((snapshot) => {
            setLucroSelecionado(snapshot.docs[0].data().total);
        }).catch(() => {
            setLucroSelecionado(0);
        });
    }
    const getGastobyDia = (dia: string) => {
        getDocs(query(gastos_dia_ref, where("dia", "==", dia))).then((snapshot) => {
            setGastoSelecionado(snapshot.docs[0].data().total);
        }).catch(() => {
            setGastoSelecionado(0);
        });
    }
    const getVendabyDia = (dia: string) => {
        getDocs(query(vendas_dia_ref, where("dia", "==", dia))).then((snapshot) => {
            setVendaSelecionada(snapshot.docs[0].data().total);
        }).catch(() => {
            setVendaSelecionada(0);
        });
    }

    return (
        <div className={ styles.profits_container }>
            <section className={ styles.title_container }>
                <Typography variant="h6" component="h2">Lucro</Typography>
            </section>

            <div className={ styles.main_box }>
                <form className={ styles.day_week_form }>
                    <RadioGroup
                        row
                        sx={ radiogroup_style }
                        value={ viewType }
                        onChange={ handleViewTypeChange }
                    >
                        <FormControlLabel value="Dia" control={<Radio />} label="Dia" />
                        <FormControlLabel value="Semana" control={<Radio />} label="Semana" />
                        <FormControlLabel value="Mes" control={<Radio />} label="Mês" />
                    </RadioGroup>
                </form>

                <section className={ styles.lucro_container }>
                    <form className={ styles.month_form }>
                        <FormControl variant="filled" sx={ select_style }>
                            <InputLabel>Mês</InputLabel>
                            <Select value={ mes } onChange={ handleMesChange }>
                                {lucrosMes.map((lucro) => { return <MenuItem value={ lucro.mes } key={ lucro.mes }>{ lucro.mes }</MenuItem> })}
                            </Select>
                        </FormControl>
                        <div className={ viewType === "Semana" ? "" : styles.hide_select }>
                            <FormControl variant="filled" sx={ select_style } >
                                <InputLabel>Semana</InputLabel>
                                <Select value={ semana } onChange={ handleSemanaChange } >
                                    {lucrosSemanaMes.map((lucro) => { return <MenuItem value={ lucro.mes_semana } key={ lucro.semana }>{ lucro.semana }</MenuItem> })}
                                </Select>
                            </FormControl>
                        </div>
                        <div className={ viewType === "Dia" ? "" : styles.hide_select }>
                            <FormControl variant="filled" sx={ select_style } >
                                <InputLabel>Dia</InputLabel>
                                <Select value={ dia } onChange={ handleDiaChange }>
                                    {lucrosDiaMes.map((lucro) => { return <MenuItem value={ lucro.dia } key={ lucro.dia }>{ lucro.dia }</MenuItem> })}
                                </Select>
                            </FormControl>
                        </div>
                    </form>
                    <section className={ showLucroView ? styles.lucro_view : styles.hide_lucro_view }>
                        <div className={ styles.card }>
                            <Typography variant="h6" component="h3">Gastos</Typography>
                            <Typography variant="h5" component="p">-{ gastoSelecionado.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }</Typography>
                        </div>
                        <div className={ styles.card }>
                            <Typography variant="h6" component="h3">Vendas</Typography>
                            <Typography variant="h5" component="p">+{ vendaSelecionada.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }</Typography>
                        </div>
                        <div className={ styles.card }>
                            <Typography variant="h6" component="h3">Balança</Typography>
                            <Typography variant="h5" component="p">{ lucroSelecionado.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) }</Typography>
                        </div>
                    </section>
                </section>
            </div>
        </div>
    )
}