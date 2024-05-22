import Image from "next/image";
import styles from "./page.module.css";
import Dnd from "@/components/dndboard/Dnd";
import KanbanBoard from "@/components/allnewdnd/kanbanBoard";



export default function Home() {
  return (
    <main className={styles.main}>
      <KanbanBoard />
    </main>
  );
}
