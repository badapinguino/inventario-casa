import Header from "../../components/Header";
import { getSupabaseClient } from "../../utils/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Modifica() {
  const router = useRouter();
  const { id } = router.query;
  const supabase = getSupabaseClient();

  const [prodotto, setProdotto] = useState(null);
  const [nome, setNome] = useState("");
  const [descrizione, setDescrizione] = useState("");

  useEffect(() => {
    if (id) loadProdotto();
  }, [id]);

  async function loadProdotto() {
    const { data } = await supabase.from("prodotti").select("*").eq("id", id).single();
    if (data) {
      setProdotto(data);
      setNome(data.nome);
      setDescrizione(data.descrizione);
    }
  }

  async function saveProdotto(e) {
    e.preventDefault();
    await supabase.from("prodotti").update({ nome, descrizione }).eq("id", id);
    alert("Prodotto aggiornato!");
    router.push("/prodotti");
  }

  return (
    <>
      <Header />
      <div className="container">
        <h2>Modifica Prodotto</h2>
        {prodotto ? (
          <form onSubmit={saveProdotto} className="card p-3">
            <input className="form-control mb-2" value={nome} onChange={e => setNome(e.target.value)} />
            <input className="form-control mb-2" value={descrizione} onChange={e => setDescrizione(e.target.value)} />
            <button className="btn btn-primary">Salva</button>
          </form>
        ) : <p>Caricamento...</p>}
      </div>
    </>
  );
}
