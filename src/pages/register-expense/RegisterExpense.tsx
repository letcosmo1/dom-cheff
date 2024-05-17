import styles from "./RegisterExpense.module.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useState } from "react";
import { GastoDia, GastoMes, LucroDia, LucroMes } from "../../utils/Types";
import { toastMsg, toastMsgSuccess } from "../../utils/Toasts";
import { getDate, getMonth, getMonthWeek, getTime, getWeek } from "../../utils/DateFormat";
import { addDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { gastos_dia_ref, gastos_mes_ref, gastos_ref, gastos_semana_ref, lucros_dia_ref, lucros_mes_ref, lucros_semana_ref } from "../../utils/Collections";
import { db } from "../../services/Firebase";

type PropTypes = {
  gastosMes: GastoMes[];
  setGastosMes: React.Dispatch<React.SetStateAction<GastoMes[]>>;
  lucrosMes: LucroMes[];
  setLucrosMes: React.Dispatch<React.SetStateAction<LucroMes[]>>;
  gastoDia: GastoDia[];
  setGastoDia: React.Dispatch<React.SetStateAction<GastoDia[]>>;
  lucroDia: LucroDia[];
  setLucroDia: React.Dispatch<React.SetStateAction<LucroDia[]>>;
}

export const RegisterExpense =
  ({
    gastosMes,
    setGastosMes,
    lucrosMes,
    setLucrosMes,
    gastoDia,
    setGastoDia,
    lucroDia,
    setLucroDia
  }: PropTypes) => {
    const title_style = { marginBottom: 4 };
    const descricao_style = { marginBottom: 3 };
    const valor_style = { marginBottom: 1.5 };
    const radiogroup_style = { marginBottom: 2, display: "flex", justifyContent: "space-between" };
    const btn_style = { width: { xs: "100%", md: 100 }, height: 45 };

    const [descricao, setDescricao] = useState<string>("");
    const [valor, setValor] = useState<number>(0);
    const [categoria, setCategoria] = useState<string>("Gasto fixo");

    const handleDescricaoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setDescricao(e.target.value);
    };
    const handleValorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValor(Number(e.target.value));
    };
    const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCategoria(e.target.value);
    };
    const resetForm = () => {
      setDescricao("");
      setValor(0);
      setCategoria("Gasto fixo");
    }
    const addGasto = () => {
      if (descricao && (valor > 0)) {
        const date: string = getDate();
        const time: number = getTime();
        const month: string = getMonth();
        const month_week: string = getMonthWeek();
        const week: number = getWeek();
        addDoc(gastos_ref, {
          dia: date,
          hora: time,
          mes: month,
          mes_semana: month_week,
          categoria: categoria,
          descricao: descricao,
          valor: valor
        }).then(() => {
          updateGastosDia(date, month, valor);
          updateGastosMes(month, valor);
          updateGastosSemana(month, month_week, week, valor);
        });
        updateLucrosDia(date, month, valor);
        updateLucrosMes(month, valor);
        updateLucrosSemana(month, month_week, week, valor);
        resetForm();
        toastMsgSuccess("Gasto registrado com sucesso.");
      } else {
        toastMsg("Todos os campos precisam ser preenchidos.");
      }
    }
    const updateGastosDia = (date: string, month: string, valor: number) => {
      let docs: any[] = [];
      //query pra verificar se ja tem um doc do dia
      getDocs(query(gastos_dia_ref, where("dia", "==", date))).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        //se ja tiver um doc do dia some o total do pedido,
        //caso contrario crie um doc pro dia e adicione o total do pedido
        if (docs.length === 1) {
          const doc_ref = doc(db, 'gastos_dia', docs[0].id);
          updateDoc(doc_ref, { total: docs[0].total + valor });
        } else {
          addDoc(gastos_dia_ref, { dia: date, mes: month, total: valor });
        }
      });
      const gasto = gastoDia.find((gasto) => gasto.dia === date);
      if (gasto === undefined) {
        setGastoDia([...gastoDia, { dia: date, mes: month, total: valor }]);
      } else {
        setGastoDia(gastoDia.map((gasto) => {
          if (gasto.dia === date) gasto.total += valor;
          return gasto;
        }));
      }
    }
    const updateGastosMes = (month: string, valor: number) => {
      let docs: any[] = [];
      getDocs(query(gastos_mes_ref, where("mes", "==", month))).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        if (docs.length === 1) {
          const doc_ref = doc(db, 'gastos_mes', docs[0].id);
          updateDoc(doc_ref, { total: docs[0].total + valor });
        } else {
          addDoc(gastos_mes_ref, { mes: month, total: valor });
        }
        setGastosMes(gastosMes.map((gasto) => {
          if (gasto.mes === month) gasto.total += valor;
          return gasto;
        }));
      })
    }
    const updateGastosSemana = (month: string, month_week: string, week: number, valor: number) => {
      let docs: any[] = [];
      getDocs(query(gastos_semana_ref, where("mes_semana", "==", month_week))).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        if (docs.length === 1) {
          const doc_ref = doc(db, 'gastos_semana', docs[0].id);
          updateDoc(doc_ref, { total: docs[0].total + valor });
        } else {
          addDoc(gastos_semana_ref, { mes: month, mes_semana: month_week, semana: week, total: valor });
        }
      })
    }
    const updateLucrosDia = (date: string, month: string, valor: number) => {
      let docs: any[] = [];
      //query pra verificar se ja tem um doc do dia
      getDocs(query(lucros_dia_ref, where("dia", "==", date))).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        //se ja tiver um doc do dia some o total do pedido,
        //caso contrario crie um doc pro dia e adicione o total do pedido
        if (docs.length === 1) {
          const doc_ref = doc(db, 'lucros_dia', docs[0].id);
          updateDoc(doc_ref, { total: docs[0].total - valor });
        } else {
          addDoc(lucros_dia_ref, { dia: date, mes: month, total: -valor });
        }
      });
      const lucro = lucroDia.find((lucro) => lucro.dia === date);
      if (lucro === undefined) {
        setLucroDia([...lucroDia, { dia: date, mes: month, total: -valor }]);
      } else {
        setLucroDia(lucroDia.map((lucro) => {
          if (lucro.dia === date) lucro.total -= valor;
          return lucro;
        }));
      }
    }
    const updateLucrosMes = (month: string, valor: number) => {
      let docs: any[] = [];
      getDocs(query(lucros_mes_ref, where("mes", "==", month))).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        if (docs.length === 1) {
          const doc_ref = doc(db, 'lucros_mes', docs[0].id);
          updateDoc(doc_ref, { total: docs[0].total - valor });
        } else {
          addDoc(lucros_mes_ref, { mes: month, total: -valor });
        }
      });
      const lucro = lucrosMes.find((lucro) => lucro.mes === month);
      if (lucro === undefined) {
        setLucrosMes([...lucrosMes, { mes: month, total: -valor }]);
      } else {
        setLucrosMes(lucrosMes.map((lucro) => {
          if (lucro.mes === month) lucro.total -= valor;
          return lucro;
        }))
      }
    }
    const updateLucrosSemana = (month: string, month_week: string, week: number, valor: number) => {
      let docs: any[] = [];
      getDocs(query(lucros_semana_ref, where("mes_semana", "==", month_week))).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          docs.push({ id: doc.id, ...doc.data() });
        });
        if (docs.length === 1) {
          const doc_ref = doc(db, 'lucros_semana', docs[0].id);
          updateDoc(doc_ref, { total: docs[0].total - valor });
        } else {
          addDoc(lucros_semana_ref, { mes: month, mes_semana: month_week, semana: week, total: -valor });
        }
      })
    }

    return (
      <div className={styles.register_expense_container}>
        <div className={styles.form_container}>
          <Typography sx={title_style} variant="h4" component="h2">Adicionar Gasto</Typography>
          <form noValidate>
            <TextField
              fullWidth
              sx={descricao_style}
              size="small"
              label="Descrição"
              variant="filled"
              value={descricao}
              onChange={handleDescricaoChange}
            />
            <TextField
              fullWidth
              sx={valor_style}
              size="small"
              label="Valor"
              variant="filled"
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                inputProps: { min: 0 }
              }}
              value={valor}
              onChange={handleValorChange}
            />
            <RadioGroup
              row
              sx={radiogroup_style}
              value={categoria}
              onChange={handleCategoriaChange}
            >
              <FormControlLabel value="Gasto fixo" control={<Radio />} label="Gasto fixo" />
              <FormControlLabel value="Gasto variável" control={<Radio />} label="Gasto variável" />
            </RadioGroup>
            <div className={styles.btn_container}>
              <Button sx={btn_style} onClick={addGasto} variant="contained"><CheckRoundedIcon /></Button>
            </div>
          </form>
        </div>
      </div>
    );
  };
