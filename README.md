# DanceMatch Mobile

Aplikacja mobilna do znajdowania partnerów tanecznych, zbudowana z React + Vite + Konsta UI + Capacitor.

## Stack technologiczny

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Konsta UI** - iOS/Android native-look components
- **TanStack Query** - Data fetching & caching
- **Zustand** - State management
- **Supabase** - Backend (auth, database, storage)
- **Capacitor** - Native mobile wrapper
- **Tailwind CSS** - Styling

## Funkcjonalności

- 🔐 Autentykacja (login, rejestracja, reset hasła)
- 💃 Przeglądanie profili tancerzy
- ❤️ System polubień i dopasowań
- 📅 Przeglądanie wydarzeń tanecznych
- 💬 Real-time chat
- 👤 Zarządzanie profilem

## Instalacja

```bash
# Instalacja zależności
npm install

# Skopiuj plik .env
cp .env.example .env

# Uzupełnij dane Supabase w .env
```

## Development

```bash
# Uruchom serwer deweloperski
npm run dev
```

## Build

```bash
# Build dla web
npm run build

# Dodaj platformy Capacitor
npm run cap:add:ios
npm run cap:add:android

# Synchronizuj z natywnym projektem
npm run cap:sync

# Otwórz w Xcode/Android Studio
npm run cap:open:ios
npm run cap:open:android
```

## Struktura projektu

```
src/
├── components/        # Współdzielone komponenty
│   └── layouts/       # Layouty (Auth, Main)
├── features/          # Feature modules
│   ├── dancers/       # API hooks dla tancerzy
│   ├── events/        # API hooks dla wydarzeń
│   ├── chat/          # API hooks dla czatu
│   └── profile/       # API hooks dla profilu
├── lib/               # Konfiguracja i utilities
│   ├── supabase.ts    # Klient Supabase
│   ├── queryClient.ts # TanStack Query config
│   ├── auth.ts        # Store autentykacji
│   └── utils.ts       # Helper functions
├── pages/             # Strony/ekrany
│   ├── auth/          # Login, Register, ForgotPassword
│   ├── dancers/       # Lista i szczegóły tancerzy
│   ├── events/        # Lista i szczegóły wydarzeń
│   ├── chat/          # Konwersacje
│   └── profile/       # Profil użytkownika
├── styles/            # Style globalne
├── types/             # TypeScript types
├── App.tsx            # Root component
└── main.tsx           # Entry point
```

## Konsta UI

Projekt używa Konsta UI dla natywnego wyglądu iOS/Android. Komponenty automatycznie dostosowują się do platformy.

Dokumentacja: https://konstaui.com/react

## TanStack Query

Wszystkie zapytania do API używają TanStack Query z:
- Automatycznym cachingiem
- Optimistic updates
- Real-time subscriptions (Supabase)
- Retry logic

## Licencja

MIT
# da-02
