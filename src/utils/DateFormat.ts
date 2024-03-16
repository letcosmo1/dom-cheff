//funcões de formatação de data
export const getDate = () => {
    const date = new Date();
    return date.toLocaleDateString("pt-BR");
};
export const getWeek = () => {
    const now = new Date();
    const one_jan = new Date(now.getFullYear(), 0, 9);
    return Math.ceil((((now.getTime() - one_jan.getTime()) / 86400000) + one_jan.getDay() + 1) / 7);
};
export const getMonth = () => {
    const date = new Date();
    return date.toLocaleDateString("pt-BR").slice(3);
};
export const getMonthWeek = () => {
    return getMonth() + " " + getWeek();
};
export const getTime = () => {
    const date = new Date();
    return Number(date.toLocaleTimeString("pt-BR").split(":").join(""));
};