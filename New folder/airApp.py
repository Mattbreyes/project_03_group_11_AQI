import psycopg2
from flask import Flask, jsonify
from datetime import datetime

#################################################
# Database Setup
#################################################
conn = psycopg2.connect(database="air_quality_db",
                            user="postgres",
                            password="postgres",
                            host="localhost",
                            port="5432")
cur = conn.cursor()


conn.commit()
cur.close()
conn.close()

#################################################
# Flask Setup
#################################################

airApp = Flask(__name__)


#################################################
# Flask Routes
#################################################

@airApp.route("/")
def index():
    return(
        f"4. To get the values of aqi, city_ascii, state_id, lat, lng  and population for the <b>specific date</b> of your choice,\
            append the date to the current URL in the following format:"
        f"<h4> yyyy-mm-dd </h4>" 
        f"where 1980-01-01 <= yyyy-mm-dd <= 2022-05-31.<br><br>"
    )
 

@airApp.route("/<selected_date>")
def start(selected_date):
    #city = city.capitalize()
    #query = f"SELECT   aqi, city_ascii, state_id, lat, lng, population FROM us_aqi WHERE city_ascii = '{city}'"
    
    query = f"SELECT   aqi, city_ascii, state_id, lat, lng, population, date FROM us_aqi WHERE date = '{selected_date}'"

    cur.execute(query)
    rows = cur.fetchall()
    # Create a list to store all the rows as a dictionary (list of dictionaries)
    array_of_rows = []

    # Create a dictionary for the current row
    dict_of_row = {}

    for row in rows:
        dict_of_row["aqi"] = row[0]
        dict_of_row["city_ascii"] = row[1]
        dict_of_row["state_id"] = row[2]
        dict_of_row["lat"] = row[3]
        dict_of_row["lng"] = row[4]
        dict_of_row["population"] = row[5]
        dict_of_row["date"] = str(row[6])
        #dict_of_row["date"] = row[6]
        
        # Append the current dictionary to the list
        array_of_rows.append(dict_of_row)

    # Find the earliest date in the database
    #query1 = "SELECT MIN(date) FROM us_aqi"
    #cur.execute(query1)
    #min_date = cur.fetchall()
    #min_date = str(min_date[0][0])
  
    conn.commit()
    cur.close()
    conn.close()

    return array_of_rows


if __name__ == '__main__':
    airApp.run(debug=True)
    