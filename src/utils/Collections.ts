import { collection } from "firebase/firestore";
import { db } from "../services/Firebase";

export const categorias_ref = collection(db, 'categorias');
export const produtos_ref = collection(db, 'produtos');

export const vendas_mes_ref = collection(db, 'vendas_mes');
export const vendas_semana_ref = collection(db, 'vendas_semana');
export const vendas_dia_ref = collection(db, 'vendas_dia');
export const pedidos_ref = collection(db, 'pedidos');

export const gastos_mes_ref = collection(db, 'gastos_mes');
export const gastos_semana_ref = collection(db, 'gastos_semana');
export const gastos_dia_ref = collection(db, 'gastos_dia');
export const gastos_ref = collection(db, 'gastos');

export const lucros_mes_ref = collection(db, 'lucros_mes');
export const lucros_semana_ref = collection(db, 'lucros_semana');
export const lucros_dia_ref = collection(db, 'lucros_dia');