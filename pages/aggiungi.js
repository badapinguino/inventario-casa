import { useState, useEffect } from "react";
import Header from "../components/Header";
import { supabase } from "../utils/supabaseClient";

export default function Aggiungi() {
  const [prodotti, setProdotti] = useState([]);
  const [selected, setSelected] = useState("");
  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");
  const [quantita, setQuantita] = useState("");
  const [scadenza, setScadenza] = useState("");

  useEffect(() => {
    loadProdotti();
  }, []);

  async function loadProdotti() {
    const { data } = await supabase.from("prodotti").select("*").order("nome");
    setProdotti(data || []);
  }

  async function addProdotto(e) {
    e.preventDefault();
    await supabase.from("prodotti").insert([{ nome, descrizione }]);
    alert("Prodotto aggiunto!");
    setNome("");
    setDescrizione("");
    loadProdotti();
  }

  async function addLotto(e) {
    e.preventDefault();
    if (!selected) {
      alert("Seleziona un prodotto!");
      return;
    }
    await supabase.from("lotti").insert([{ prodotto_id: selected, quantita, data_scadenza: scadenza }]);
    alert("Lotto aggiunto!");
    setQuantita("");
    setScadenza("");
  }

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Aggiungi Prodotto</h2>
        <form onSubmit={addProdotto} className="card p-3 mb-4">
          <input className="form-control mb-2" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
          <input className="form-control mb-2" placeholder="Descrizione" value={descrizione} onChange={e => setDescrizione(e.target.value)} />
          <button className="btn btn-success">Aggiungi Prodotto</button>
        </form>

        <h2>Aggiungi Lotto</h2>
        <form onSubmit={addLotto} className="card p-3">
          <select className="form-select mb-2" onChange={e => setSelected(e.target.value)} value={selected}>
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
