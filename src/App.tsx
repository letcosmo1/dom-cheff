import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/Firebase";
import "react-toastify/ReactToastify.min.css";
import "./App.css";
import { LoginPage } from "./pages/login-page/LoginPage";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { LoadingScreen } from "./pages/loading-screen/LoadingScreen";
import { RegisterExpense } from "./pages/register-expense/RegisterExpense";
import { Navbar } from "./components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material";
import { AddOrder } from "./pages/add-order/AddOrder";
import { Categoria, GastoDia, GastoMes, LucroDia, LucroMes, Produto, VendaDia, VendaMes } from "./utils/Typesss";
import { Products } from "./pages/products/Products";
import { Expenses } from "./pages/expenses/Expenses";
import { Categories } from "./pages/categories/Categories";
import { Orders } from "./pages/orders/Orders";
import { Profit } from "./pages/profit/Profit";
import { getDocs, orderBy, query, where } from "firebase/firestore";
import { categorias_ref, gastos_dia_ref, gastos_mes_ref, lucros_dia_ref, lucros_mes_ref, produtos_ref, vendas_dia_ref, vendas_mes_ref } from "./utils/Collections";
import { getDate } from "./utils/DateFormat";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0013BA"
    },
    secondary: {
      main: "#eeeeee"
    }
  },
  typography: {
    body1: {
      color: "#000"
    },
    body2: {
      color: "#000"
    },
    h5: {
      color: "#000"  
    }
  }
});

export function App() {
  //global states
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [gastosMes, setGastosMes] = useState<GastoMes[]>([]);
  const [vendasMes, setVendasMes] = useState<VendaMes[]>([]);
  const [lucrosMes, setLucrosMes] = useState<LucroMes[]>([]);

  //dashboard-cards states
  const [vendaDia, setVendaDia] = useState<VendaDia[]>([{ id: "", dia: "", mes: "", total: 0 }]);
  const [gastoDia, setGastoDia] = useState<GastoDia[]>([{ id: "", dia: "", mes: "", total: 0 }]);
  const [lucroDia, setLucroDia] = useState<LucroDia[]>([{ id: "", dia: "", mes: "", total: 0 }]);

  const getVendaDia = () => {
    const date = getDate();
    getDocs(query(vendas_dia_ref, where("dia", "==", date))).then((snapshot) => {
      const venda: any = snapshot.docs[0];
      if(venda) {
        setVendaDia([{ id: venda.id, ...venda.data() }]);
      }
    });
  }
  const getGastoDia = () => {
    const date = getDate();
    getDocs(query(gastos_dia_ref, where("dia", "==", date))).then((snapshot) => {
      const gasto: any = snapshot.docs[0];
      if(gasto) {
        setGastoDia([{ id: gasto.id, ...gasto.data() }]);
      }
    });
  }
  const getLucroDia = () => {
    const date = getDate();
    getDocs(query(lucros_dia_ref, where("dia", "==", date))).then((snapshot) => {
      const lucro: any = snapshot.docs[0];
      if(lucro) {
        setLucroDia([{ id: lucro.id, ...lucro.data() }]);
      }
    });
  }

  //get data from db
  const getCategorias = () => {
    getDocs(query(categorias_ref, orderBy('nome'))).then((snapshot) => {
      const categorias: any[] = [];
      snapshot.docs.forEach((doc) => {
          categorias.push({ id: doc.id, ...doc.data() });
      });
      setCategorias(categorias);
    });
  }
  const getProdutos = () => {
    getDocs(query(produtos_ref, orderBy('nome'))).then((snapshot) => {
      const produtos: any[] = [];
      snapshot.docs.forEach((doc) => {
          produtos.push({ id: doc.id, ...doc.data() });
      });
      setProdutos(produtos);
    });
  }
  const getVendasMes = () => {
    getDocs(query(vendas_mes_ref, orderBy('mes'))).then((snapshot) => {
      const vendas_mes: any[] = [];
      snapshot.docs.forEach((doc) => {
          vendas_mes.push({ id: doc.id, ...doc.data() });
      });
      setVendasMes(vendas_mes);
    });
  }
  const getGastosMes = () => {
    getDocs(query(gastos_mes_ref, orderBy('mes'))).then((snapshot) => {
      const gastos_mes: any[] = [];
      snapshot.docs.forEach((doc) => {
          gastos_mes.push({ id: doc.id, ...doc.data() });
      });
      setGastosMes(gastos_mes);
    });
  }
  const getLucrosMes = () => {
    getDocs(query(lucros_mes_ref, orderBy('mes'))).then((snapshot) => {
      const lucros_mes: any[] = [];
      snapshot.docs.forEach((doc) => {
          lucros_mes.push({ id: doc.id, ...doc.data() });
      });
      setLucrosMes(lucros_mes);
    });
  }

  const [isLogged, setIsLogged] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getCategorias();
    getProdutos();
    getVendasMes();
    getGastosMes();
    getLucrosMes();
    getVendaDia();
    getLucroDia();
    getGastoDia();
  }, []);

  if (isLogged === null) return <LoadingScreen />;

  return (
    <div>
      <BrowserRouter>
        <main>
          {!isLogged ? (
            <div>
              <ThemeProvider theme={theme}>
                <Routes>
                  <Route path={"/"} element={<LoginPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </ThemeProvider>
            </div>
          ) : (
            <div>
              <ThemeProvider theme={theme}>
                <Navbar />
                <Routes>
                  <Route path={"/lucro"} element={
                    <Profit 
                      lucrosMes={ lucrosMes } 
                      gastosMes={ gastosMes } 
                      vendasMes={ vendasMes } 
                    />} />
                  <Route path={"/pedidos"} element={
                    <Orders 
                      vendasMes={ vendasMes } 
                    />} />
                  <Route path={"/categorias"} element={<Categories getCategorias={ getCategorias } categorias={ categorias }  setCategorias={ setCategorias }/>} />
                  <Route path={"/gastos"} element={<Expenses gastosMes={ gastosMes } setGastosMes={ setGastosMes } lucrosMes={ lucrosMes } setLucrosMes={ setLucrosMes }/>} />
                  <Route path={"/produtos"} element={<Products categorias={ categorias } produtos={ produtos } setProdutos={ setProdutos } />} />
                  <Route path={"/adicionar-pedido"} element={
                    <AddOrder 
                      categorias={ categorias } 
                      produtos={ produtos }
                      vendasMes={ vendasMes }
                      setVendasMes={ setVendasMes }
                      lucrosMes={ lucrosMes }
                      setLucrosMes={ setLucrosMes }
                      vendaDia={ vendaDia }
                      setVendaDia={ setVendaDia }
                      lucroDia={ lucroDia }
                      setLucroDia={ setLucroDia }
                    />} />
                  <Route path={"/cadastrar-gasto"} element={
                    <RegisterExpense 
                      gastosMes={ gastosMes }
                      setGastosMes={ setGastosMes }
                      lucrosMes={ lucrosMes }
                      setLucrosMes={ setLucrosMes }
                      gastoDia={ gastoDia }
                      setGastoDia={ setGastoDia }
                      lucroDia={ lucroDia }
                      setLucroDia={ setLucroDia }
                    />} />
                  <Route path={"/"} element={
                    <Dashboard 
                      lucrosMes={ lucrosMes }
                      vendasMes={ vendasMes }
                      gastosMes={ gastosMes }
                      vendaDia={ vendaDia }
                      gastoDia={ gastoDia }
                      lucroDia={ lucroDia }
                    />} />
                </Routes>
              </ThemeProvider>
            </div>
          )}
        </main>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}
