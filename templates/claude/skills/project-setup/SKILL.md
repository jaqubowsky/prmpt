---
description: Initialize or update AGENTS.md and docs/ai/ by first exploring the codebase, then interviewing the user about decisions that cannot be inferred. Use when the user says "finish setup", "finish project setup", "set up project context", "update AGENTS.md", or when docs/ai/ contains placeholder comments.
---

## Czym jest ten skill

Laczy dwa podejscia:
1. Explore-first: czyta kodebase zanim zada jakiekolwiek pytanie
2. Grill-me style: relentless interview - nie konczy dopoki kazda
   galaz drzewa decyzyjnego nie jest w pelni rozwiazana

Wynik: kompletne AGENTS.md i docs/ai/ ktore Claude Code moze
uzywac jako source of truth przy kazdej sesji.

## PHASE 1: EXPLORE (cicho, nie narrate)

Przed zadaniem jakiegokolwiek pytania, przeczytaj:
- package.json -> stack, wersje, scripts, dependencies
- Strukture folderow -> jaki wzorzec architektury jest uzywany
- 2-3 istniejace komponenty jesli istnieja -> naming, patterns
- tsconfig.json -> strictness, path aliases
- eslint / biome config -> obowiazujace reguly
- Istniejace testy jesli sa -> jak sa pisane, co testuja
- Obecny AGENTS.md -> co jest placeholder vs co jest wypelnione

Zbuduj dwie listy wewnetrznie:
  KNOWN   = rzeczy ktore mozesz wywnioskowac z confidence
  UNKNOWN = rzeczy ktorych nie mozesz ustalic bez pytania

Nastepnie powiedz:
"Przejrzalem projekt. Oto co juz wiem:
  - [lista KNOWN - 3-5 punktow]

Mam kilka pytan zeby wypelnic reszte.
Bede pytal po jednym na raz - mozesz wybrac opcje
lub powiedziec 'tak' do mojej propozycji."

## PHASE 2: RELENTLESS INTERVIEW

To jest grill-me zastosowany do project setup.

Zasada nadrzedna: kazda odpowiedz albo rozwiazuje
galaz albo otwiera nowe pytania. Nie koncz Phase 2
dopoki WSZYSTKIE galezie nie sa w pelni rozwiazane.

NIE uzywaj stalej listy pytan.
Pytania wynikaja dynamicznie z odpowiedzi.

FORMAT KAZDEGO PYTANIA (bez wyjatkow):

  [Pytanie prostym jezykiem - zero zargonu]

  Na przyklad:
  - Opcja A: [konkretny opis jak to wyglada w praktyce]
  - Opcja B: [konkretny opis]
  - Opcja C: [jesli potrzeba]

  Proponuje: [twoja rekomendacja] bo [jedno zdanie powodu].

ZASADY FOLLOW-UP:
- User mowi "opcja A" -> zapytaj o edge cases tej opcji
- User mowi "zalezy" -> zapytaj od czego, potem kazdy przypadek
- User mowi "nie wiem" -> daj rekomendacje, zapytaj czy pasuje
- User mowi "tak" lub "ok" -> rozwiazane, przejdz dalej
- Nigdy nie porzucaj watku - jesli cos niejasne, idz glebiej

PRZYKLADY JAK PYTANIA MUSZA WYGLADAC:

  ZLE:  "What's your component architecture strategy?"
  DOBRZE: "Kiedy tworzysz nowy feature, gdzie laduja pliki?

    Na przyklad:
    - Wszystko razem: src/features/produkty/ z komponentami,
      logika i testami w jednym miejscu
    - Rozdzielone: duze reuzywalne rzeczy w src/components/,
      rzeczy specyficzne dla feature przy stronie
    - Flat: wszystko w src/components/, bez podfolderow

    Proponuje: wszystko razem w jednym folderze per feature,
    bo widze ze masz kilka oddzielnych sekcji aplikacji."

  ZLE:  "What's your error handling philosophy?"
  DOBRZE: "Co powinno sie pokazac gdy dane sie nie zaladuja?

    Na przyklad:
    - Spinner podczas ladowania, czerwony komunikat przy bledzie
    - Szare placeholder bloki (skeleton) podczas ladowania,
      przycisk 'sprobuj ponownie' przy bledzie
    - Na razie nic specjalnego, tylko dane

    Proponuje: spinner + komunikat bledu, bo to najprostsze
    i nie widze jeszcze skeleton komponentu w projekcie."

  ZLE:  "What's off-limits for Claude?"
  DOBRZE: "Czy sa foldery ktorych Claude absolutnie nie powinien
    zmieniac bez pytania cie najpierw?

    Na przyklad:
    - Folder z logowaniem/auth (latwo cos zepsuc)
    - Pliki konfiguracji bazy danych
    - Wszystko jest ok, bez ograniczen

    Proponuje: zablokuj folder auth jesli masz, bo bledy
    w auth sa najtrudniejsze do debugowania."

GALEZIE KTORE MUSZA BYC ROZWIAZANE
(liczba pytan w kazdej galezi = dynamiczna):

  [STRUCTURE] Gdzie kod mieszka i dlaczego
  [DATA] Jak dane trafiaja do komponentow i co gdy cos failuje
  [COMPONENTS] Co Claude ma i nie ma generowac
  [TESTS] Co jest testowane, co nie jest i dlaczego
  [BOUNDARIES] Czego Claude nie moze ruszac bez pytania
  [WORKFLOW] Rozmiar PR, oczekiwania przy review

Galaz jest rozwiazana tylko gdy mozesz ja zapisac
jednoznacznie w docs/ai/ bez zadnych domyslow.

## PHASE 3: GENERATE

Wejdz w te faze TYLKO gdy wszystkie galezie sa rozwiazane.

Powiedz:
"Mam wszystko co potrzebuje. Oto co zaraz zapiszę -
powiedz jesli cokolwiek wyglada nie tak zanim to zrobie:"

Pokaz kazdy plik w calosci.
Poczekaj na wyrazne potwierdzenie.
Dopiero wtedy zapisz:
  - AGENTS.md (wszystkie placeholdery wypelnione)
  - docs/ai/CONVENTIONS.md
  - docs/ai/PATTERNS.md
  - docs/ai/TESTING.md
  - docs/ai/ARCHITECTURE.md
  - .github/workflows/ci.yml (dopasowany do stacku)
  - .github/workflows/ai-pr-review.yml (jesli user chce)
  - .github/PULL_REQUEST_TEMPLATE.md (dopasowany do stacku)

Zasady dla ai-pr-review.yml:
Uzyj anthropics/claude-code-action@main.
direct_prompt MUSI:
  - Kazac Claude przeczytac AGENTS.md + docs/ai/ NAJPIERW jako source of truth
  - Wylistowac konkretne rzeczy do sprawdzenia, wynikajace z faktycznego stacku
  - Powiedziec wprost: "Do NOT invent rules not written in those files"
  - Powiedziec wprost: "If no rule covers something, skip it"
  - Ograniczyc review do zmian w PR, nie pre-existing code

## PHASE 4: VERIFY

Po zapisaniu wszystkich plikow, uruchom weryfikacje:
- `npm run build` lub `npx tsc --noEmit` (jesli TS project)
- `npm run lint` lub wykryty linter
- `npm test` lub wykryty test runner

Raportuj wyniki uzytkownikowi.
Jesli cos failuje, napraw zanim oglosisz setup jako ukonczony.

Po ukonczeniu:
"Gotowe. Kontekst projektu jest skonfigurowany.

Kazdy nowy feature zaczynaj od:
  /superpowers:brainstorm"
