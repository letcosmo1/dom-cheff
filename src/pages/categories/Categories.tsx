import Typography from "@mui/material/Typography";
import styles from "./Categories.module.css";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { toastMsg } from "../../utils/Toasts";
import { Category } from "../../components/Category";
import { Categoria } from "../../utils/Typesss";
import { useState } from "react";
import { addDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { categorias_ref, produtos_ref } from "../../utils/Collections";
import { db } from "../../services/Firebase";

type PropTypes = {
    getCategorias: () => void;
    categorias: Categoria[];
    setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
}

export const Categories = ({ getCategorias, categorias, setCategorias }: PropTypes) => {
    const nome_textfield_style = { minWidth: 300, marginRight: { sx: 0, md: 3 } };
    const btn_style = { padding: { xs: 1.8 } }

    const [nome, setNome] = useState<string>("");

    const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNome(e.target.value);
    };
    const addCategoria = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if(categorias.find((categoria) => categoria.nome === nome) === undefined) {
            if(nome) {
                addDoc(categorias_ref, { nome }).then(() => {
                    getCategorias();
                    setNome("");
                });
            } else {
                toastMsg("Todos os campos precisam ser preenchidos.");
            }
        } else {
            toastMsg("Uma categoria com esse nome já existe.");
        }
    }; 
    const removeCategoria = (id: string, nome: string) => {
        setCategorias(categorias.filter((categoria) => categoria.nome !== nome));
        const doc_ref = doc(db, 'categorias', id);
        deleteDoc(doc_ref);
        removeProdutosbyCategoria(nome);
    }
    const removeProdutosbyCategoria = (nome_categoria: string) => {
        getDocs(query(produtos_ref, where("categoria", "==", nome_categoria))).then((snapshot) => {
            snapshot.docs.forEach((document) => {
                deleteDoc(doc(db, 'produtos', document.id));
            })
        });
    }

    return (
        <div className={ styles.categories_container }>
            <section className={ styles.title_container }>
                <Typography variant="h6" component="h2">
                    Categorias
                </Typography>
            </section>

            <div className={ styles.main_box }>
                <form className={ styles.add_categoria_form }>
                    <TextField
                        label="Nome da Categoria"
                        type="text"
                        variant="filled"
                        sx={ nome_textfield_style }
                        value={ nome }
                        onChange={ handleNomeChange }
                    />
                    <Button sx={ btn_style } onClick={ addCategoria } type="submit" variant="contained" disableElevation><AddRoundedIcon /></Button>
                </form>

                <section className={ styles.categorias_container }>
                    { categorias.map((categoria) => { 
                        return <Category 
                                    key={ categoria.id } 
                                    id={ categoria.id } 
                                    nome={ categoria.nome } 
                                    removeCategoria={ removeCategoria } 
                                /> }) }
                </section>
            </div>
        </div>
    )
}