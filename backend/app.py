from flask import Flask, request, jsonify, session
import mysql.connector
import json
import os
import bcrypt
from config import db_config
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "your_secret_key_here"
CORS(app, supports_credentials=True)  # Allow cookies (sessions) across requests


def get_db_connection(): # This basically takes the database configuration from config.py and connects to the database YAY!
    return mysql.connector.connect(**db_config)


# Route for login
@app.route('/login', methods=['POST'])
def login():
    # Create a new connection and cursor for this request is the samen on every route
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        data = request.get_json()
        if 'e_post' not in data or 'passord' not in data:
            return jsonify({"error": "E-post og passord er påkrevd"}), 400

        e_post = data['e_post']
        passord = data['passord']

        query = "SELECT brukerID, passord FROM bruker WHERE e_post = %s"
        cursor.execute(query, (e_post,))
        user = cursor.fetchone()

        if user:
            # Verify the password using bcrypt
            if bcrypt.checkpw(passord.encode('utf-8'), user['passord'].encode('utf-8')):
                session['brukerID'] = user['brukerID']
                return jsonify({"message": "Klarte å logge inn YAY!", "redirect": "/route til main side i guess"}), 200
            else:
                return jsonify({"error": "Feil passord."}), 401
        else:
            return jsonify({"error": "Bruker ble ikke funnet."}), 404

    except mysql.connector.Error as e:
        print(f"Feil i databasen under login: {e}")
        return jsonify({"error": "En feil i databasen oppsto"}), 500
    except Exception as e:
        print(f"Uforventet feil under login: {e}")
        return jsonify({"error": "Det skjedde en uventet feil"}), 500
    finally:
        cursor.close()
        conn.close()

# This tiny little baby right here is the logout route ;D
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()  # Clear all session data
    return jsonify({"message": "Logged out successfully YAYAYAY!"}), 200


# Route for creating a new user
@app.route('/create_user', methods=['POST'])
def create_user():
    print("Received request to create user")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        data = request.get_json()
        print("Received data:", data)  # ✅ Print received data

        if not data:
            return jsonify({"error": "Invalid JSON format"}), 400

        if not all(key in data for key in ('e_post', 'passord', 'fullnavn', 'telefon')):
            return jsonify({"error": "E-post, passord, fullnavn, og telefon er påkrevd"}), 400

        e_post = data['e_post']
        passord = data['passord']
        fullnavn = data['fullnavn']
        telefon = data['telefon']

        # Check if email already exists
        query = "SELECT e_post FROM bruker WHERE e_post = %s"
        cursor.execute(query, (e_post,))
        if cursor.fetchone():
            return jsonify({"error": "E-posten er allerede registrert"}), 409

        # Hash password
        hashed_passord = bcrypt.hashpw(passord.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        query = """
            INSERT INTO bruker (e_post, passord, fullnavn, telefon)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (e_post, hashed_passord, fullnavn, telefon))
        conn.commit()

        return jsonify({"message": "Brukeren ble opprettet!", "redirect": "/"}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Something went wrong"}), 500
    finally:
        cursor.close()
        conn.close()



@app.route('/quiz/submit', methods=['POST'])
def submit_quiz():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        data = request.get_json()
        # Check if all required fields are provided (som kontrollbilett)
        if not all(key in data for key in ('brukerID', 'quizIdentifier', 'totalScore')):
            return jsonify({"error": "Required fields: brukerID, quizIdentifier, totalScore"}), 400

        brukerID = data['brukerID']
        quizIdentifier = data['quizIdentifier']
        totalScore = data['totalScore']

        # Insert the quiz result into the quizResult table
        query = "INSERT INTO quizResult (brukerID, quizIdentifier, totalScore) VALUES (%s, %s, %s)"
        cursor.execute(query, (brukerID, quizIdentifier, totalScore))
        conn.commit()

        return jsonify({"message": "Quiz result submitted successfully, YAYYAY"}), 201

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred womp womp"}), 500
    finally:
        cursor.close()
        conn.close()


@app.route('/quiz/results', methods=['GET'])
def get_quiz_results():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        query = "SELECT * FROM quizResult"
        cursor.execute(query)
        results = cursor.fetchall()
        return jsonify(results), 200
    
    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred WOMP WOMP LAURA"}), 500
    finally:
        cursor.close()
        conn.close()

#MY SHAYLAAAAAAAAAAAAAA, just takes checks that everything is working, because anxiety 😔
@app.route('/health', methods=['GET'])
def health():
    print("Health endpoint was accessed.")
    return jsonify({"status": "ok"}), 200

@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({"message": "Hello from Flask!"})


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000) #DETTE GJØR VI IKKE MEN SIDEN JEG VET IKKE GENTLIG???? IFØLGE NOEN SÅ MÅ JEG LA DET VÆRE SÅNN :D
