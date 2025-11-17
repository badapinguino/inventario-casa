import Header from "../components/Header";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Prodotti() {
  const [prodotti, setProdotti] = useState([]);

  useEffect(() => {
    loadProdotti();
  }, []);

  async function loadProdotti() {
    const { data } = await supabase.from("v_inventario").select("*").order("nome");
    setProdotti(data || []);
  }

  return (
    <>
      <Header />
      <div className="container">
        <h2>Inventario Prodotti</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Marca</th>
              <th>Quantità Totale</th>
              <th>Prossima Scadenza</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {prodotti.map(p => (
              <tr key={p.prodotto_id}>
                <td>{p.nome}</td>
                <td>{p.marca}</td>
                <td>{p.quantita_totale}</td>
                <td>{p.prossima_scadenza || "-"}</td>
                <td>
                  <Link href={`/modifica-prodotto/${p.prodotto_id}`} className="btn btn-sm btn-primary me-2">Modifica</Link>
                  <Link href={`/rimuovi/${p.prodotto_id}`} className="btn btn-sm btn-danger">Rimuovi</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
