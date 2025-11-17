import Header from "../../components/Header";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ModificaProdotto() {
  const router = useRouter();
  const { id } = router.query;
  const [prodotto, setProdotto] = useState(null);

  useEffect(() => { if (id) loadProdotto(); }, [id]);

  async function loadProdotto() {
    const { data } = await supabase.from("prodotti").select("*").eq("id", id).single();
    setProdotto(data);
  }

  async function saveChanges(e) {
    e.preventDefault();
    await supabase.from("prodotti").update({ nome: prodotto.nome, descrizione: prodotto.descrizione }).eq("id", id);
    alert("Prodotto aggiornato!");
    router.push("/prodotti");
  }

  if (!id || !prodotto) return (
    <>
      <Header />
      <div className="container">Caricamento...</div>
    </>
  );

  return (
    <>
      <Header />
      <div className="container">
        <h2>Modifica Prodotto</h2>
        <form onSubmit={saveChanges} className="card p-3">
          <input className="form-control mb-2" value={prodotto.nome} onChange={e => setProdotto({ ...prodotto, nome: e.target.value })} />
          <input className="form-control mb-2" value={prodotto.descrizione || ""} onChange={e => setProdotto({ ...prodotto, descrizione: e.target.value })} />
          <button className="btn btn-primary">Salva</button>
        </form>
      </div>
    </>
  );
}
