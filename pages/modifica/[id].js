import Header from "../../components/Header";
import { getSupabaseClient } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Modifica() {
  const router = useRouter();
  const { id } = router.query;

  const [supabase, setSupabase] = useState(null);
  const [prodotto, setProdotto] = useState({ nome: "", descrizione: "" });

  useEffect(() => {
    setSupabase(getSupabaseClient());
  }, []);

  useEffect(() => {
    if (supabase && id) loadProdotto();
  }, [supabase, id]);

  async function loadProdotto() {
    const { data } = await supabase.from("prodotti").select("*").eq("id", id).single();
    if (data) setProdotto({ nome: data.nome, descrizione: data.descrizione });
  }

  async function salvaModifiche(e) {
    e.preventDefault();
    await supabase.from("prodotti").update({ nome: prodotto.nome, descrizione: prodotto.descrizione }).eq("id", id);
    alert("Modifica salvata!");
  }

  return (
    <>
      <Header />
      <div className="container">
        <h2>Modifica Prodotto</h2>
        <form onSubmit={salvaModifiche} className="card p-3">
          <input className="form-control mb-2" value={prodotto.nome} onChange={e => setProdotto({...prodotto, nome: e.target.value})} />
          <input className="form-control mb-2" value={prodotto.descrizione} onChange={e => setProdotto({...prodotto, descrizione: e.target.value})} />
          <button className="btn btn-primary">Salva Modifiche</button>
        </form>
      </div>
    </>
  );
}
