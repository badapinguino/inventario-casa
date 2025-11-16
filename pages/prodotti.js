import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Header from "../components/Header";
import ProdottoList from "../components/ProdottoList";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Prodotti() {
  const [prodotti, setProdotti] = useState([]);

  useEffect(() => {
    fetchProdotti();
  }, []);

  const fetchProdotti = async () => {
    let { data } = await supabase.from("v_inventario").select("*").order("nome");
    setProdotti(data);
  };

  return (
    <div>
      <Header />
      <h1>Lista Prodotti</h1>
      <ProdottoList prodotti={prodotti} />
    </div>
  );
}
