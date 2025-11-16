import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Header from "../components/Header";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Aggiungi() {
  const [prodotti, setProdotti] = useState([]);
  const [selectedProdottoId, setSelectedProdottoId] = useState("");
  const [quantita, setQuantita] = useState(1);
  const [scadenza, setScadenza] = useState("");
  const [nuovoNome, setNuovoNome] = useState("");
  const [nuovaMarca, setNuovaMarca] = useState("");
  const [nuovaCategoria, setNuovaCategoria] = useState("");
  const [nuovaSottocategoria, setNuovaSottocategoria] = useState("");
  const [nuovoFormato, setNuovoFormato] = useState("");

  useEffect(() => {
    fetchProdotti();
  }, []);

  const fetchProdotti = async () => {
    const { data } = await supabase.from("prodotti").select("*").order("nome");
    setProdotti(data);
  };

  const aggiungiLotto = async () => {
    if (selectedProdottoId === "nuovo") {
      // Aggiungi nuovo prodotto
      const { data: newProd, error: errProd } = await supabase
        .from("prodotti")
        .insert([{
          nome: nuovoNome,
          marca: nuovaMarca,
          categoria: nuovaCategoria,
          sottocategoria: nuovaSottocategoria,
          formato: nuovoFormato
        }])
        .select();
      if (errProd) { alert(errProd.message); return; }
      const prodottoId = newProd[0].id;
      await supabase.from("lotti").insert([{
        prodotto_id: prodottoId,
        quantita: parseInt(quantita),
        data_scadenza: scadenza
      }]);
      alert("Nuovo prodotto e lotto aggiunti!");
      fetchProdotti();
      return;
    }

    // Controlla se esiste un lotto con stessa scadenza
    const lottoEsistente = await supabase
      .from("lotti")
      .select("*")
      .eq("prodotto_id", selectedProdottoId)
      .eq("data_scadenza", scadenza)
      .single();

    if (lottoEsistente.data) {
      // Aggiorna quantità lotto esistente
      await supabase
        .from("lotti")
        .update({ quantita: lottoEsistente.data.quantita + parseInt(quantita) })
        .eq("id_lotto", lottoEsistente.data.id_lotto);
      alert("Quantità lotto aggiornata!");
    } else {
      // Aggiungi nuovo lotto
      await supabase.from("lotti").insert([{
        prodotto_id: selectedProdottoId,
        quantita: parseInt(quantita),
        data_scadenza: scadenza
      }]);
      alert("Nuovo lotto aggiunto!");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <Header />
      <h1 style={{ textAlign: "center", margin: "1rem 0" }}>Aggiungi Lotto / Nuovo Prodotto</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label>Seleziona Prodotto Esistente o Aggiungi Nuovo:</label>
        <select value={selectedProdottoId} onChange={e => setSelectedProdottoId(e.target.value)}>
          <option value="">-- Seleziona Prodotto --</option>
          {prodotti.map(p => (
            <option key={p.id} value={p.id}>{p.nome} | {p.marca} | {p.formato}</option>
          ))}
          <option value="nuovo">-- Nuovo Prodotto --</option>
        </select>

        {selectedProdottoId === "nuovo" && (
          <>
            <input placeholder="Nome" value={nuovoNome} onChange={e => setNuovoNome(e.target.value)} />
            <input placeholder="Marca" value={nuovaMarca} onChange={e => setNuovaMarca(e.target.value)} />
            <input placeholder="Categoria" value={nuovaCategoria} onChange={e => setNuovaCategoria(e.target.value)} />
            <input placeholder="Sottocategoria" value={nuovaSottocategoria} onChange={e => setNuovaSottocategoria(e.target.value)} />
            <input placeholder="Formato" value={nuovoFormato} onChange={e => setNuovoFormato(e.target.value)} />
          </>
        )}

        <input type="number" placeholder="Quantità" value={quantita} onChange={e => setQuantita(e.target.value)} />
        <input type="date" value={scadenza} onChange={e => setScadenza(e.target.value)} />

        <button
          onClick={aggiungiLotto}
          style={{ padding: "0.5rem 1rem", marginTop: "1rem", background: "#4caf50", color: "white", border: "none", cursor: "pointer" }}
        >
          Aggiungi
        </button>
      </div>
    </div>
  );
}
