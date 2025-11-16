import { useState, useEffect } from "react";
import Header from "../components/Header";
import { supabase } from "../utils/supabaseClient";
import Link from "next/link";

export default function Prodotti() {
  const [prodotti, setProdotti] = useState([]);

  useEffect(() => {
    loadProdotti();
  }, []);

  async function loadProdotti() {
    const { data } = await supabase
      .from("v_inventario")
      .select("*")
      .order("nome");
    setProdotti(data || []);
  }

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Prodotti</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Quantità Totale</th>
              <th>Prossima Scadenza</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {prodotti.map(p => (
              <tr key={p.prodotto_id}>
                <td>{p.nome}</td>
                <td>{p.quantita_totale}</td>
                <td>{p.prossima_scadenza ? new Date(p.prossima_scadenza).toLocaleDateString() : "-"}</td>
                <td>
                  <Link href={`/modifica/${p.prodotto_id}`} className="btn btn-primary btn-sm me-2">Modifica</Link>
                  <Link href={`/rimuovi/${p.prodotto_id}`} className="btn btn-danger btn-sm">Rimuovi</Link>
                  <Link href={`/lotti/${p.prodotto_id}`} className="btn btn-secondary btn-sm ms-2">Lotti</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
