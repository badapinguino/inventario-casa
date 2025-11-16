import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Remove() {
  const [idLotto, setIdLotto] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!idLotto) return

    const { error } = await supabase
      .from('lotti')
      .delete()
      .eq('id_lotto', idLotto)
    if (!error) router.push('/')
    else alert('Errore rimozione lotto')
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Rimuovi Lotto</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID Lotto:</label>
          <input type="number" value={idLotto} onChange={(e) => setIdLotto(e.target.value)} />
        </div>
        <button type="submit">Rimuovi</button>
      </form>
    </div>
  )
}