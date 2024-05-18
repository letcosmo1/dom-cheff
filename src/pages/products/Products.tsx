import Typography from "@mui/material/Typography";
import styles from "./Products.module.css";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import { Categoria, Produto } from "../../utils/Typesss";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import { ProductsPageProduct } from "../../components/ProductsPageProduct";
import { toastMsg, toastMsgSuccess } from "../../utils/Toasts";
import { produtos_ref } from "../../utils/Collections";
import { addDoc, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../services/Firebase";

type PropTypes = {
    categorias: Categoria[];
    produtos: Produto[];
    setProdutos: React.Dispatch<React.SetStateAction<Produto[]>>;
}

export const Products = ({ categorias, produtos, setProdutos }: PropTypes) => {
    const select_style = { minWidth: 300 };
    const nome_textfield_style = { minWidth: 300 };
    const numberfield_style = { width: { sx: "100%", md: 130 } };
    const btn_style = { padding: { xs: 1.8 } }

    const [categoriaSelecionadaAdd, setCategoriaSelecionadaAdd] = useState<string>("");
    const [categoriaSelecionadaSearch, setCategoriaSelecionadaSearch] = useState<string>("");
    const [nome, setNome] = useState<string>("");
    const [preco, setPreco] = useState<number>(0);
    const [produtosCategoria, setProdutosCategoria] = useState<Produto[]>([]);

    const handleCategoriaAddChange = (e: SelectChangeEvent) => {
        const categoria = e.target.value;
        setCategoriaSelecionadaAdd(categoria);
    };
    const handleCategoriaSearchChange = (e: SelectChangeEvent) => {
        const categoria = e.target.value;
        setCategoriaSelecionadaSearch(categoria);
        setProdutosCategoria(produtos.filter((produto) => produto.categoria === categoria));
    };
    const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNome(e.target.value);
    };
    const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPreco(Number(e.target.value));
    };
    const addProduto = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if(produtos.find((produto) => produto.nome === nome) === undefined) {
            if(nome && (preco > 0)) {
                setNome("");
                setPreco(0);
                //adiciona o produto no bd
                addDoc(produtos_ref, { categoria: categoriaSelecionadaAdd, nome, preco }).then(() => {
                    //obter id do produto adicionado e atualizar states
                    getDocs(query(produtos_ref, where("nome", "==", nome))).then((snapshot) => {
                        const id: string = snapshot.docs[0].id;
                        setProdutos([...produtos, { id: id, categoria: categoriaSelecionadaAdd, nome, preco }]);
                        const produtos_updated: Produto[] = [...produtos, { id: id, categoria: categoriaSelecionadaAdd, nome, preco }];
                        setProdutosCategoria(produtos_updated.filter((produto) => produto.categoria === categoriaSelecionadaSearch));
                    });
                });
                toastMsgSuccess("Produto adicionado com sucesso.");   
            } else {
                toastMsg("Todos os campos precisam ser preenchidos.");
            }
        } else {
            toastMsg("Um produto com esse nome já existe.");
        }
    }
    const removeProduto = (id: string, nome: string) => {
        const produtos_updated: Produto[] = produtos.filter((produto) => produto.nome !== nome);
        setProdutos(produtos.filter((produto) => produto.nome !== nome));
        setProdutosCategoria(produtos_updated.filter((produto) => produto.categoria === categoriaSelecionadaSearch));
        const doc_ref = doc(db, 'produtos', id);
        deleteDoc(doc_ref);
    }
    const updateProduto = (id: string, nome: string, updated_nome: string, updated_preco: number) => {
        const produtos_updated: Produto[] = produtos.map((produto) => {
            if(produto.nome === nome) {
                produto.nome = updated_nome;
                produto.preco = updated_preco;
            }
            return produto;
        });
        setProdutos(produtos.map((produto) => {
            if(produto.nome === nome) {
                produto.nome = updated_nome;
                produto.preco = updated_preco;
            }
            return produto;
        }));
        setProdutosCategoria(produtos_updated.filter((produto) => produto.categoria === categoriaSelecionadaSearch));
        const doc_ref = doc(db, 'produtos', id);
        updateDoc(doc_ref, { nome: updated_nome, preco: updated_preco });
    }

    return (
        <div className={ styles.products_container }>
            <section className={ styles.title_container }>
                <Typography variant="h6" component="h2">
                    Produtos
                </Typography>
            </section>

            <div className={ styles.main_box }>
                <form className={ styles.add_produto_form }>
                    <FormControl variant="filled" sx={ select_style }>
                        <InputLabel>Categoria</InputLabel>
                        <Select value={ categoriaSelecionadaAdd } onChange={ handleCategoriaAddChange }>
                            { categorias.map((categoria) => { return <MenuItem value={ categoria.nome } key={ categoria.nome }>{ categoria.nome }</MenuItem> }) }
                        </Select>
                    </FormControl>
                    <TextField
                        label="Nome do Produto"
                        type="text"
                        variant="filled"
                        sx={ nome_textfield_style }
                        value={ nome }
                        onChange={ handleNomeChange }
                    />
                    <TextField
                        label="Preço"
                        type="number"
                        variant="filled"
                        sx={ numberfield_style }
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                            inputProps: { min: 0 }
                        }}
                        value={ preco }
                        onChange={ handlePrecoChange }
                    />
                    <Button sx={ btn_style } onClick={ addProduto } type="submit" variant="contained" disableElevation><AddRoundedIcon /></Button>
                </form>

                <section className={ styles.produtos_container }>
                    <form className={ styles.categoria_form }>
                        <FormControl variant="filled" sx={ select_style }>
                            <InputLabel>Categoria</InputLabel>
                            <Select value={ categoriaSelecionadaSearch } onChange={ handleCategoriaSearchChange }>
                                { categorias.map((categoria) => { return <MenuItem value={ categoria.nome } key={ categoria.nome }>{ categoria.nome }</MenuItem> }) }
                            </Select>
                        </FormControl>
                    </form>
                    { produtosCategoria.map((produto) => { 
                        return <ProductsPageProduct
                                    key={ produto.id }
                                    id={ produto.id }
                                    nome={ produto.nome } 
                                    preco={ produto.preco } 
                                    removeProduto={ removeProduto } 
                                    updateProduto={ updateProduto } 
                                /> 
                        }) }
                </section>
            </div>
        </div>
    )
}