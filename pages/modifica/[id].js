import Header from "../../components/Header";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ModificaProdotto() {
  const router = useRouter();
  const { id } = router.query;
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

  async function saveModifica(e) {
    e.preventDefault();
    await supabase.from("prodotti").update({ nome, descrizione }).eq("id", id);
    alert("Prodotto modificato!");
    router.push("/prodotti");
  }

  if (!prodotto) return (
    <>
      <Header />
      <div className="container mt-4">Caricamento...</div>
    </>
  );

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Modifica Prodotto</h2>
        <form onSubmit={saveModifica} className="card p-3">
          <input className="form-control mb-2" value={nome} onChange={e => setNome(e.target.value)} />
          <input className="form-control mb-2" value={descrizione} onChange={e => setDescrizione(e.target.value)} />
          <button className="btn btn-primary">Salva Modifiche</button>
        </form>
      </div>
    </>
  );
}
