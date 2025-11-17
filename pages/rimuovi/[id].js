import Header from "../../components/Header";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Rimuovi() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => { if (id) removeProdotto(); }, [id]);

  async function removeProdotto() {
    await supabase.from("prodotti").delete().eq("id", id);
    router.push("/prodotti");
  }

  if (!id) return (
    <>
      <Header />
      <div className="container">Caricamento...</div>
    </>
  );

  return (
    <>
      <Header />
      <div className="container">
        <h2>Rimuovendo prodotto...</h2>
      </div>
    </>
  );
}
