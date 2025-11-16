import Header from "../components/Header"
import { supabase } from "../utils/supabaseClient"
import { useEffect, useState } from "react"

export default function Aggiungi() {
  const [prodotti, setProdotti] = useState([])
  const [selected, setSelected] = useState("")

  const [nome, setNome] = useState("")
  const [marca, setMarca] = useState("")
  const [categoria, setCategoria] = useState("")
  const [sottocategoria, setSottocategoria] = useState("")
  const [formato, setFormato] = useState("")
  const [note, setNote] = useState("")

  const [quantita, setQuantita] = useState("")
  const [dataScadenza, setDataScadenza] = useState("")

  useEffect(() => {
    loadProdotti()
  }, [])

  async function loadProdotti() {
    const { data } = await supabase.from("prodotti").select("*").order("nome")
    setProdotti(data)
  }

  async function addProdotto(e) {
    e.preventDefault()
    await supabase.from("prodotti").insert([{ nome, marca, categoria, sottocategoria, formato, note }])
    alert("Prodotto aggiunto!")
    loadProdotti()
    setNome(""); setMarca(""); setCategoria(""); setSottocategoria(""); setFormato(""); setNote("")
  }

  async function addLotto(e) {
    e.preventDefault()
    if (!selected) return alert("Seleziona un prodotto")
    await supabase.from("lotti").insert([{ prodotto_id: selected, quantita: parseInt(quantita), data_scadenza: dataScadenza || null }])
    alert("Lotto aggiunto!")
    setQuantita(""); setDataScadenza("")
  }

  return (
    <>
      <Header />
      <div className="container">
        <h2>Aggiungi prodotto</h2>
        <form onSubmit={addProdotto} className="card p-3 mb-4">
          <input className="form-control mb-2" placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} required />
          <input className="form-control mb-2" placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
          <input className="form-control mb-2" placeholder="Categoria" value={categoria} onChange={e => setCategoria(e.target.value)} />
          <input className="form-control mb-2" placeholder="Sottocategoria" value={sottocategoria} onChange={e => setSottocategoria(e.target.value)} />
          <input className="form-control mb-2" placeholder="Formato" value={formato} onChange={e => setFormato(e.target.value)} />
          <input className="form-control mb-2" placeholder="Note" value={note} onChange={e => setNote(e.target.value)} />
          <button className="btn btn-success">Aggiungi Prodotto</button>
        </form>

        <h2>Aggiungi lotto</h2>
        <form onSubmit={addLotto} className="card p-3">
          <select className="form-select mb-2" onChange={e => setSelected(e.target.value)} value={selected}>
            <option value="">Seleziona prodotto</option>
            {prodotti.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </select>
          <input type="number" className="form-control mb-2" placeholder="Quantità" value={quantita} onChange={e => setQuantita(e.target.value)} required />
          <input type="date" className="form-control mb-2" value={dataScadenza} onChange={e => setDataScadenza(e.target.value)} />
          <button className="btn btn-primary">Aggiungi Lotto</button>
        </form>
      </div>
    </>
  )
}
