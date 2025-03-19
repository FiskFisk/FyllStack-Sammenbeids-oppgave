# Hvahoot - Quiz Web App

Hvahoot er en quizplattform der brukere kan registrere seg, velge en quiz, svare på spørsmål og sammenligne resultatene sine med andre spillere.

## 📌 Teknologi
- **Frontend**: React (TypeScript, Vite)
- **Backend**: Flask (Python)
- **Database**: (Kan legges til senere, f.eks. SQLite/PostgreSQL)

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

## 🔗 API-endepunkter
- `GET /api/test` - Sjekker om backend fungerer

## 📌 Videre utvikling
- 🔑 Legge til brukerautentisering
- 📝 Implementere quizlogikk
- 🎨 Forbedre UI/UX

---

🛠️ **Dette er den første versjonen av dokumentasjonen. Oppdateringer vil bli lagt til etter hvert som prosjektet utvikler seg!** 🚀

