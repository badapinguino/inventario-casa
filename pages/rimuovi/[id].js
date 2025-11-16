import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import Header from "../../components/Header";

export default function RimuoviProdotto() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    removeProdotto();
  }, [id]);

  async function removeProdotto() {
    const confirmDelete = confirm("Vuoi eliminare completamente questo prodotto e tutti i suoi lotti?");
    if (!confirmDelete) {
      router.push("/prodotti");
      return;
    }
    await supabase.from("prodotti").delete().eq("id", id);
    router.push("/prodotti");
  }

  return <><Header /><div className="container mt-4">Eliminazione in corso...</div></>;
}
