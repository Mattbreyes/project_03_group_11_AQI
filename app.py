import psycopg2
import json
from flask import Flask, jsonify, render_template
from datetime import datetime
import sys
import os

#################################################
# Database Setup
#################################################
conn = psycopg2.connect(database="postgres",
                            user="postgres",
                            password="postgres",
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
    return render_template('index1.html')


@airApp.route("/<selected_date>")
def start(selected_date):

    # with open('us-states.json') as f:
    #     geojson_file = json.loads(f.read())
    if "favicon" not in selected_date:
        query = f"commit;SELECT   aqi, city_ascii, state_id, state_name, lat, lng, population, id FROM us_aqi WHERE date = '{selected_date}';"

        
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

        return dict_of_GeoJSON
    return {"ERROR": "DATE NEEDED"}
    
""" conn.commit()
    cur.close()
    conn.close()
 """    #return array_of_rows
    

if __name__ == '__main__':
    airApp.run(debug=True)
    