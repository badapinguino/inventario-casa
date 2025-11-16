import Header from "../components/Header";
import { getSupabaseClient } from "../utils/supabaseClient";
import { useEffect, useState } from "react";

export default function Aggiungi() {
  const [supabase, setSupabase] = useState(null);
  const [prodotti, setProdotti] = useState([]);
  const [selected, setSelected] = useState("");
  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [quantita, setQuantita] = useState("");
  const [scadenza, setScadenza] = useState("");

  useEffect(() => {
    // Creiamo il client solo lato client
    setSupabase(getSupabaseClient());
  }, []);

  useEffect(() => {
    if (supabase) loadProdotti();
  }, [supabase]);

  async function loadProdotti() {
    const { data } = await supabase.from("prodotti").select("*").order("nome");
    setProdotti(data || []);
  }

  async function addProdotto(e) {
    e.preventDefault();
    await supabase.from("prodotti").insert([{ nome, descrizione }]);
    alert("Prodotto aggiunto!");
    setNome(""); setDescrizione("");
    loadProdotti();
  }

  async function addLotto(e) {
    e.preventDefault();
    await supabase.from("lotti").insert([{ prodotto_id: selected, quantita, scadenza }]);
    alert("Lotto aggiunto!");
    setSelected(""); setQuantita(""); setScadenza("");
  }

  return (
    <>
      <Header />
      <div className="container">
        <h2>Aggiungi nuovo prodotto</h2>
        <form onSubmit={addProdotto} className="card p-3 mb-4">
          <input className="form-control mb-2" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
          <input className="form-control mb-2" placeholder="Descrizione" value={descrizione} onChange={e => setDescrizione(e.target.value)} />
          <button className="btn btn-success">Aggiungi Prodotto</button>
        </form>

        <h2>Aggiungi lotto</h2>
        <form onSubmit={addLotto} className="card p-3">
          <select className="form-select mb-2" value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="">Seleziona prodotto</option>
            {prodotti.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
          <input type="number" className="form-control mb-2" placeholder="Quantità" value={quantita} onChange={e => setQuantita(e.target.value)} />
          <input type="date" className="form-control mb-2" value={scadenza} onChange={e => setScadenza(e.target.value)} />
          <button className="btn btn-primary">Aggiungi Lotto</button>
        </form>
      </div>
    </>
  );
}
