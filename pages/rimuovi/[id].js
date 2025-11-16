import Header from "../../components/Header";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function RimuoviProdotto() {
  const router = useRouter();
  const { id } = router.query;
  const [prodotto, setProdotto] = useState(null);

  useEffect(() => {
    if (id) loadProdotto();
  }, [id]);

  async function loadProdotto() {
    const { data } = await supabase.from("prodotti").select("*").eq("id", id).single();
    setProdotto(data || {});
  }

  async function deleteProdotto() {
    if (!confirm("Sei sicuro di voler rimuovere questo prodotto?")) return;
    await supabase.from("prodotti").delete().eq("id", id);
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
        <h2>Rimuovi Prodotto</h2>
        <p>Nome: {prodotto.nome}</p>
        <p>Descrizione: {prodotto.descrizione}</p>
        <button className="btn btn-danger" onClick={deleteProdotto}>Elimina</button>
      </div>
    </>
  );
}
