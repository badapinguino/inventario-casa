import Header from "../../components/Header";
import { supabase } from "../../utils/supabaseClient";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ModificaProdotto() {
    const router = useRouter();
    const { id } = router.query;

    const [nome, setNome] = useState("");
    const [marca, setMarca] = useState("");
    const [categoria, setCategoria] = useState("");
    const [sottocategoria, setSottocategoria] = useState("");
    const [formato, setFormato] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (id) loadProdotto();
    }, [id]);

    async function loadProdotto() {
        const { data } = await supabase.from("prodotti").select("*").eq("id", id).single();
        setNome(data.nome);
        setMarca(data.marca);
        setCategoria(data.categoria);
        setSottocategoria(data.sottocategoria);
        setFormato(data.formato);
        setNote(data.note);
    }

    async function updateProdotto(e) {
        e.preventDefault();
        await supabase.from("prodotti").update({
            nome, marca, categoria, sottocategoria, formato, note
        }).eq("id", id);
        alert("Prodotto aggiornato!");
        router.push("/inventario");
    }

    if (!id) return <Header /><div className="container">Caricamento...</div>;

    return (
        <>
            <Header />
            <div className="container mt-4">
                <h2>Modifica Prodotto</h2>
                <form onSubmit={updateProdotto} className="card p-3">
                    <input className="form-control mb-2" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
                    <input className="form-control mb-2" placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
                    <input className="form-control mb-2" placeholder="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)} />
                    <input className="form-control mb-2" placeholder="Sottocategoria" value={sottocategoria} onChange={e => setSottocategoria(e.target.value)} />
                    <input className="form-control mb-2" placeholder="Formato" value={formato} onChange={e => setFormato(e.target.value)} />
                    <textarea className="form-control mb-2" placeholder="Note" value={note} onChange={e => setNote(e.target.value)} />
                    <button className="btn btn-primary">Aggiorna Prodotto</button>
                </form>
            </div>
        </>
    );
}
