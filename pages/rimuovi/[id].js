"use client";

import { useRouter, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function RimuoviOggetto() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [oggetto, setOggetto] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("oggetti")
        .select("*")
        .eq("id", id)
        .single();
      setOggetto(data);
    };
    load();
  }, [id]);

  const handleDelete = async () => {
    await supabase.from("oggetti").delete().eq("id", id);
    router.push("/oggetti");
  };

  if (!oggetto) return <p>Caricamento...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-red-700">
        Rimuovi Oggetto
      </h1>

      <p className="mb-4">
        Sei sicuro di voler eliminare <strong>{oggetto.nome}</strong>?
      </p>

      <div className="flex gap-3">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white p-3 rounded"
        >
          Elimina
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
