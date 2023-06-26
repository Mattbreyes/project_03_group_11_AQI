import psycopg2
import json
from flask import Flask, jsonify, render_template
from datetime import datetime
import sys
import os

#################################################
# Database Setup
#################################################
conn = psycopg2.connect(database="project3-aqi",
                            user="postgres",
                            password="YrscSVMAD@2NQqK",
                            host="localhost",
                            port="5432")
cur = conn.cursor()



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
    #     f"4. To get the values of aqi, city_ascii, state_id, lat, lng  and population for the <b>specific date</b> of your choice,\
    #         append the date to the current URL in the following format:"
    #     f"<h4> yyyy-mm-dd </h4>" 
    #     f"where 1980-01-01 <= yyyy-mm-dd <= 2022-05-31.<br><br>"
    # )
    return render_template('index1.html')

# Helper Fn to get the visual for our box plot
def visual_2(query):
    cur.execute(query)
    rows = cur.fetchall()
    array_of_rows_visual_2 = []
    dict_of_row_visual_2 = {}

    for row in rows:
            # print(row, flush = True)
            dict_of_row_visual_2 = {}
            dict_of_row_visual_2["aqi"] = row[0]
            dict_of_row_visual_2["city_ascii"] = row[1]
            dict_of_row_visual_2["population"] = row[2]
            dict_of_row_visual_2["density"] = row[3]
            
            # Append the current dictionary to the list
            array_of_rows_visual_2.append(dict_of_row_visual_2)
    dict_of_GeoJSON = {"type": "FeatureCollection",
                        "features": []
                        }

    feature = {}
    array_of_features = []

    for item in array_of_rows_visual_2:
        feature = {}
        feature = {
            "properties": {
                "aqi": item["aqi"],
                "city_ascii": item["city_ascii"],
                "population": item["population"]

            },
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [
                    None
                ]
            },
        }
        array_of_features.append(feature)
    dict_of_GeoJSON["type"] = "FeatureCollection"
    dict_of_GeoJSON["features"] = array_of_features
    print(dict_of_GeoJSON)
    print('visual 2')
    return dict_of_GeoJSON


@airApp.route("/<selected_date>")
def start(selected_date='2000-01-01'):
    #city = city.capitalize()
    # print(selected_date)
    with open('us-states.json') as f:
        geojson_file = json.loads(f.read())
    if "favicon" not in selected_date:
        query = f"commit;SELECT   aqi, city_ascii, state_id, state_name, lat, lng, population, id FROM us_aqi WHERE date = '{selected_date}';"
        # request.form.get()

        # print(query)
        cur.execute(query)
        rows = cur.fetchall()
        #print (rows)
        # Create a list to store all the rows as a dictionary (list of dictionaries)
        array_of_rows = []

        # Create a dictionary for the current row
        dict_of_row = {}

        for row in rows:
            # print(row, flush = True)
            dict_of_row = {}
            dict_of_row["aqi"] = row[0]
            dict_of_row["city_ascii"] = row[1]
            dict_of_row["state_id"] = row[2]
            dict_of_row["state_name"] = row[3]
            dict_of_row["lat"] = row[4]
            dict_of_row["lng"] = row[5]
            dict_of_row["population"] = row[6]
            dict_of_row["id"] = row[7]
            
            # Append the current dictionary to the list
            array_of_rows.append(dict_of_row)
    
        ######################################################
        # Convert to GeoJSON

        dict_of_GeoJSON = {"type": "FeatureCollection",
                        "features": []
                        }
        

        feature = {}
        array_of_features = []
        for item in array_of_rows:
            # Iterate through the geojson file to input the geometry values as an array if the states match
            feature = {}
            feature = {
                "properties": {
                    "aqi": item["aqi"],
                    "city_ascii": item["city_ascii"],
                    "state_id": item["state_id"],
                    "population": item["population"]

                },
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        item["lng"], 
                        item["lat"]
                    ]
                },
                "id": item["id"],
            }
            array_of_features.append(feature)

        dict_of_GeoJSON["type"] = "FeatureCollection"
        dict_of_GeoJSON["features"] = array_of_features
        query_visual_2 = f"commit;SELECT aqi, city_ascii, population, density FROM us_aqi WHERE date = '{selected_date}' ORDER BY population DESC LIMIT 10;"
        # Call 2nd visual with query 
        visual_2(query_visual_2)
        return dict_of_GeoJSON
    return {"ERROR": "DATE NEEDED"}

if __name__ == '__main__':
    airApp.run(debug=True)
    