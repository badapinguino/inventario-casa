import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Header from "../components/Header";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Aggiungi() {
  const [prodotti, setProdotti] = useState([]);
  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState("");
  const [categoria, setCategoria] = useState("");
  const [sottocategoria, setSottocategoria] = useState("");
  const [formato, setFormato] = useState("");
  const [quantita, setQuantita] = useState(1);
  const [scadenza, setScadenza] = useState("");

  useEffect(() => {
    fetchProdotti();
  }, []);

  const fetchProdotti = async () => {
    let { data } = await supabase.from("prodotti").select("*").order("nome");
    setProdotti(data);
  };

  const aggiungiLotto = async () => {
    let prodottoId = prodotti.find(
      (p) => p.nome === nome && p.marca === marca
    )?.id;

    if (!prodottoId) {
      let { data: newProd, error } = await supabase
        .from("prodotti")
        .insert([{ nome, marca, categoria, sottocategoria, formato }])
        .select();
      if (error) {
        alert(error.message);
        return;
      }
      prodottoId = newProd[0].id;
      fetchProdotti();
    }

    const { error } = await supabase.from("lotti").insert([
      { prodotto_id: prodottoId, quantita: parseInt(quantita), data_scadenza: scadenza }
    ]);
    if (error) alert(error.message);
    else alert("Lotto aggiunto!");
  };

  return (
    <div>
      <Header />
      <h1>Aggiungi Lotto / Nuovo Prodotto</h1>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "400px" }}>
        <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
        <input placeholder="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)} />
        <input placeholder="Sottocategoria" value={sottocategoria} onChange={e => setSottocategoria(e.target.value)} />
        <input placeholder="Formato" value={formato} onChange={e => setFormato(e.target.value)} />
        <input type="number" placeholder="Quantità" value={quantita} onChange={e => setQuantita(e.target.value)} />
        <input type="date" value={scadenza} onChange={e => setScadenza(e.target.value)} />
        <button onClick={aggiungiLotto} style={{ marginTop: "1rem" }}>Aggiungi</button>
      </div>
    </div>
  );
}
