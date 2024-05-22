import styles from "./page.module.css";
import KanbanBoard from "@/components/allnewdnd/kanbanBoard";



export default function Home() {
  return (
    <main className={styles.main}>
      <KanbanBoard />
    </main>
  );
}
