import Header from "../../components/Header"
import { supabase } from "../../utils/supabaseClient"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function ModificaProdotto() {
  const router = useRouter()
  const { id } = router.query

  const [prodotto, setProdotto] = useState(null)
  const [nome, setNome] = useState("")
  const [marca, setMarca] = useState("")
  const [categoria, setCategoria] = useState("")
  const [sottocategoria, setSottocategoria] = useState("")
  const [formato, setFormato] = useState("")
  const [note, setNote] = useState("")

  useEffect(() => {
    if (id) loadProdotto()
  }, [id])

  async function loadProdotto() {
    const { data } = await supabase.from("prodotti").select("*").eq("id", id).single()
    setProdotto(data)
    setNome(data.nome)
    setMarca(data.marca)
    setCategoria(data.categoria)
    setSottocategoria(data.sottocategoria)
    setFormato(data.formato)
    setNote(data.note)
  }

  async function salvaModifica(e) {
    e.preventDefault()
    await supabase.from("prodotti").update({ nome, marca, categoria, sottocategoria, formato, note }).eq("id", id)
    alert("Prodotto modificato!")
    router.push("/")
  }

  if (!prodotto) return <><Header /><div className="container">Caricamento...</div></>

  return (
    <>
      <Header />
      <div className="container">
        <h2>Modifica Prodotto</h2>
        <form onSubmit={salvaModifica} className="card p-3">
          <input className="form-control mb-2" value={nome} onChange={e => setNome(e.target.value)} required />
          <input className="form-control mb-2" value={marca} onChange={e => setMarca(e.target.value)} />
          <input className="form-control mb-2" value={categoria} onChange={e => setCategoria(e.target.value)} />
          <input className="form-control mb-2" value={sottocategoria} onChange={e => setSottocategoria(e.target.value)} />
          <input className="form-control mb-2" value={formato} onChange={e => setFormato(e.target.value)} />
          <input className="form-control mb-2" value={note} onChange={e => setNote(e.target.value)} />
          <button className="btn btn-primary">Salva Modifica</button>
        </form>
      </div>
    </>
  )
}
