import Header from "../components/Header";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <Header />
            <div className="container">
                <div className="card shadow p-4">
                    <h1 className="mb-4">Inventario Casa</h1>
                    <p>Gestisci prodotti, lotti e scorte in modo semplice.</p>

                    <Link href="/prodotti" className="btn btn-primary me-2">Vedi Prodotti</Link>
                    <Link href="/aggiungi" className="btn btn-success">Aggiungi</Link>
                </div>
            </div>
        </>
    );
}
