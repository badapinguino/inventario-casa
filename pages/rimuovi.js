import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Header from "../components/Header";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Rimuovi() {
  const [lotti, setLotti] = useState([]);
  const [selectedLotto, setSelectedLotto] = useState("");
  const [quantita, setQuantita] = useState(1);

  useEffect(() => {
    fetchLotti();
  }, []);

  const fetchLotti = async () => {
    let { data } = await supabase
      .from("lotti")
      .select(`id_lotto, quantita, prodotto_id, prodotti!inner(nome, marca, formato)`)
      .order("id_lotto");
    setLotti(data);
  };

  const rimuoviQuantita = async () => {
    if (!selectedLotto) { alert("Seleziona un lotto"); return; }
    const lotto = lotti.find(l => l.id_lotto == selectedLotto);
    if (!lotto) return;

    const nuovaQuantita = lotto.quantita - parseInt(quantita);
    if (nuovaQuantita < 0) { alert("Quantità troppo alta"); return; }

    const { error } = await supabase
      .from("lotti")
      .update({ quantita: nuovaQuantita })
      .eq("id_lotto", lotto.id_lotto);
    if (error) alert(error.message);
    else alert("Quantità aggiornata!");
    fetchLotti();
  };

  return (
    <div>
      <Header />
      <h1>Rimuovi Quantità da un Lotto</h1>
      <div>
        <select onChange={e => setSelectedLotto(e.target.value)} value={selectedLotto}>
          <option value="">Seleziona Lotto</option>
          {lotti.map(l => (
            <option key={l.id_lotto} value={l.id_lotto}>
              {l.prodotti.nome} {l.prodotti.marca} {l.prodotti.formato} - Q.ta: {l.quantita}
            </option>
          ))}
        </select>
        <input type="number" value={quantita} onChange={e => setQuantita(e.target.value)} />
        <button onClick={rimuoviQuantita}>Rimuovi</button>
      </div>
    </div>
  );
}
