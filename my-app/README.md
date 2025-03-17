# Fullstack Project Setup (React + Flask)

## 📌 How to Open and Run the Project in VS Code

### 1️⃣ Open the Project in VS Code
- Open **Visual Studio Code**.
- Click **File > Open Folder** and select the project folder.

---

### 2️⃣ Running the Backend (Flask)
#### **1. Open VS Code Terminal**
- Press **Ctrl + `** (backtick) or go to **View > Terminal**.
- Navigate to the `backend` folder:
  ```sh
  cd backend
  ```

#### **2. Create and Activate Virtual Environment**
- **First time setup (if venv is not created yet):**
  ```sh
  python -m venv venv
  ```
- **Activate the virtual environment:**
  - **PowerShell** (default terminal in Windows):
    ```powershell
    .\venv\Scripts\Activate
    ```
  - **Command Prompt (CMD):**
    ```cmd
    venv\Scripts\activate.bat
    ```
  - **Git Bash:**
    ```sh
    source venv/Scripts/activate
    ```

#### **3. Install Dependencies (Only First Time)**
```sh
pip install flask flask-cors flask-sqlalchemy flask-bcrypt flask-jwt-extended
```

#### **4. Run the Backend**
```sh
python app.py
```
- The Flask backend should now be running on `http://127.0.0.1:5000/`

---

### 3️⃣ Running the Frontend (React)
#### **1. Open a New Terminal in VS Code**
- Click the **➕ button** in the terminal tab or press `Ctrl + Shift + ` (backtick) to open a new terminal.
- Navigate to the `my-app` folder:
  ```sh
  cd ../my-app
  ```

#### **2. Install Dependencies (Only First Time)**
```sh
npm install
```

#### **3. Start the React App**
```sh
npm start
```
- The frontend should now be running on `http://localhost:3000/`

---

### 🎯 Summary of Commands
| Task | Command |
|------|---------|
| Open backend | `cd backend` |
| Create virtual env | `python -m venv venv` |
| Activate venv (PowerShell) | `.\venv\Scripts\Activate` |
| Activate venv (CMD) | `venv\Scripts\activate.bat` |
| Activate venv (Git Bash) | `source venv/Scripts/activate` |
| Install backend dependencies | `pip install -r requirements.txt` |
| Run backend | `python app.py` |
| Open frontend | `cd ../my-app` |
| Install frontend dependencies | `npm install` |
| Run frontend | `npm start` |

Now you're ready to build! 🚀

