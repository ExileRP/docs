# System Botów Minecraft

Kompletny system zarządzania botami Minecraft używający Node.js i biblioteki mineflayer.

## 📋 Spis treści

- [Wymagania](#wymagania)
- [Instalacja](#instalacja)
- [Konfiguracja](#konfiguracja)
- [Użycie](#użycie)
- [Komendy w grze](#komendy-w-grze)
- [Struktura projektu](#struktura-projektu)
- [Bezpieczeństwo](#bezpieczeństwo)
- [Rozwiązywanie problemów](#rozwiązywanie-problemów)

## ⚙️ Wymagania

- Node.js >= 16.0.0
- Serwer Minecraft (wersja 1.8+)
- Plugin do rejestracji/logowania (np. AuthMe, LoginSecurity)

## 📦 Instalacja

1. **Zainstaluj zależności mineflayer:**

```bash
npm install mineflayer
```

Biblioteka `chalk` jest już zainstalowana w projekcie jako devDependency.

2. **Skopiuj przykładową konfigurację:**

```bash
cp config.example.json config.json
```

3. **Edytuj plik `config.json`** (patrz sekcja [Konfiguracja](#konfiguracja))

## 🔧 Konfiguracja

Edytuj plik `config.json` z odpowiednimi parametrami:

```json
{
  "server": {
    "host": "twoj-serwer.pl",
    "port": 25565,
    "version": false
  },
  "botCount": 10,
  "owner": "TwojNick",
  "autoReconnect": true,
  "connectDelay": 2000
}
```

### Parametry konfiguracji:

- **server.host** - Adres IP lub domena serwera Minecraft
- **server.port** - Port serwera (domyślnie 25565)
- **server.version** - Wersja Minecraft (false = auto-detect)
- **botCount** - Liczba botów do uruchomienia (1-100+)
- **owner** - Twój nick na serwerze (do uprzywilejowanych komend)
- **autoReconnect** - Automatyczne ponowne łączenie po rozłączeniu (true/false)
- **connectDelay** - Opóźnienie między łączeniem botów w ms (zalecane: 1000-5000)

## 🚀 Użycie

### Uruchomienie botów:

```bash
node index.js
```

### Zatrzymanie botów:

Naciśnij `Ctrl+C` aby bezpiecznie zamknąć wszystkie boty.

## 🎮 Komendy w grze

W grze, możesz wydawać komendy botom przez chat używając formatu:
```
<NickBota> <komenda> [argumenty]
```

### Dostępne komendy:

#### Dla wszystkich graczy:

- **`Bot_XYZ123 ping`** - Bot odpowie "Pong!"
- **`Bot_XYZ123 stats`** - Wyświetla statystyki bota (zdrowie, głód, pozycja)
- **`Bot_XYZ123 help`** - Lista dostępnych komend

#### Tylko dla właściciela (ustawionego w config.json):

- **`Bot_XYZ123 tp`** - Bot teleportuje się do Ciebie
- **`Bot_XYZ123 drop <przedmiot>`** - Bot wyrzuca przedmiot z ekwipunku

### Przykłady:

```
Bot_ABC123 ping
Bot_ABC123 stats
Bot_ABC123 tp
Bot_ABC123 drop diamond
```

## 📁 Struktura projektu

```
/
├── src/
│   ├── bot-manager.js          # Zarządza wieloma botami
│   ├── bot-instance.js         # Logika pojedynczego bota
│   ├── auth-handler.js         # Obsługa rejestracji/logowania
│   ├── nickname-generator.js   # Generator nicków botów
│   └── data-storage.js         # Zapisywanie/wczytywanie danych
├── data/
│   └── bots-data.json          # Dane botów (automatycznie tworzone)
├── config.json                 # Konfiguracja (DO UTWORZENIA)
├── config.example.json         # Przykładowa konfiguracja
├── index.js                    # Punkt wejścia aplikacji
└── MINECRAFT_BOTS_README.md    # Ta dokumentacja
```

## 🔐 Bezpieczeństwo

### ⚠️ WAŻNE ZASADY BEZPIECZEŃSTWA:

1. **NIE COMMITUJ pliku `config.json` do Git!**
   - Plik jest już dodany do `.gitignore`
   - Zawiera dane twojego serwera

2. **NIE COMMITUJ pliku `data/bots-data.json` do Git!**
   - Plik jest już dodany do `.gitignore`
   - Zawiera hasła botów

3. **Testuj TYLKO na własnych serwerach!**
   - Używanie botów na cudzych serwerach bez zgody może być uznane za atak
   - Może to prowadzić do bana IP lub prawnych konsekwencji

4. **Zabezpiecz hasła:**
   - System automatycznie generuje losowe hasła
   - Hasła są zapisywane w `data/bots-data.json`
   - Nie udostępniaj tego pliku nikomu

5. **Ograniczenia:**
   - Nie uruchamiaj zbyt wielu botów jednocześnie (może to być uznane za DDoS)
   - Zalecane: maksymalnie 10-20 botów na raz
   - Ustaw odpowiednie `connectDelay` (min. 1000ms)

### Dobre praktyki:

- Używaj silnych haseł (system generuje je automatycznie)
- Regularnie sprawdzaj logi pod kątem błędów
- Monitoruj użycie zasobów serwera
- Informuj administratorów serwera o używaniu botów

## 🔧 Rozwiązywanie problemów

### Bot nie może się połączyć:

```
Error: connect ECONNREFUSED
```

**Rozwiązanie:**
- Sprawdź czy serwer jest włączony
- Zweryfikuj host i port w `config.json`
- Sprawdź czy firewall nie blokuje połączenia

### Bot nie może się zarejestrować/zalogować:

```
Authentication timeout
```

**Rozwiązanie:**
- Upewnij się, że serwer ma plugin rejestracji (np. AuthMe)
- Sprawdź komendy rejestracji na serwerze (może być inna niż `/register`)
- Możesz edytować `src/auth-handler.js` jeśli serwer używa innych komend

### Zbyt wiele botów rozłącza się:

**Rozwiązanie:**
- Zwiększ `connectDelay` w `config.json` (np. do 3000-5000ms)
- Zmniejsz `botCount`
- Serwer może mieć limity połączeń - skontaktuj się z adminem

### "Module not found: mineflayer":

**Rozwiązanie:**
```bash
npm install mineflayer
```

## 📊 Funkcje systemu

### ✅ Zaimplementowane:

- ✅ Generowanie losowych nicków botów (format: `Bot_XYZ123`)
- ✅ Automatyczna rejestracja nowych kont (`/register`)
- ✅ Automatyczne logowanie na istniejące konta (`/login`)
- ✅ Zapisywanie danych do `data/bots-data.json`
- ✅ Wielokrotne użycie tych samych kont
- ✅ Równoległe uruchamianie wielu botów
- ✅ Obsługa komend w grze (tp, drop, stats, ping, help)
- ✅ Automatyczne ponowne łączenie po rozłączeniu
- ✅ Kolorowe logi (chalk)
- ✅ Bezpieczne zamykanie (SIGINT/SIGTERM)
- ✅ System właściciela dla uprzywilejowanych komend
- ✅ Konfigurowalne opóźnienie między połączeniami

### 🎯 Możliwe rozszerzenia:

- Automatyczne poruszanie się (pathfinding)
- Zbieranie zasobów
- Obsługa więcej komend w grze
- Web panel do zarządzania botami
- Discord integration
- Statystyki online botów

## 📝 Licencja

Ten kod jest częścią projektu ExileRP/docs.
Używaj odpowiedzialnie i zgodnie z zasadami serwera!

## 🤝 Wsparcie

W razie problemów:
1. Sprawdź sekcję [Rozwiązywanie problemów](#rozwiązywanie-problemów)
2. Sprawdź logi aplikacji
3. Upewnij się, że wszystkie wymagania są spełnione
4. Otwórz issue w repozytorium

---

**Pamiętaj: Używaj tego systemu odpowiedzialnie i tylko na serwerach, gdzie masz na to zgodę!**
