from flask import Flask, request, jsonify, session, send_from_directory
import mysql.connector
import json
import os
import bcrypt
from config import db_config
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "your_secret_key_here"
CORS(app, supports_credentials=True)

# Load quiz data from file
QUIZ_FILE_PATH = os.path.join(os.path.dirname(__file__), 'quizzes.json')

@app.route('/quizzes.json', methods=['GET'])
def get_quiz():
    return send_from_directory(os.path.dirname(__file__), 'quizzes.json')

with open(QUIZ_FILE_PATH, 'r') as f:
    quiz_data = json.load(f)

# Database connection
def get_db_connection():
    return mysql.connector.connect(**db_config)

# Login
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

        if user and bcrypt.checkpw(passord.encode('utf-8'), user['passord'].encode('utf-8')):
            session['brukerID'] = user['brukerID']
            return jsonify({"message": "Klarte å logge inn", "redirect": "/main-menu"}), 200
        elif user:
            return jsonify({"error": "Feil passord."}), 401
        else:
            return jsonify({"error": "Bruker ble ikke funnet."}), 404

    except mysql.connector.Error as e:
        print(f"Database error during login: {e}")
        return jsonify({"error": "En feil i databasen oppsto"}), 500
    except Exception as e:
        print(f"Unexpected error during login: {e}")
        return jsonify({"error": "Det skjedde en uventet feil"}), 500
    finally:
        cursor.close()
        conn.close()

# Logout
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"}), 200

# Create new user
@app.route('/create_user', methods=['POST'])
def create_user():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        data = request.get_json()

        if not data or not all(key in data for key in ('e_post', 'passord', 'fullnavn', 'telefon')):
            return jsonify({"error": "E-post, passord, fullnavn, og telefon er påkrevd"}), 400

        e_post = data['e_post']
        passord = data['passord']
        fullnavn = data['fullnavn']
        telefon = data['telefon']

        query = "SELECT e_post FROM bruker WHERE e_post = %s"
        cursor.execute(query, (e_post,))
        if cursor.fetchone():
            return jsonify({"error": "E-posten er allerede registrert"}), 409

        hashed_passord = bcrypt.hashpw(passord.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        query = "INSERT INTO bruker (e_post, passord, fullnavn, telefon) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (e_post, hashed_passord, fullnavn, telefon))
        conn.commit()

        return jsonify({"message": "Brukeren ble opprettet!", "redirect": "/"}), 201

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Something went wrong"}), 500
    finally:
        cursor.close()
        conn.close()

# Submit quiz result
@app.route('/quiz/submit', methods=['POST'])
def submit_quiz():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        data = request.get_json()
        if 'quizName' not in data or 'totalScore' not in data:
            return jsonify({"error": "quizName and totalScore are required"}), 400

        brukerID = session.get('brukerID')
        if not brukerID:
            return jsonify({"error": "User not authenticated"}), 401

        quizName = data['quizName']
        score_value = data['totalScore']

        quiz_info = next((quiz for quiz in quiz_data.get("quizzes", []) if quiz["name"] == quizName), None)
        if not quiz_info:
            return jsonify({"error": "Quiz not found"}), 404

        query_insert_result = "INSERT INTO quizResult (brukerID, quizName, totalScore) VALUES (%s, %s, %s)"
        cursor.execute(query_insert_result, (brukerID, quizName, score_value))

        query_bruker = "SELECT fullnavn FROM bruker WHERE brukerID = %s"
        cursor.execute(query_bruker, (brukerID,))
        bruker = cursor.fetchone()
        if not bruker:
            return jsonify({"error": "User not found"}), 404
        brukernavn = bruker['fullnavn']

        query_select_winner = "SELECT highScore FROM quizWinner WHERE quizName = %s"
        cursor.execute(query_select_winner, (quizName,))
        winner_record = cursor.fetchone()

        if winner_record and score_value > winner_record['highScore']:
            query_update_winner = """
                UPDATE quizWinner
                SET winnerBrukerID = %s, winnerName = %s, highScore = %s, lastUpdated = CURRENT_TIMESTAMP
                WHERE quizName = %s
            """
            cursor.execute(query_update_winner, (brukerID, brukernavn, score_value, quizName))
        elif not winner_record:
            query_insert_winner = """
                INSERT INTO quizWinner (quizName, winnerBrukerID, winnerName, highScore)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(query_insert_winner, (quizName, brukerID, brukernavn, score_value))

        conn.commit()
        return jsonify({"message": "Quiz result submitted successfully"}), 201

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        conn.rollback()
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        conn.rollback()
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        cursor.close()
        conn.close()

# Get all quiz results
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
        return jsonify({"error": "Database error occurred"}), 500
    finally:
        cursor.close()
        conn.close()


# Route to get user details
@app.route('/user/details', methods=['GET'])
def get_user_details():
    brukerID = session.get('brukerID')  # Get user ID from the session
    if not brukerID:
        return jsonify({"error": "User not authenticated"}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = "SELECT fullnavn FROM bruker WHERE brukerID = %s"
        cursor.execute(query, (brukerID,))
        user = cursor.fetchone()

        if user:
            return jsonify(user), 200
        else:
            return jsonify({"error": "User not found"}), 404

    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500
    finally:
        cursor.close()
        conn.close()
  
>>>>>>> 5ab0a9fa79a201a3c80a811fc0af239abda3c6a7

# Get current user's full name
@app.route('/user/name', methods=['GET'])
def get_user_name():
    brukerID = session.get('brukerID')
    if not brukerID:
        return jsonify({"error": "User not authenticated"}), 401

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT fullnavn FROM bruker WHERE brukerID = %s"
        cursor.execute(query, (brukerID,))
        user = cursor.fetchone()
        if user:
            return jsonify({"fullnavn": user["fullnavn"]}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except mysql.connector.Error as e:
        print(f"Database error: {e}")
        return jsonify({"error": "Database error occurred"}), 500
    finally:
        cursor.close()
        conn.close()

# Health check
@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"}), 200

# Test endpoint
@app.route("/api/test", methods=["GET"])
def test():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
