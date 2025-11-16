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
    const { data } = await supabase.from("prodotti").select("*").order("nome");
    setProdotti(data || []);
  }

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Lista Prodotti</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrizione</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {prodotti.map(p => (
              <tr key={p.id}>
                <td>{p.nome}</td>
                <td>{p.descrizione}</td>
                <td>
                  <Link href={`/modifica/${p.id}`} className="btn btn-warning btn-sm me-2">Modifica</Link>
                  <Link href={`/rimuovi/${p.id}`} className="btn btn-danger btn-sm">Rimuovi</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
