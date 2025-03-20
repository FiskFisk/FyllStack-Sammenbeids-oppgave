
# Hvahoot - Quiz Web App

Hvahoot er en quizplattform der brukere kan registrere seg, velge en quiz, svare på spørsmål og sammenligne resultatene sine med andre spillere.

## 📌 Teknologi
- **Frontend**: React (TypeScript, Vite)
- **Backend**: Flask (Python)
- **Database**: MariaDB (via Raspberry Pi)

## 🚀 Kjernefunksjonalitet
✅ Brukerregistrering og innlogging  
✅ Velge quiz og svare på spørsmål  
✅ Poengtavle og grafer for resultatsammenligning  

### 🎯 Ønsket funksjonalitet (hvis tid)
- ⏳ Tidsbegrensning på spørsmål
- 📱 Mobilvennlig design
- 🔧 Adminpanel for opplasting av nye quizer
- 🖼️ Støtte for bilder/lyd i spørsmål

## 🎨 Designprofil
🎨 **Hovedfarge**: #4CAF50  
🟠 **Sekundærfarge**: #FF9800  
🔤 **Font for overskrifter**: Poppins  
📝 **Font for brødtekst**: Open Sans  

---

## 🛠️ Installering og oppsett

### 1️⃣ Opprett React-prosjektet (Frontend)
Åpne terminalen i VS Code og kjør:
```sh
npx create-react-app frontend --template typescript
cd frontend
npm install
```

🚀 Start utviklingsserveren:
```sh
npm run dev
```

Frontend kjører nå på `http://localhost:5173`

Opprett en `App.tsx` med følgende innhold:
```tsx
import React, { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Hvahoot</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
```

### 2️⃣ Sett opp Flask-backend
Opprett en `backend`-mappe og kjør følgende kommandoer:
```sh
cd backend
python -m venv venv
```

🔹 **For Windows**:
```sh
venv\Scripts\activate
```

🔹 **For Mac/Linux**:
```sh
source venv/bin/activate
```

Installer nødvendige pakker:
```sh
pip install flask flask-cors
```

Opprett en `app.py` med følgende innhold:
```python
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
```

🚀 Start backend-serveren:
```sh
python app.py
```

Backend kjører nå på `http://127.0.0.1:5000`

---

## 🔗 Videre utvikling

### 3️⃣ Frontend-sider
Julian jobbet med frontend og opprettet sidene for:
- Login (med input-felt og styling)
- Registrering (brukerinformasjon lagres korrekt)
- Meny (for å velge quizer)

### 4️⃣ Backend-forbindelse og database
Laura utviklet Flask-backenden videre og koblet den til en Raspberry Pi med MariaDB.
- Backend kan sende og motta data fra databasen
- Backend kan lese og skrive JSON-filer for quiz-spørsmål

**Database-strukturen inkluderer:**
- **Brukere**: Passord, e-post, brukernavn, telefonnummer
- **Quiz-resultater**: Quiz ID, Brukernavn, Bruker ID, Poeng
- **Quiz-data** lagres i en JSON-fil

### 5️⃣ Integrasjon mellom frontend og backend
Julian koblet frontend til backend:
- Brukere kan registrere seg og logge inn
- Informasjon sendes mellom frontend og backend korrekt
- Funksjonaliteten fungerer som forventet

---

## 🔗 API-endepunkter
- `GET /api/test` - Sjekker om backend fungerer
- `POST /api/register` - Registrerer en ny bruker
- `POST /api/login` - Brukerinnlogging
- `GET /api/quiz` - Henter quiz-data
- Flere endepunkter for quiz-svar og poengregistrering er under utvikling

## 📌 Videre utvikling
- 🔑 Implementere sikker autentisering
- 📝 Fullføre quizlogikk
- 🎨 Forbedre UI/UX

## 📌 Hosting-struktur
- Frontend kjører på port 3000
- Backend kjører på port 5000
- Frontend og backend hostes på to forskjellige servere

---

🛠️ **Dette er den oppdaterte dokumentasjonen. Nye oppdateringer vil bli lagt til etter hvert som prosjektet utvikler seg!** 🚀
