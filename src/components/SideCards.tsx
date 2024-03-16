import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styles from "./css/SideCards.module.css";

export const SideCards = () => {
  const users = [
    {
      name: "João",
      valor: "25.99",
    },
    { name: "Matheus", valor: "25.99" },
    {
      name: "Laura",
      valor: "25.99",
    },
    {
      name: "Maria",
      valor: "25.99",
    },
  ];

  return (
    <div className={styles.div_container} data-testid="div-container">
      <Card
        sx={{
          minWidth: 300,
        }}
        className={styles.card_One}
        data-testid="card-One"
      >
        <Typography
          className={styles.card_One_Title}
          sx={{
            fontSize: "25px",
            fontWeight: "bold",
            margin: 0,
            color: "#fff"
          }}
          gutterBottom
        >
          Útimas Vendas
        </Typography>
        <CardContent className={styles.card_One_Body}>
          <Typography>
            {users.map((user) => (
              <span key={user.name}>
                <span
                  style={{
                    whiteSpace: "pre-wrap",
                    display: "block",
                  }}
                >
                  {user.name} Efetuou uma venda de R${user.valor}
                </span>
                <br />
              </span>
            ))}
          </Typography>
        </CardContent>
      </Card>
      <Card
        sx={{
          minWidth: 300,
        }}
        className={styles.card_Two}
        data-testid="card-Two"
      >
        <Typography
          className={styles.card_Two_Title}
          sx={{
            fontSize: "25px",
            fontWeight: "bold",
            margin: 0,
            color: "#fff"
          }}
          gutterBottom
        >
          Útimos Gastos
        </Typography>
        <CardContent className={styles.card_Two_Body}>
          <Typography>
            {users.map((user) => (
              <span key={user.name}>
                <span
                  style={{
                    whiteSpace: "pre-wrap",
                    display: "block",
                  }}
                >
                  {user.name} Efetuou um gasto de R${user.valor}
                </span>
                <br />
              </span>
            ))}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};
