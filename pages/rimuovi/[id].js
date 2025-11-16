import Header from "../../components/Header";
import { getSupabaseClient } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Rimuovi() {
  const router = useRouter();
  const { id } = router.query;

  const [supabase, setSupabase] = useState(null);
  const [prodotto, setProdotto] = useState(null);

  useEffect(() => {
    setSupabase(getSupabaseClient());
  }, []);

  useEffect(() => {
    if (supabase && id) loadProdotto();
  }, [supabase, id]);

  async function loadProdotto() {
    const { data } = await supabase.from("prodotti").select("*").eq("id", id).single();
    setProdotto(data);
  }

  async function eliminaProdotto() {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;
    await supabase.from("prodotti").delete().eq("id", id);
    alert("Prodotto rimosso!");
    router.push("/prodotti");
  }

  if (!prodotto) return <Header /><div className="container">Caricamento...</div>;

  return (
    <>
      <Header />
      <div className="container">
        <h2>Rimuovi Prodotto</h2>
        <p>{prodotto.nome} - {prodotto.descrizione}</p>
        <button className="btn btn-danger" onClick={eliminaProdotto}>Elimina</button>
      </div>
    </>
  );
}
