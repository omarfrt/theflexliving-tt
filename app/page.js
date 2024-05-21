import Image from "next/image";
import styles from "./page.module.css";

import Boards from "@/components/test";

export default function Home() {
  return (
    <main className={styles.main}>
      <Boards />
    </main>
  );
}
