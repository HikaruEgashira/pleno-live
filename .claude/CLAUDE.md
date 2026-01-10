# voicenote-ai

Expo + tRPC ボイスメモアプリ

## Entry Points
- Client: `app/_layout.tsx`
- Server: `server/_core/index.ts`
- DB Schema: `drizzle/schema.ts`

## Structure
```
app/           # Expo Router pages
  (tabs)/      # Tab navigation (record, index, settings)
  note/[id]    # Note detail
server/        # tRPC backend
  _core/       # Framework (trpc, auth, llm)
  routers.ts   # API routes
lib/           # Client utilities
hooks/         # React hooks
components/    # UI components
drizzle/       # DB schema
```

## Tech Stack
- Expo 54 + React Native 0.81
- tRPC 11 + Express
- Drizzle ORM + MySQL
- ElevenLabs STT, Gemini AI
