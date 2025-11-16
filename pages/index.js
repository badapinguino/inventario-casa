import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Header from "../components/Header";
import ProdottoList from "../components/ProdottoList";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Home() {
  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchInventario = async () => {
    const { data, error } = await supabase
      .from("v_inventario")
      .select("*")
      .order("nome");
    if (error) console.error(error);
    else setInventario(data);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: "0 auto", maxWidth: "900px" }}>
      <Header />
      <h1 style={{ textAlign: "center", margin: "1rem 0" }}>Inventario Casa</h1>
      <ProdottoList prodotti={inventario} />
    </div>
  );
}
