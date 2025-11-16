import Header from "../components/Header";
import { supabase } from "../utils/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Inventario() {
    const [prodotti, setProdotti] = useState([]);
    const router = useRouter();

    useEffect(() => {
        loadInventario();
    }, []);

    async function loadInventario() {
        // Prendiamo i prodotti con i lotti
        const { data, error } = await supabase
            .from("v_inventario")
            .select(`
                prodotto_id,
                nome,
                marca,
                categoria,
                sottocategoria,
                formato,
                note,
                quantita_totale,
                prossima_scadenza
            `)
            .order("nome");

        if (error) {
            console.error(error);
        } else {
            setProdotti(data);
        }
    }

    async function removeLotto(lotto_id) {
        if (!confirm("Sei sicuro di voler rimuovere questo lotto?")) return;
        const { error } = await supabase.from("lotti").delete().eq("id_lotto", lotto_id);
        if (error) console.error(error);
        else loadInventario();
    }

    function modificaLotto(prodId, lottoId) {
        router.push(`/modifica/${prodId}?lotto=${lottoId}`);
    }

    function modificaProdotto(prodId) {
        router.push(`/modifica-prodotto/${prodId}`);
    }

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h2>Inventario</h2>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Marca</th>
                            <th>Categoria</th>
                            <th>Formato</th>
                            <th>Note</th>
                            <th>Quantità Totale</th>
                            <th>Prossima Scadenza</th>
                            <th>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prodotti.map(prod => (
                            <tr key={prod.prodotto_id}>
                                <td>{prod.nome}</td>
                                <td>{prod.marca}</td>
                                <td>{prod.categoria}</td>
                                <td>{prod.formato}</td>
                                <td>{prod.note}</td>
                                <td>{prod.quantita_totale}</td>
                                <td>{prod.prossima_scadenza?.toString() || "-"}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-1" onClick={() => modificaProdotto(prod.prodotto_id)}>
                                        Modifica Prodotto
                                    </button>
                                    <button className="btn btn-sm btn-warning me-1" onClick={() => router.push(`/lotti/${prod.prodotto_id}`)}>
                                        Gestisci Lotti
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
