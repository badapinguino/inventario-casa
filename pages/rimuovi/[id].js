import Header from "../../components/Header";
import { getSupabaseClient } from "../../utils/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Rimuovi() {
  const router = useRouter();
  const { id } = router.query;
  const supabase = getSupabaseClient();

  const [prodotto, setProdotto] = useState(null);

  useEffect(() => {
    if (id) loadProdotto();
  }, [id]);

  async function loadProdotto() {
    const { data } = await supabase.from("prodotti").select("*").eq("id", id).single();
    setProdotto(data);
  }

  async function deleteProdotto() {
    await supabase.from("prodotti").delete().eq("id", id);
    alert("Prodotto rimosso!");
    router.push("/prodotti");
  }

  return (
    <>
      <Header />
      <div className="container">
        <h2>Rimuovi Prodotto</h2>
        {prodotto ? (
          <>
            <p>Sei sicuro di voler rimuovere il prodotto <strong>{prodotto.nome}</strong>?</p>
            <button className="btn btn-danger" onClick={deleteProdotto}>Rimuovi</button>
          </>
        ) : <p>Caricamento...</p>}
      </div>
    </>
  );
}
