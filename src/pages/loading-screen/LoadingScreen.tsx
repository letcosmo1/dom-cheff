import styles from "./LoadingScreen.module.css";

export const LoadingScreen = () => {
  return (
    <main className={styles.main_container}>
      <div className={styles.loader_container}>
        <div className={styles.loader}></div>
      </div>
    </main>
  );
};
