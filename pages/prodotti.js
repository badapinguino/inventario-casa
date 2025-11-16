import Header from "../components/Header";
import { getSupabaseClient } from "../utils/supabaseClient";
import { useEffect, useState } from "react";

export default function Prodotti() {
  const [supabase, setSupabase] = useState(null);
  const [prodotti, setProdotti] = useState([]);

  useEffect(() => {
    setSupabase(getSupabaseClient());
  }, []);

  useEffect(() => {
    if (supabase) loadProdotti();
  }, [supabase]);

  async function loadProdotti() {
    const { data } = await supabase.from("prodotti").select("*").order("nome");
    setProdotti(data || []);
  }

  return (
    <>
      <Header />
      <div className="container">
        <h2>Lista Prodotti</h2>
        <ul className="list-group">
          {prodotti.map(p => (
            <li key={p.id} className="list-group-item">{p.nome} - {p.descrizione}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
