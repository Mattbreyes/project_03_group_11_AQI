from sqlalchemy import create_engine
from flask import Flask
import psycopg2

app = Flask(__name__)

@app.route('/')
def index():
    conn = psycopg2.connect(database="postgres", 
                        user="postgres",
                        password="postgres", 
                        host="localhost", port="5432")
    cur = conn.cursor()

    cur.execute("SELECT * FROM us_aqi")
    conn.commit()
    cur.close()
    conn.close()

    return 'it works!'

if __name__ == '__main__':
    app.run(debug=True)