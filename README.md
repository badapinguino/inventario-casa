# Inventario Cantina

Web app per gestire l'inventario della cantina con Supabase e Next.js.

## Setup

1. Clona il repository
2. Installa le dipendenze: `npm install`
3. Configura le variabili d'ambiente su Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy su Vercel

## Sviluppo locale
```bash
npm run dev
```

## Configurazione Supabase

Esegui nel SQL Editor di Supabase:
```sql
alter table public.prodotti enable row level security;
alter table public.lotti enable row level security;

create policy "allow all" on public.prodotti for all using (true);
create policy "allow all" on public.lotti for all using (true);
```
```

---

## 🚀 Passi per il deploy:

1. **Crea questa struttura nel tuo repository**:
```
   inventario-casa/
   ├── pages/
   │   ├── _app.js
   │   └── index.js
   ├── styles/
   │   └── globals.css
   ├── package.json
   ├── next.config.js
   ├── tailwind.config.js
   ├── postcss.config.js
   ├── .gitignore
   └── README.md