import Image from "next/image";
import styles from "./page.module.css";
import Dnd from "@/components/dndboard/Dnd";



export default function Home() {
  return (
    <main className={styles.main}>
      <Dnd />
    </main>
  );
}
