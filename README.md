# BeerTaste - Aplikacja do Recenzji Piw

Jest to aplikacja internetowa stworzona dla entuzjastów piwa, umożliwiająca ocenianie i recenzowanie różnych rodzajów tego trunku. Użytkownicy mogą zakładać konta, dodawać szczegółowe recenzje oraz śledzić swoją historię degustacji i statystyki.

## Kluczowe zaimplementowane funkcjonalności

- **System uwierzytelniania użytkowników:** Bezpieczny system rejestracji i logowania oparty na usłudze Firebase Authentication. Użytkownicy mogą tworzyć konta, logować się oraz resetować hasło.

- **Dodawanie i edycja recenzji:** Użytkownicy mają dostęp do rozbudowanego formularza pozwalającego na dodanie nowej recenzji piwa. Formularz zawiera pola takie jak nazwa piwa, browar, styl, data degustacji, a także szczegółowe oceny smaku, aromatu, wyglądu i innych atrybutów. Istnieje również możliwość edycji istniejących recenzji.

- **Dynamiczny profil użytkownika:**
  - Całkowicie przebudowana strona profilu użytkownika o nowoczesnym, ciemnym wyglądzie, spójnym z resztą aplikacji.
  - Statystyki (łączna liczba recenzji, średnia ocena) są **dynamicznie pobierane** z bazy danych Firestore dla każdego użytkownika.
  - Profil wyświetla listę **ostatnio dodanych recenzji** oraz **listę ulubionych (najwyżej ocenianych) piw**.
  - Dane użytkownika, takie jak zdjęcie profilowe, nazwa i e-mail, są również pobierane dynamicznie.

- **Przeglądanie recenzji:** Użytkownicy mogą przeglądać listę swoich recenzji na dedykowanej podstronie.

- **System quizu:** Aplikacja zawiera funkcjonalność quizu (implementacja wyników na stronie profilu jest w planach).

## Stos technologiczny

- **Frontend:** React.js
- **Build Tool:** Vite
- **Styling:** Material-UI (MUI) oraz własne style CSS
- **Backend i Baza Danych:** Google Firebase (Authentication, Firestore Database)
- **Routing:** React Router

## Jak uruchomić projekt

1.  Sklonuj repozytorium na swój komputer.
2.  Zainstaluj wszystkie wymagane zależności za pomocą polecenia:
    ```bash
    npm install
    ```
3.  Uruchom serwer deweloperski:
    ```bash
    npm run dev
    ```

