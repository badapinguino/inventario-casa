import Header from "../components/Header";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";

export default function Prodotti() {
    const [prodotti, setProdotti] = useState([]);

    useEffect(() => {
        loadProdotti();
    }, []);

    async function loadProdotti() {
        const { data } = await supabase.from("prodotti").select("*").order("nome");
        setProdotti(data);
    }

    return (
        <>
            <Header />
            <div className="container">
                <h1 className="mb-4">Prodotti</h1>

                <div className="list-group">
                    {prodotti.map(p => (
                        <div key={p.id} className="list-group-item d-flex justify-content-between">
                            <strong>{p.nome}</strong>
                            <span>{p.descrizione || "Nessuna descrizione"}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
