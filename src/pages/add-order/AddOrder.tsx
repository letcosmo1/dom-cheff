import Select, { SelectChangeEvent } from "@mui/material/Select";
import styles from "./AddOrder.module.css";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import Typography from "@mui/material/Typography";
import { AddOrderPageProduct } from "../../components/AddOrderPageProduct";
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { useState } from "react";
import { FinalizeDialog } from "../../components/FinalizeDialog";
import { Categoria, LucroDia, LucroMes, Produto, ProdutoQuantidade, VendaDia, VendaMes } from "../../utils/Typesss";
import MenuItem from "@mui/material/MenuItem";
import { toastMsg } from "../../utils/Toasts";
import { getDate, getMonth, getMonthWeek, getTime, getWeek } from "../../utils/DateFormat";
import { addDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { lucros_dia_ref, lucros_mes_ref, lucros_semana_ref, pedidos_ref, vendas_dia_ref, vendas_mes_ref, vendas_semana_ref } from "../../utils/Collections";
import { db } from "../../services/Firebasess";

type PropTypes = {
    categorias: Categoria[];
    produtos: Produto[];
    vendasMes: VendaMes[];
    setVendasMes: React.Dispatch<React.SetStateAction<VendaMes[]>>;
    lucrosMes: LucroMes[];
    setLucrosMes: React.Dispatch<React.SetStateAction<LucroMes[]>>;
    vendaDia: VendaDia[];
    setVendaDia: React.Dispatch<React.SetStateAction<VendaDia[]>>;
    lucroDia: LucroDia[];
    setLucroDia: React.Dispatch<React.SetStateAction<LucroDia[]>>;
}

export const AddOrder =
    ({
        categorias,
        produtos,
        vendasMes,
        setVendasMes,
        lucrosMes,
        setLucrosMes,
        vendaDia,
        setVendaDia,
        lucroDia,
        setLucroDia
    }: PropTypes) => {
        const select_style = { minWidth: { xs: "100%", md: 300 } };
        const numberfield_style = { width: { xs: "100%", md: 85 } };
        const btn_add_style = { padding: { xs: 1.8 } };
        const btn_finalizar_style = { width: { xs: "100%", md: 100 }, height: 50, padding: { xs: 3.3 } };

        const [openDialog, setOpenDialog] = useState<boolean>(false);
        const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("");
        const [produtoSelecionado, setProdutoSelecionado] = useState<string>("");
        const [quantidadeSelecionada, setQuantidadeSelecionada] = useState<number>();
        const [produtosCategoria, setProdutosCategoria] = useState<Produto[]>([]);
        const [produtosSelecionados, setProdutosSelecionados] = useState<ProdutoQuantidade[]>([]);
        const [total, setTotal] = useState<number>(0);
        const [totalFinal, setTotalFinal] = useState<number>(0);

        const handleOpenDialog = () => {
            if (total > 0) {
                setTotalFinal(total);
                setOpenDialog(true);
            } else {
                toastMsg("Adicione pelo menos um produto para finalizar o pedido.");
            }
        };
        const handleCategoriaChange = (e: SelectChangeEvent) => {
            const categoria = e.target.value;
            setCategoriaSelecionada(categoria);
            loadProdutos(categoria);
        };
        const loadProdutos = (categoria: string) => {
            setProdutoSelecionado("");
            setProdutosCategoria(produtos.filter((produto) => produto.categoria === categoria));
        }
        const handleProdutoChange = (e: SelectChangeEvent) => {
            setProdutoSelecionado(e.target.value);
        };
        const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setQuantidadeSelecionada(Number(e.target.value));
        }
        const addProduto = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            if (produtosSelecionados.find((produto) => produto.nome === produtoSelecionado) === undefined) {
                if (categoriaSelecionada && produtoSelecionado && quantidadeSelecionada) {
                    const preco = produtosCategoria.find((produto) => produto.nome === produtoSelecionado)?.preco;
                    const preco_verified = preco !== undefined ? preco : 0;
                    addProdutoTotal(preco_verified, quantidadeSelecionada);
                    setProdutosSelecionados([...produtosSelecionados, { categoria: categoriaSelecionada, nome: produtoSelecionado, preco: preco_verified, quantidade: quantidadeSelecionada }]);
                } else {
                    toastMsg("Todos os campos precisam ser preenchidos.");
                }
            } else {
                toastMsg("Esse produto já foi adicionado.");
            }
        };
        const removeProduto = (nome: string) => {
            removeProdutoTotal(nome);
            setProdutosSelecionados(produtosSelecionados.filter((produto) => produto.nome !== nome));
        }
        const addProdutoTotal = (preco: number, quantidade: number) => {
            let total: number = 0;
            produtosSelecionados.forEach((produto) => {
                total += (produto.preco * produto.quantidade);
            })
            total += (preco * quantidade);
            setTotal(total);
        };
        const changeProdutoTotal = (preco: number, quantidade: number, nova_quantidade: number) => {
            let total: number = 0;
            produtosSelecionados.forEach((produto) => {
                total += (produto.preco * produto.quantidade);
            })
            total -= (preco * quantidade);
            total += (preco * nova_quantidade);
            setTotal(total);
        }
        const removeProdutoTotal = (nome: string) => {
            let total: number = 0;
            produtosSelecionados.forEach((produto) => {
                if (produto.nome !== nome) {
                    total += (produto.preco * produto.quantidade);
                }
            })
            setTotal(total);
        }
        const addVenda = (descricao: string, preco: number, desconto: number) => {
            if (totalFinal > 0) {
                const date: string = getDate();
                const time: number = getTime();
                const month: string = getMonth();
                const month_week: string = getMonthWeek();
                const week: number = getWeek();
                addDoc(pedidos_ref, {
                    acrescimo: {
                        descricao: descricao,
                        preco: preco
                    },
                    desconto: desconto,
                    dia: date,
                    hora: time,
                    mes: month,
                    mes_semana: month_week,
                    produtos: produtosSelecionados,
                    total: totalFinal
                }).then(() => {
                    updateVendasDia(date, month, totalFinal);
                    updateVendasMes(month, totalFinal);
                    updateVendasSemana(month, month_week, week, totalFinal);
                })
                updateLucrosDia(date, month, totalFinal);
                updateLucrosMes(month, totalFinal);
                updateLucrosSemana(month, month_week, week, totalFinal); 
            }
        }
        const updateVendasDia = (date: string, month: string, valor: number) => {
            let docs: any[] = [];
            //query pra verificar se ja tem um doc do dia
            getDocs(query(vendas_dia_ref,  where("dia", "==", date))).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    docs.push({id: doc.id, ...doc.data()});
                });
                //se ja tiver um doc do dia some o total do pedido,
                //caso contrario crie um doc pro dia e adicione o total do pedido
                if(docs.length === 1) {
                    const doc_ref = doc(db, 'vendas_dia', docs[0].id);
                    updateDoc(doc_ref, { total: docs[0].total + valor});
                } else {
                    addDoc(vendas_dia_ref, { dia: date, mes: month, total: valor });
                }
            });
            const venda = vendaDia.find((venda) => venda.dia === date);
            if(venda === undefined) {
                setVendaDia([...vendaDia, { dia: date, mes: month, total: valor }]);
            } else {
                setVendaDia(vendaDia.map((venda) => {
                    if(venda.dia === date) venda.total += valor;
                    return venda;
                }));
            }
        }
        const updateVendasMes = (month: string, valor: number) => {
            let docs: any[] = [];
            getDocs(query(vendas_mes_ref,  where("mes", "==", month))).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    docs.push({id: doc.id, ...doc.data()});
                });
                if(docs.length === 1) {
                    const doc_ref = doc(db, 'vendas_mes', docs[0].id);
                    updateDoc(doc_ref, { total: docs[0].total + valor});
                } else {
                    addDoc(vendas_mes_ref, { mes: month, total: valor });
                }
            });
            const venda = vendasMes.find((venda) => venda.mes === month);
            if(venda === undefined) {
                setVendasMes([...vendasMes, { mes: month, total: valor }]);
            } else {
                setVendasMes(vendasMes.map((venda) => {
                    if(venda.mes === month) venda.total += valor;
                    return venda;
                }));
            }
        }
        const updateVendasSemana = (month: string, month_week: string, week: number, valor: number) => {
            let docs: any[] = [];
            getDocs(query(vendas_semana_ref,  where("mes_semana", "==", month_week))).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    docs.push({id: doc.id, ...doc.data()});
                });
                if(docs.length === 1) {
                    const doc_ref = doc(db, 'vendas_semana', docs[0].id);
                    updateDoc(doc_ref, { total: docs[0].total + valor});
                } else {
                    addDoc(vendas_semana_ref, { mes: month, mes_semana: month_week, semana: week, total: valor });
                }
            })
        }
        const updateLucrosDia = (date: string, month: string, valor: number) => {
            let docs: any[] = [];
            //query pra verificar se ja tem um doc do dia
            getDocs(query(lucros_dia_ref,  where("dia", "==", date))).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    docs.push({id: doc.id, ...doc.data()});
                });
                //se ja tiver um doc do dia some o total do pedido,
                //caso contrario crie um doc pro dia e adicione o total do pedido
                if(docs.length === 1) {
                    const doc_ref = doc(db, 'lucros_dia', docs[0].id);
                    updateDoc(doc_ref, { total: docs[0].total + valor});
                } else {
                    addDoc(lucros_dia_ref, { dia: date, mes: month, total: valor });
                }
            });
            const lucro = lucroDia.find((lucro) => lucro.dia === date);
            if(lucro === undefined) {
                setLucroDia([...lucroDia, { dia: date, mes: month, total: valor }]);
            } else {
                setLucroDia(lucroDia.map((lucro) => {
                    if(lucro.dia === date) lucro.total += valor;
                    return lucro;
                }));
            }
        }
        const updateLucrosMes = (month: string, valor: number) => {
            let docs: any[] = [];
            getDocs(query(lucros_mes_ref,  where("mes", "==", month))).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    docs.push({id: doc.id, ...doc.data()});
                });
                if(docs.length === 1) {
                    const doc_ref = doc(db, 'lucros_mes', docs[0].id);
                    updateDoc(doc_ref, { total: docs[0].total + valor});
                } else {
                    addDoc(lucros_mes_ref, { mes: month, total: valor });
                }
            });
            const lucro = lucrosMes.find((lucro) => lucro.mes === month);
            if(lucro === undefined) {
                setLucrosMes([...lucrosMes, { mes: month, total: valor }]);
            } else {
                setLucrosMes(lucrosMes.map((lucro) => {
                    if(lucro.mes === month) lucro.total += valor;
                    return lucro;
                }))
            }
        }
        const updateLucrosSemana = (month: string, month_week: string, week: number, valor: number) => {
            let docs: any[] = [];
            getDocs(query(lucros_semana_ref,  where("mes_semana", "==", month_week))).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    docs.push({id: doc.id, ...doc.data()});
                });
                if(docs.length === 1) {
                    const doc_ref = doc(db, 'lucros_semana', docs[0].id);
                    updateDoc(doc_ref, { total: docs[0].total + valor});
                } else {
                    addDoc(lucros_semana_ref, { mes: month, mes_semana: month_week, semana: week, total: valor });
                }
            });
        }

        return (
            <div className={styles.add_order_container}>
                <section className={styles.title_container}>
                    <Typography variant="h6" component="h2">
                        Adicionar Pedido
                    </Typography>
                </section>

                <div className={styles.main_box}>
                    <form className={styles.add_produtos_form}>
                        <FormControl variant="filled" sx={select_style}>
                            <InputLabel>Categoria</InputLabel>
                            <Select value={categoriaSelecionada} onChange={handleCategoriaChange}>
                                {categorias.map((categoria) => { return <MenuItem value={categoria.nome} key={categoria.nome}>{categoria.nome}</MenuItem> })}
                            </Select>
                        </FormControl>
                        <FormControl variant="filled" sx={select_style}>
                            <InputLabel>Produto</InputLabel>
                            <Select value={produtoSelecionado} onChange={handleProdutoChange}>
                                {produtosCategoria.map((produto) => { return <MenuItem value={produto.nome} key={produto.nome}>{produto.nome}</MenuItem> })}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Quantidade"
                            type="number"
                            variant="filled"
                            sx={numberfield_style}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            InputProps={{
                                inputProps: { min: 0 }
                            }}
                            onChange={(e) => handleQuantidadeChange(e)}
                        />
                        <Button sx={btn_add_style} type="submit" variant="contained" disableElevation onClick={(e) => addProduto(e)}><AddRoundedIcon /></Button>
                    </form>

                    <section className={produtosSelecionados.length > 0 ? styles.produtos_container : styles.hide_produtos_container}>
                        {produtosSelecionados.map((produto) => {
                            return <AddOrderPageProduct
                                key={produto.nome}
                                produtosSelecionados={produtosSelecionados}
                                setProdutosSelecionados={setProdutosSelecionados}
                                nome={produto.nome}
                                preco={produto.preco}
                                quantidade={produto.quantidade}
                                removeProduto={removeProduto}
                                changeProdutoTotal={changeProdutoTotal}
                            />
                        })}
                    </section>

                    <section className={produtosSelecionados.length > 0 ? styles.hide_message_container : styles.message_container}>
                        <Typography variant="h6" component="h3">
                            Adicione um produto para começar
                        </Typography>
                    </section>

                    <section className={styles.total_container}>
                        <Typography variant="h5" component="h3">
                            Total {total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}
                        </Typography>
                    </section>

                    <div className={styles.btn_finalizar}>
                        <Button title="Finalizar pedido" variant="contained" color="success" onClick={handleOpenDialog} sx={btn_finalizar_style} disableElevation><CheckRoundedIcon /></Button>
                    </div>
                </div>
                <FinalizeDialog
                    openDialog={openDialog}
                    setOpenDialog={setOpenDialog}
                    total={total}
                    totalFinal={totalFinal}
                    setTotalFinal={setTotalFinal}
                    setProdutosSelecionados={setProdutosSelecionados}
                    setTotal={setTotal}
                    addVenda={addVenda}
                />
            </div>
        )
    }