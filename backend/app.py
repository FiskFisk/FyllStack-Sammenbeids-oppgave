from flask import Flask, request, jsonify, session, send_from_directory
import mysql.connector
import json
import os
import bcrypt
from config import db_config
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "your_secret_key_here"
CORS(app, supports_credentials=True)  # Allow cookies (sessions) across requests

# Load the quiz data from the JSON file at startup
QUIZ_FILE_PATH = os.path.join(os.path.dirname(__file__), 'quizzes.json')

# Add this route to serve quizzes.json from the backend folder
@app.route('/quizzes.json', methods=['GET'])
def get_quiz():
    return send_from_directory(os.path.dirname(__file__), 'quizzes.json')

with open(QUIZ_FILE_PATH, 'r') as f:
    quiz_data = json.load(f)

def get_db_connection():  # This basically takes the database configuration from config.py and connects to the database YAY!
    return mysql.connector.connect(**db_config)

# Route for login
@app.route('/login', methods=['POST'])
def login():
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
                return jsonify({"message": "Klarte å logge inn YAY!", "redirect": "/main-menu"}), 200  # Update redirect path
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
        print("Received data:", data)  # Print received data

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

# Route som le
@app.route('/quiz/submit', methods=['POST'])
def submit_quiz():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        data = request.get_json()
        # Checks that the info is there
        if 'quizIdentifier' not in data or 'totalScore' not in data:
            return jsonify({"error": "quizIdentifier and totalScore are required"}), 400

        # Check if the user is authenticated (broski må være authenticated)
        brukerID = session.get('brukerID')
        if not brukerID:
            return jsonify({"error": "User not authenticated"}), 401

        # Use the quiz name as the identifier
        quizIdentifier = data['quizIdentifier']
        totalScore = data['totalScore']

        # Verify that the quiz exists in the JSON data
        if quizIdentifier not in quiz_data:
            return jsonify({"error": "Quiz not found"}), 404

        # Insert the quiz result into the database
        query_insert = """
            INSERT INTO quizResult (brukerID, quizIdentifier, totalScore)
            VALUES (%s, %s, %s)
        """
        cursor.execute(query_insert, (brukerID, quizIdentifier, totalScore))
        conn.commit()

        return jsonify({"message": "Quiz result submitted successfully"}), 201

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
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
    app.run(debug=True, host='0.0.0.0', port=5000)  # Run the Flask app
