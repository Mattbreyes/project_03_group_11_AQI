import psycopg2
from flask import Flask, jsonify, render_template
from datetime import datetime
import json

#################################################
# Database Setup
#################################################
conn = psycopg2.connect(database="postgres",
                            user="postgres",
                            password="postgres",
                            host="localhost",
                            port="5432")
cur = conn.cursor()


# conn.commit()
# cur.close()
# conn.close()

#################################################
# Flask Setup
#################################################

airApp = Flask(__name__)


#################################################
# Flask Routes
#################################################

@airApp.route("/")
def index():
    # return(
    #     f"To get the values of aqi, city_ascii, state_id, lat, lng  and population for the <b>specific date</b> of your choice,\
    #         append the date to the current URL in the following format:"
    #     f"<h4> yyyy-mm-dd </h4>" 
    #     f"where 1980-01-01 <= yyyy-mm-dd <= 2022-05-31.<br><br>"
    # )
    return render_template("index.html")
 

# @airApp.route("/<selected_date>")
# def start(selected_date):

#     conn = psycopg2.connect(database="postgres",
#                             user="postgres",
#                             password="postgres",
#                             host="localhost",
#                             port="5432")
#     cur = conn.cursor()
#     #city = city.capitalize()
#     #query = f"SELECT   aqi, city_ascii, state_id, lat, lng, population FROM us_aqi WHERE city_ascii = '{city}'"
    
#     query = f"SELECT   aqi, city_ascii, state_id, lat, lng, population, date FROM us_aqi WHERE date = '{selected_date}' AND state_id = 'CA'"

#     cur.execute(query)
#     rows = cur.fetchall()
#     # Create a list to store all the rows as a dictionary (list of dictionaries)
#     array_of_rows = []

#     for row in rows:
#         # Create a dictionary for the current row
#         dict_of_row = {}

#         # Append the value to the dictionary
#         dict_of_row["aqi"] = row[0]
#         dict_of_row["city_ascii"] = row[1]
#         dict_of_row["state_id"] = row[2]
#         dict_of_row["lat"] = row[3]
#         dict_of_row["lng"] = row[4]
#         dict_of_row["population"] = row[5]
#         dict_of_row["date"] = str(row[6])
#         #dict_of_row["date"] = row[6]
        
#         # Append the current dictionary to the list
#         array_of_rows.append(dict_of_row)

#     return jsonify(array_of_rows)

@airApp.route("/choropleth/<selected_date>/")
def choropleth(selected_date):
    conn = psycopg2.connect(database="postgres",
                            user="postgres",
                            password="postgres",
                            host="localhost",
                            port="5432")
    cur = conn.cursor()
    
    query = f"SELECT aqi, state_id, lat, lng, population FROM us_aqi WHERE date = '{selected_date}'"
    cur.execute(query)
    rows1 = cur.fetchall()
    
#     geojson_data_point = {
#        "type": "FeatureCollection",
#        "name" : "AQI data",
#        "properties": properties
#    }

    list = []
    for row in rows1:
        dict = {}
        dict["aqi"] = row[0]
        dict["state"] = row[1]
        dict["lat"] = row[2]
        dict["lng"] = row[3]
        dict["population"] = row[4]
        list.append(dict)

    # properties = {
    #     'aqi' : aqi,
    #     'state' : state,
    #     'lat' : lat,
    #     'lng' : lng,
    #     'population' : POPULATION
    # }

    return jsonify(list)





if __name__ == '__main__':
    airApp.run(debug=True)
    