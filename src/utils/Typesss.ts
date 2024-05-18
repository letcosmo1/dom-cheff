export type nameUser = String;
export type emailUser = String;
export type cpfUser = number;
export type imageUser = string;
export type Categoria = {
    id: string,
    nome: string
};
export type Produto = {
    id: string,
    categoria: string,
    nome: string,
    preco: number
}
export type ProdutoQuantidade = {
    categoria: string,
    nome: string,
    preco: number,
    quantidade: number
}
export type Acrescimo = {
    preco: number,
    descricao: string
}
export type Gasto = {
    id: string,
    dia: string,
    hora: number,
    mes: string,
    mes_semana: string,
    categoria: string,
    descricao: string,
    valor: number
}
export type GastoDia = {
    id?: string,
    dia: string,
    mes: string,
    total: number
}
export type GastoMes = {
    id: string,
    mes: string,
    total: number
}
export type GastoSemana = {
    id: string,
    mes: string,
    mes_semana: string,
    semana: number,
    total: number
}
export type Pedido = {
    id: string,
    acrescimo: {
        descricao: string,
        preco: number
    },
    desconto: number,
    dia: string,
    hora: number,
    mes: string,
    mes_semana: string,
    produtos: ProdutoQuantidade[],
    total: number
}
export type VendaDia = {
    id?: string,
    dia: string,
    mes: string,
    total: number
}
export type VendaMes = {
    id?: string,
    mes: string,
    total: number
}
export type VendaSemana = {
    id: string,
    mes: string,
    mes_semana: string,
    semana: number,
    total: number
}
export type LucroDia = {
    id?: string,
    dia: string,
    mes: string,
    total: number
}
export type LucroMes = {
    id?: string,
    mes: string,
    total: number
}
export type LucroSemana = {
    id: string,
    mes: string,
    mes_semana: string,
    semana: number,
    total: number
}