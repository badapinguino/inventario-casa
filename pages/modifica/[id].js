"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ModificaOggetto() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [oggetto, setOggetto] = useState({
    nome: "",
    descrizione: "",
    stanza: "",
    quantita: 1,
  });

  useEffect(() => {
    const fetchOggetto = async () => {
      const { data, error } = await supabase
        .from("oggetti")
        .select("*")
        .eq("id", id)
        .single();

      if (error) console.error(error);
      else setOggetto(data);

      setLoading(false);
    };

    fetchOggetto();
  }, [id]);

  const handleSave = async () => {
    const { error } = await supabase
      .from("oggetti")
      .update({
        nome: oggetto.nome,
        descrizione: oggetto.descrizione,
        stanza: oggetto.stanza,
        quantita: oggetto.quantita,
      })
      .eq("id", id);

    if (error) {
      alert("Errore nel salvataggio");
      console.error(error);
    } else {
      router.push("/oggetti");
    }
  };

  if (loading) return <p>Caricamento...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Modifica Oggetto</h1>

      <div className="flex flex-col gap-3">
        <input
          className="border p-2 rounded"
          placeholder="Nome"
          value={oggetto.nome}
          onChange={(e) => setOggetto({ ...oggetto, nome: e.target.value })}
        />

        <textarea
          className="border p-2 rounded"
          placeholder="Descrizione"
          value={oggetto.descrizione}
          onChange={(e) =>
            setOggetto({ ...oggetto, descrizione: e.target.value })
          }
        />

        <input
          className="border p-2 rounded"
          placeholder="Stanza"
          value={oggetto.stanza}
          onChange={(e) => setOggetto({ ...oggetto, stanza: e.target.value })}
        />

        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Quantità"
          value={oggetto.quantita}
          onChange={(e) =>
            setOggetto({ ...oggetto, quantita: Number(e.target.value) })
          }
        />

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white p-3 rounded"
        >
          Salva Modifiche
        </button>

        <button
          onClick={() => router.back()}
          className="bg-gray-400 text-white p-3 rounded"
        >
          Annulla
        </button>
      </div>
    </div>
  );
}
