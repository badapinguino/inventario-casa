import Link from "next/link";

export default function Header() {
  return (
    <header style={{ padding: "1rem", background: "#f4f4f4" }}>
      <nav>
        <Link href="/">Inventario</Link> |{" "}
        <Link href="/aggiungi">Aggiungi</Link> |{" "}
        <Link href="/rimuovi">Rimuovi</Link> |{" "}
        <Link href="/prodotti">Prodotti</Link>
      </nav>
    </header>
  );
}
