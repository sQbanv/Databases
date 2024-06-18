# Dokumentacja miniprojektu bazy danych

## Temat: Hotel z rezerwacją pokoi

---

## Autor: Dariusz Cebula <dcebula@student.agh.edu.pl>

---

Proponowany schemat bazy danych:

- Kolekcja `Hotel`:
  - `name` - nazwa hotelu
  - `description` - opis hotelu
  - `address` - adres hotelu
  - `key-features` - kluczowe cechy hotelu np. darmowe WiFi
  - `facilities` - udogodnienia oferowane przez hotel np. spa, basen
  - `hotel-area-info` - informację o pobliskich miejscach i atrakcjach wraz z odległością w metrach
  - `check-in` - godziny zameldowania
  - `check-out` - godziny wymeldowania

Kolekcja `Hotel` głównie służy do przetrzymywania informacji o hotelu, którę będą wyświetlane na stronie dla klientów

```json
{
  "_id": {
    "$oid": "661eb850859031cbe592c7ca"
  },
  "name": "Tranquil Haven Hotel",
  "description": "Welcome to Tranquil Haven Hotel, where every moment is an escape into serenity. Nestled amidst lush greenery and tranquil surroundings, our hotel offers a sanctuary for those seeking respite from the hustle and bustle of everyday life. With elegantly appointed rooms and suites, each designed to provide the utmost comfort and relaxation, guests are invited to unwind in style. Indulge in our world-class amenities, including a rejuvenating spa offering a range of wellness treatments, a picturesque swimming pool surrounded by verdant gardens, and exquisite dining experiences that tantalize the taste buds with culinary delights from around the globe. Whether you're here for a romantic getaway, a family vacation, or a corporate retreat, our attentive staff is dedicated to ensuring your stay is nothing short of extraordinary. Discover the perfect blend of luxury and tranquility at Tranquil Haven Hotel, where every moment is a peaceful escape.",
  "address": "123 Serenity Lane Peaceful Valley, CA 98765 United States",
  "key-features": [
    "pet friendly",
    "free wifi",
    "air conditioning",
    "elevator",
    "safe",
    "spa",
    "luxurious accommodations",
    "scenic location",
    "fitness center",
    "event spaces",
    "gourmet dining"
  ],
  "facilities": [
    "Spa and Wellness Center",
    "Fine Dining Restaurants",
    "Outdoor Pool",
    "Fitness Center",
    "Conference and Event Spaces",
    "Business Center",
    "Lounge Areas",
    "Children's Play Area",
    "24-Hour Reception and Security"
  ],
  "hotel-area-info": [
    {
      "Nearest Airport": 20000
    },
    {
      "City Center": 5000
    },
    {
      "Tranquil Park": 1000
    },
    {
      "Artisan Museum": 3000
    },
    {
      "Serenity Mall": 2000
    },
    {
      "Tranquil Market": 500
    },
    {
      "Nearest Bus Stop": 100
    }
  ],
  "check-in": "15:00",
  "check-out": "12:00"
}
```

- Kolekcja `Guest`:
  - `guest_id` - identyfikator gościa
  - `firstname` - imię gościa
  - `lastname` - nazwisko gościa
  - `birthday` - data urodzin gościa
  - `address` - adres gościa
  - `email` - adres e-mail gościa
  - `phone` - numer telefonu gościa

Kolekcja `Guest` przetrzymuję informację o gościach co złożyli rezerwację pokoi

```json
{
  "_id": {
    "$oid": "661ec025859031cbe592c7d4"
  },
  "guest_id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "birthday": "1980-05-15",
  "address": "123 Main Street, Cityville, USA",
  "email": "johndoe@example.com",
  "phone": "+1234567890"
}
```

- Kolekcja `Room`:
  - `room_number` - numer pokoju
  - `price` - cena za jeden nocleg
  - `capacity` - pojemność pokoju (liczba gości)
  - `include` - elementy uwzględnione w pokoju np. łóżko typu queen, sofa
  - `area` - powierzchnia pokoju w metrach kwadratowych
  - `features` - dodatkowe funkcje i udogodnienia dostępne w pokoju np. darmowe WiFi, klimatyzacja, minibar

Kolekcja `Room` przetrzymuję informacje o pokojach dostępnych w hotelu do rezerwacji

```json
{
  "_id": {
    "$oid": "661ec440859031cbe592c7e4"
  },
  "room_number": 101,
  "price": 150,
  "capacity": 2,
  "include": [
    {
      "queen bed": 1
    }
  ],
  "area": 25,
  "features": [
    "free wifi",
    "air conditioning",
    "minibar",
    "flat-screen TV"
  ]
},
{
  "_id": {
    "$oid": "661ec460859031cbe592c7e5"
  },
  "room_number": 102,
  "price": 200,
  "capacity": 4,
  "include": [
    {
      "king bed": 1
    },
    {
      "sofa bed": 1
    }
  ],
  "area": 35,
  "features": [
    "free wifi",
    "air conditioning",
    "mini fridge",
    "work desk",
    "balcony"
  ]
}
```

- Kolekcja `Food`:
  - `name` - nazwa typu wyżywienia
  - `description` - opis wyżywienia
  - `type` - typ wyżywienia
  - `price` - cena wyżywienia za jeden dzień

Kolekcja `Food` przetrzymuje informację o dostępnych typach wyżywienia jakie możemy wybrać przy rezerwacji pokoju

```json
{
  "_id": {
    "$oid": "661ed5de859031cbe592c816"
  },
  "name": "All-Inclusive Plan",
  "description": "Includes breakfast, lunch, and dinner and 24-hours minibar with beverages and snacks.",
  "type": "all_inclusive",
  "price": 50
},
{
  "_id": {
    "$oid": "661ed63a859031cbe592c818"
  },
  "name": "Breakfast Only",
  "description": "Includes breakfast only.",
  "type": "breakfast_only",
  "price": 10
},
{
  "_id": {
    "$oid": "661ed683859031cbe592c819"
  },
  "name": "Breakfast and Dinner",
  "description": "Includes breakfast and dinner.",
  "type": "breakfast_dinner",
  "price": 20
},
{
  "_id": {
    "$oid": "661ed690859031cbe592c81a"
  },
  "name": "Breakfast, Lunch, and Dinner",
  "description": "Includes breakfast, lunch, and dinner.",
  "type": "full_board",
  "price": 30
}
```

- Kolekcja `Reservation`:
  - `guests` - lista identyfikatorów gości zerezerwowanych na pobyt
  - `rooms` - lista numerów pokoi zarezerwowanych na pobyt
  - `check_in` - data zameldowania
  - `check_out` - data wymeldowania
  - `total_guests` - całkowita liczba gości objętych rezerwacją
  - `status` - status rezerwacji (`"confirmed"`, `"pending"`, `"cancelled"`)
  - `notes` - dodatkowe uwagi lub życzenia związane z rezerwacją
  - `created_at` - data i czas utworzenia rezerwacji
  - `updated_at` - data i czas ostatniej aktualizacji rezerwacji
  - `food_type` - typ wyżywienia np. `all_inclusive`, `full_board`, `breakfast_only`

Kolekcja `Reservation` przetrzymuję informację o wszystkich rezerwacjach. Rezerwacja jest dokonywaa na konkretną liczbą gości i wszyscy są potem dopisywani do kolekcji `Guest`, chyba że już kiedyś złożyli rezerwację w tym hotelu. Dodatkowo rezerwacja może obejmować większą liczbę pokoi.

```json
{
  "_id": {
    "$oid": "661ec9bc859031cbe592c80b"
  },
  "guests": [
    1
  ],
  "rooms": [
    103
  ],
  "check_in": "2024-07-15",
  "check_out": "2024-07-20",
  "total_guests": 1,
  "total_price": 750,
  "status": "confirmed",
  "notes": "Guest prefers a room with a city view.",
  "created_at": "2024-06-01T09:00:00Z",
  "updated_at": "2024-06-02T14:30:00Z",
  "food_type": "all_inclusive"
},
{
  "_id": {
    "$oid": "661ecad4859031cbe592c80d"
  },
  "guests": [
    1,
    2,
    3
  ],
  "rooms": [
    101,
    103
  ],
  "check_in": "2024-09-05",
  "check_out": "2024-09-10",
  "total_guests": 3,
  "total_price": 1620,
  "status": "confirmed",
  "notes": "Group reservation for a family vacation.",
  "created_at": "2024-08-01T10:00:00Z",
  "updated_at": "2024-08-02T12:00:00Z",
  "food_type": "full_board"
}
```

- Kolekcja `Review`:
  - `guest_id` - identyfikator gościa, który wystawił recenzję
  - `categories` - oceny poszczególnych kategorii np. `facilities`, `comfort`, `location`
  - `topics` - tematy omawiane w recencji np. `room`, `breakfast`
  - `date` - data wystawienia recenzji
  - `text` - treść omawianej recenzji
  - `score` - ogólna ocena recenzji

Kolekcja `Review` przechowuję wszystkie recenzje dodane przez gości, któzy odwiedzili nasz hotel. Recenzja obejmuję ocenę w różnych kategoriach i posiada ocenę końcową na podstawie średniej ze wszystkich kategorii.

```json
{
  "_id": {
    "$oid": "661ebc53859031cbe592c7ce"
  },
  "guest_id": "1",
  "categories": {
    "staff": 9,
    "facilities": 8,
    "cleanliness": 9,
    "comfort": 9,
    "value_for_money": 8,
    "location": 10,
    "free_wifi": 10
  },
  "topics": [
    "breakfast",
    "room",
    "clean"
  ],
  "date": "2024-04-16T08:00:00Z",
  "text": "I had a fantastic stay at the Tranquil Haven Hotel. The staff were incredibly helpful and friendly, and the facilities were top-notch. My room was spotlessly clean and very comfortable. The breakfast options were delicious, and the hotel's location was perfect for exploring the city. The free WiFi was also a great bonus. Highly recommended!",
  "score": 9
}
```

---

Funkcje potrzebne dla aplikacji do rezerwacji pokoi w naszym hotelu:

- Wyszukiwanie dostępnych pokoi w podanym zakresie dat i podanej ilości osób
- Dodawanie nowej rezerwacji wraz z nowymi gośćmi do kolekcji `Guest`
- Sprawdzanie dostępności pokoju w danym zakresie dat
- Wyszukiwanie dostępnych typów wyżywienia
- Pobieranie inforamcji o hotelu do wypisania na stronie
- Dodanie nowej recenzji
- Pobieranie wszystkich recezji
- Filtrowanie recenzji po tematach zawartych w recenzji
- Filtrowanie recenzji po ocenie
- Zestawienie ile hotel zarobił w ostanim miesiącu
- Pobieranie informacji o stanie hotelu w danym dniu (np. ilośc wolnych pokoi, ilośc gości, itp.)
- Oblicznie średniej oceny hotelu na podstawie wszystkich recenzji
- Obliczanie średniej oceny każdej katregorii na podstawie wszystkich recenzji
- Wykaz najbardziej popularnych pokoi
- Wykaz najbardziej popularnych form wyżywienia
- Wyświetlenie gości którzy ocenili najwyżej w określonej kategorii
- Wyświetlenie gości, którzy złożyli najwięcej rezerwacji

---

- propozyja zmiany kolekcji `Review` dodając pole `reservation_id` oznaczające dodatkowo jakiej rezerwacji dotyczy recenzja. Szczególnie potrzebne dla pracowników, którzy chcą sparwdzić powiązanie recenzji z opinią.