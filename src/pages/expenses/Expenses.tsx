import Typography from "@mui/material/Typography";
import styles from "./Expenses.module.css";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { Expense } from "../../components/Expense";
import { useState } from "react";
import { Gasto, GastoDia, GastoMes, GastoSemana, LucroMes } from "../../utils/Types";
import MenuItem from "@mui/material/MenuItem";
import { deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { gastos_dia_ref, gastos_mes_ref, gastos_ref, gastos_semana_ref, lucros_dia_ref, lucros_mes_ref, lucros_semana_ref } from "../../utils/Collections";
import { db } from "../../services/firebase";

type PropTypes = {
    gastosMes: GastoMes[];
    setGastosMes: React.Dispatch<React.SetStateAction<GastoMes[]>>;
    lucrosMes: LucroMes[];
    setLucrosMes: React.Dispatch<React.SetStateAction<LucroMes[]>>;
}

export const Expenses = ({ gastosMes, setGastosMes, lucrosMes, setLucrosMes }: PropTypes) => {
    const select_style = { width: { sx: "100%", md: 200 }, marginRight: { xs: 0, md: 3 }, marginBottom: { xs: 1, md: 0 } };
    const radiogroup_style = { display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", md: "row" } };

    const [gastosSemana, setGastosSemana] = useState<GastoSemana[]>([]);
    const [gastosDia, setGastosDia] = useState<GastoDia[]>([]);

    const [viewType, setViewType] = useState<string>("Dia");
    const [mes, setMes] = useState<string>("");
    const [semana, setSemana] = useState<string>("");
    const [dia, setDia] = useState<string>("");
    const [gastosSelecionados, setGastosSelecionados] = useState<Gasto[]>([]);
    const [gastosSemanaMes, setGastosSemanaMes] = useState<GastoSemana[]>([]);
    const [gastosDiaMes, setGastosDiaMes] = useState<GastoDia[]>([]);
    const [total, setTotal] = useState<number>(0);

    const handleViewTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setViewType(e.target.value);
        setMes("");
        setSemana("");
        setDia("");
        setGastosSelecionados([]);
    };
    const handleMesChange = (e: SelectChangeEvent) => {
        const mes: string = e.target.value;
        setMes(mes);

        switch(viewType) {
            case "Mes":
                const total = gastosMes.find((gasto) => gasto.mes === mes)?.total;
                setTotal(total ? total : 0);
                getGastosbyMes(mes);
                break;
            case "Semana":
                setGastosSelecionados([]);
                getGastosSemana(mes);
                break;
            case "Dia":
                setGastosSelecionados([]);
                getGastosDia(mes);
                break;
        }
    }
    const handleSemanaChange = (e: SelectChangeEvent) => {
        const semana: string = e.target.value;
        setSemana(semana);
        getGastosbySemana(semana);
        const total = gastosSemana.find((gasto) => gasto.mes_semana === semana)?.total;
        setTotal(total ? total : 0);
    }
    const handleDiaChange = (e: SelectChangeEvent) => {
        const dia: string = e.target.value;
        setDia(dia);
        getGastosbyDia(dia);
        const total = gastosDia.find((gasto) => gasto.dia === dia)?.total;
        setTotal(total ? total : 0);
    }
    const getGastosSemana = (mes: string) => {
        getDocs(query(gastos_semana_ref, where("mes", "==", mes))).then((snapshot) => {
          const gastos_semana: any[] = [];
          snapshot.docs.forEach((doc) => {
              gastos_semana.push({ id: doc.id, ...doc.data() });
          });
          setGastosSemanaMes(gastos_semana.filter((gasto) => gasto.mes === mes));
          setGastosSemana(gastos_semana);
        });
    }
    const getGastosDia = (mes: string) => {
        getDocs(query(gastos_dia_ref, where("mes", "==", mes))).then((snapshot) => {
          const gastos_dia: any[] = [];
          snapshot.docs.forEach((doc) => {
              gastos_dia.push({ id: doc.id, ...doc.data() });
          });
          setGastosDiaMes(gastos_dia.filter((gasto) => gasto.mes === mes));
          setGastosDia(gastos_dia);
        });
    }
    const getGastosbyMes = (mes: string) => {
        getDocs(query(gastos_ref, where("mes", "==", mes))).then((snapshot) => {
            const gastos: any[] = [];
            snapshot.docs.forEach((doc) => {
                gastos.push({ id: doc.id, ...doc.data() });
            });
            setGastosSelecionados(gastos);
        }); 
    }
    const getGastosbySemana = (semana: string) => {
        getDocs(query(gastos_ref, where("mes_semana", "==", semana))).then((snapshot) => {
            const gastos: any[] = [];
            snapshot.docs.forEach((doc) => {
                gastos.push({ id: doc.id, ...doc.data() });
            });
            setGastosSelecionados(gastos);
        });
    }
    const getGastosbyDia = (dia: string) => {
        getDocs(query(gastos_ref, where("dia", "==", dia))).then((snapshot) => {
            const gastos: any[] = [];
            snapshot.docs.forEach((doc) => {
                gastos.push({ id: doc.id, ...doc.data() });
            });
            setGastosSelecionados(gastos);
        });
    }
    const removeGasto = (id: string) => {
        setGastosSelecionados(gastosSelecionados.filter((gasto) => gasto.id !== id));
        const doc_ref = doc(db, 'gastos', id);
        getDoc(doc_ref).then((snapshot) => {
            const gasto: any = { id: snapshot.id, ...snapshot.data() };
            updateGastoDia(gasto.dia, gasto.valor);
            updateGastoMes(gasto.mes, gasto.valor);
            updateGastoSemana(gasto.mes_semana, gasto.valor);
            updateLucroDia(gasto.dia, gasto.valor);
            updateLucroMes(gasto.mes, gasto.valor);
            updateLucroSemana(gasto.mes_semana, gasto.valor);
            deleteDoc(doc_ref);
        })
    }
    const updateGastoDia = (date: string, valor: number) => {
        let docs: any[] = [];
        getDocs(query(gastos_dia_ref, where("dia", "==", date))).then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() });
          });
          if (docs.length === 1) {
            const doc_ref = doc(db, 'gastos_dia', docs[0].id);
            updateDoc(doc_ref, { total: docs[0].total - valor });
          }
        })
    }
    const updateGastoMes = (month: string, valor: number) => {
        let docs: any[] = [];
        getDocs(query(gastos_mes_ref, where("mes", "==", month))).then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() });
          });
          if (docs.length === 1) {
            const doc_ref = doc(db, 'gastos_mes', docs[0].id);
            updateDoc(doc_ref, { total: docs[0].total - valor });
            setGastosMes(gastosMes.map((gasto) => {
                if (gasto.mes === month) gasto.total -= valor;
                return gasto;
            }));
          }
        })
    }
    const updateGastoSemana = ( month_week: string, valor: number) => {
        let docs: any[] = [];
        getDocs(query(gastos_semana_ref, where("mes_semana", "==", month_week))).then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() });
          });
          if (docs.length === 1) {
            const doc_ref = doc(db, 'gastos_semana', docs[0].id);
            updateDoc(doc_ref, { total: docs[0].total - valor });
          }
        })
    }
    const updateLucroDia = (date: string, valor: number) => {
        let docs: any[] = [];
        getDocs(query(lucros_dia_ref, where("dia", "==", date))).then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() });
          });
          if (docs.length === 1) {
            const doc_ref = doc(db, 'lucros_dia', docs[0].id);
            updateDoc(doc_ref, { total: docs[0].total + valor });
          }
        });
    }
    const updateLucroMes = (month: string, valor: number) => {
        let docs: any[] = [];
        getDocs(query(lucros_mes_ref, where("mes", "==", month))).then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() });
          });
          if (docs.length === 1) {
            const doc_ref = doc(db, 'lucros_mes', docs[0].id);
            updateDoc(doc_ref, { total: docs[0].total + valor });

            const lucro = lucrosMes.find((lucro) => lucro.mes === month);
            if (!(lucro === undefined)) {
                setLucrosMes(lucrosMes.map((lucro) => {
                    if (lucro.mes === month) lucro.total += valor;
                    return lucro;
                }))
            }
          }
        });
    }
    const updateLucroSemana = (month_week: string, valor: number) => {
        let docs: any[] = [];
        getDocs(query(lucros_semana_ref, where("mes_semana", "==", month_week))).then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            docs.push({ id: doc.id, ...doc.data() });
          });
          if (docs.length === 1) {
            const doc_ref = doc(db, 'lucros_semana', docs[0].id);
            updateDoc(doc_ref, { total: docs[0].total + valor });
          }
        })
    }

    return (
        <div className={ styles.expenses_container }>
            <section className={ styles.title_container }>
                <Typography variant="h6" component="h2">Gastos</Typography>
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

                <section className={ styles.gastos_container }>
                    <form className={ styles.month_form }>
                        <FormControl variant="filled" sx={ select_style }>
                            <InputLabel>Mês</InputLabel>
                            <Select value={ mes } onChange={ handleMesChange }>
                                {gastosMes.map((gasto) => { return <MenuItem value={ gasto.mes } key={ gasto.mes }>{ gasto.mes }</MenuItem> })}
                            </Select>
                        </FormControl>
                        <div className={ viewType === "Semana" ? "" : styles.hide_select }>
                            <FormControl variant="filled" sx={ select_style } >
                                <InputLabel>Semana</InputLabel>
                                <Select value={ semana } onChange={ handleSemanaChange } >
                                    {gastosSemanaMes.map((gasto) => { return <MenuItem value={ gasto.mes_semana } key={ gasto.semana }>{ gasto.semana }</MenuItem> })}
                                </Select>
                            </FormControl>
                        </div>
                        <div className={ viewType === "Dia" ? "" : styles.hide_select }>
                            <FormControl variant="filled" sx={ select_style } >
                                <InputLabel>Dia</InputLabel>
                                <Select value={ dia } onChange={ handleDiaChange }>
                                    {gastosDiaMes.map((gasto) => { return <MenuItem value={ gasto.dia } key={ gasto.dia }>{ gasto.dia }</MenuItem> })}
                                </Select>
                            </FormControl>
                        </div>
                    </form>
                    {gastosSelecionados.map((gasto) => { return <Expense key={ gasto.id } id={ gasto.id } categoria={ gasto.categoria } descricao={ gasto.descricao } valor={ gasto.valor } data={ gasto.dia } removeGasto={ removeGasto } /> })}
                </section>
                <section className={ gastosSelecionados.length > 0 ? styles.total_container : styles.hide_total_container }>
                    <Typography variant="h5" component="h3">
                        Total { total.toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}) }
                    </Typography>
                </section>
            </div>
        </div>
    )
}