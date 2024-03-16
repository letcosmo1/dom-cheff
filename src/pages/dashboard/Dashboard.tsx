import styles from "./Dashboard.module.css";
import { Cards } from "../../components/Cards";
import { GastoDia, GastoMes, LucroDia, LucroMes, VendaDia, VendaMes } from "../../utils/types";

type PropTypes = {
  lucrosMes: LucroMes[];
  gastosMes: GastoMes[];
  vendasMes: VendaMes[];
  vendaDia: VendaDia[];
  gastoDia: GastoDia[];
  lucroDia: LucroDia[];
}

export const Dashboard = ({ lucrosMes, gastosMes, vendasMes, vendaDia, gastoDia, lucroDia }: PropTypes) => {
  return (
    <div className={styles.main_container} data-testid="main-container">
      <Cards lucrosMes={ lucrosMes } gastosMes={ gastosMes } vendasMes={ vendasMes } vendaDia={ vendaDia } gastoDia={ gastoDia } lucroDia={ lucroDia } />
      {/*
        <div className={styles.itens_container} data-testid="itens-container">
          <Graphics />
          <SideCards />
        </div> 
      */}
    </div>
  );
};
