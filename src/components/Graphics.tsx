import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { dateTranslate } from "../utils/DateTranslatesss";


export const Graphics = () => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  var date = new Date();
  var month = Number(date.getMonth() + 1);
  var monthString = dateTranslate(month);

  const options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
        text: "Tabela",
      },
    },
    maintainAspectRatio: false
  };

  const labels = ["1", "2", "3", "4", "5", "6", "7"];
  const data = {
    labels: [monthString],
    datasets: [
      {
        label: "Vendas",
        data: labels.map(() => Math.floor(Math.random() * 100)),
        backgroundColor: "rgba(0, 19, 186, 0.8)",
        borderColor: "rgb(0, 19, 186)",
        borderWidth: 1,
      },
      {
        label: "A Receber",
        data: labels.map(() => Math.floor(Math.random() * 100)),
        backgroundColor: "rgba(44, 110, 5, 0.8)",
        borderColor: "rgb(44, 110, 5)",
        borderWidth: 1,
      },
      {
        label: "A Pagar",
        data: labels.map(() => Math.floor(Math.random() * 100)),
        backgroundColor: "rgb(186, 66, 19, 0.8)",
        borderColor: "rgb(186, 66, 19)",
        borderWidth: 1,
      },
    ],
    options: options,
  };

  return (
      <Bar data={data} data-testid="chart-container"/>
  );
};
