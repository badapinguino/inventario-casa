import Header from "../../components/Header";
import { supabase } from "../../utils/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Lotti() {
    const router = useRouter();
    const { prodotto_id } = router.query;

    const [lotti, setLotti] = useState([]);
    const [prodotto, setProdotto] = useState(null);

    const [quantita, setQuantita] = useState("");
    const [dataScadenza, setDataScadenza] = useState("");

    useEffect(() => {
        if (prodotto_id) {
            loadProdotto();
            loadLotti();
        }
    }, [prodotto_id]);

    async function loadProdotto() {
        const { data } = await supabase.from("prodotti").select("*").eq("id", prodotto_id).single();
        setProdotto(data);
    }

    async function loadLotti() {
        const { data } = await supabase.from("lotti").select("*").eq("prodotto_id", prodotto_id).order("data_scadenza");
        setLotti(data);
    }

    async function addLotto(e) {
        e.preventDefault();
        await supabase.from("lotti").insert([{ prodotto_id, quantita, data_scadenza: dataScadenza }]);
        setQuantita("");
        setDataScadenza("");
        loadLotti();
    }

    async function removeLotto(id) {
        if (!confirm("Vuoi eliminare questo lotto?")) return;
        await supabase.from("lotti").delete().eq("id_lotto", id);
        loadLotti();
    }

    async function updateLotto(id, newQuantita, newData) {
        await supabase.from("lotti").update({ quantita: newQuantita, data_scadenza: newData }).eq("id_lotto", id);
        loadLotti();
    }

    if (!prodotto) return <Header /><div className="container">Caricamento...</div>;

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h2>Lotti di {prodotto.nome}</h2>

                <form onSubmit={addLotto} className="card p-3 mb-4">
                    <input type="number" className="form-control mb-2" placeholder="Quantità" value={quantita} onChange={e => setQuantita(e.target.value)} />
                    <input type="date" className="form-control mb-2" value={dataScadenza} onChange={e => setDataScadenza(e.target.value)} />
                    <button className="btn btn-success">Aggiungi Lotto</button>
                </form>

                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID Lotto</th>
                            <th>Quantità</th>
                            <th>Scadenza</th>
                            <th>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lotti.map(l => (
                            <tr key={l.id_lotto}>
                                <td>{l.id_lotto}</td>
                                <td>{l.quantita}</td>
                                <td>{l.data_scadenza}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-1" onClick={() => {
                                        const newQ = prompt("Nuova quantità", l.quantita);
                                        const newD = prompt("Nuova data scadenza", l.data_scadenza);
                                        if (newQ && newD) updateLotto(l.id_lotto, newQ, newD);
                                    }}>Modifica</button>
                                    <button className="btn btn-sm btn-danger" onClick={() => removeLotto(l.id_lotto)}>Rimuovi</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
