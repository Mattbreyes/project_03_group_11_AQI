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

# Helper Fn to get the visual for our box plot
def visual_2(query):
    cur.execute(query)
    rows = cur.fetchall()
    array_of_rows_visual_2 = []
    dict_of_row_visual_2 = {}

    for row in rows:
        dict_of_row_visual_2 = {}
        dict_of_row_visual_2["aqi"] = row[0]
        dict_of_row_visual_2["city_ascii"] = row[1]
        dict_of_row_visual_2["population"] = row[2]
        dict_of_row_visual_2["density"] = row[3]
        
        # Append the current dictionary to the list
        array_of_rows_visual_2.append(dict_of_row_visual_2)
 
    print('Type Visual1: ',type(array_of_rows_visual_2))
    return (array_of_rows_visual_2)

# Helper Fn to get the visual for our box plot
def visual_3(query):
    cur.execute(query)
    rows = cur.fetchall()
    array_of_rows_visual_2 = []
    dict_of_row_visual_2 = {}

    for row in rows:
        # print(row, flush = True)
        dict_of_row_visual_2 = {}
        dict_of_row_visual_2["Date"] = row[0]
        dict_of_row_visual_2["aqi"] = row[1]
        dict_of_row_visual_2["state_id"] = row[2]
        dict_of_row_visual_2["city_ascii"] = row[3]
        # Append the current dictionary to the list
        array_of_rows_visual_2.append(dict_of_row_visual_2)
 
    print('Type Visual2: ',type(array_of_rows_visual_2))
    return (array_of_rows_visual_2)

# End point for barplot
@airApp.route("/bar/<selected_date>")
def barplot(selected_date='2000-01-01'):
    if "favicon" not in selected_date:
        query_visual_2 = f"commit;SELECT aqi, city_ascii, population, density FROM us_aqi WHERE date = '{selected_date}' ORDER BY population DESC LIMIT 10;"
        json_data = visual_2(query_visual_2)
        # cur.close()
        return jsonify(json_data)
    return {"ERROR": "DATE NEEDED"}

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
        # # Call 2nd visual with query 
        # visual_2(query_visual_2)
        # cur.close()
        return dict_of_GeoJSON #, visual_2(query_visual_2) )
    return {"ERROR": "DATE NEEDED"}


@airApp.route('/line/<selected_date>')
def linePlot(selected_date='2000-01-01', state_id='CA'):
    if "favicon" not in selected_date:

        print(selected_date)
        add_year_array = selected_date.split("-")[0]
        selected_date_plus1yr = int(add_year_array)



        # query_visual_2 = f"commit;SELECT Date, aqi, state_id, city_ascii FROM us_aqi WHERE Date = '{selected_date}' ORDER BY Date limit 5;"
        query = f"""commit;SELECT Date, aqi, state_id, city_ascii 
                    FROM us_aqi WHERE Date = '{selected_date}' 
                    AND state_id like '{state_id}' 
                    ORDER BY aqi DESC limit 5;"""
        json_data = visual_3(query)
        json_data
        print(json_data,'\nLinePlot  ',query)
        # cur.close()
        return jsonify(json_data)
    return {"ERROR": "DATE NEEDED"}

# Logic to get the selected date plus 1 year from db
@airApp.route('/lineplot/<selected_date>')
def linePlot_yr1(selected_date='2000-01-01', state_id='CA'):
    if "favicon" not in selected_date:

        print(selected_date)
        add_year_array = selected_date.split("-")
        print('YEAR->',add_year_array)
        selected_date_plus1yr = int(add_year_array[0])+1
        selected_date = str(selected_date_plus1yr) +'-'+ add_year_array[1] +'-'+ add_year_array[2]
        print('linePlot_yr2',selected_date)

        # query_visual_2 = f"commit;SELECT Date, aqi, state_id, city_ascii FROM us_aqi WHERE Date = '{selected_date}' ORDER BY Date limit 5;"
        query = f"""commit;SELECT Date, aqi, state_id, city_ascii 
                    FROM us_aqi WHERE Date = '{selected_date}' 
                    AND state_id like '{state_id}' 
                    ORDER BY aqi DESC;"""
        json_data = visual_3(query)
        json_data
        print('LinePlot 1 YEAR',query)
        # cur.close()
        return jsonify(json_data)
    return {"ERROR": "DATE NEEDED"}


# Logic to get the selected date plus 2 year from db
@airApp.route('/lineplot2/<selected_date>')
def linePlot_yr2(selected_date='2000-01-01', state_id='CA'):
    if "favicon" not in selected_date:

        print(selected_date)
        add_year_array = selected_date.split("-")
        print('YEAR->',add_year_array)
        selected_date_plus2yr = int(add_year_array[0])+2
        selected_date = str(selected_date_plus2yr) +'-'+ add_year_array[1] +'-'+ add_year_array[2]
        print('linePlot_yr2',selected_date)

        # query_visual_2 = f"commit;SELECT Date, aqi, state_id, city_ascii FROM us_aqi WHERE Date = '{selected_date}' ORDER BY Date limit 5;"
        query = f"""commit;SELECT Date, aqi, state_id, city_ascii 
                    FROM us_aqi WHERE Date = '{selected_date}' 
                    AND state_id like '{state_id}' 
                    ORDER BY aqi DESC;"""
        json_data = visual_3(query)
        print('LinePlot 2 YEAR  ',query)
        # cur.close()
        return jsonify(json_data)
    return {"ERROR": "DATE NEEDED"}

# Logic to get the selected date plus 3 year from db
@airApp.route('/lineplot3/<selected_date>')
def linePlot_yr3(selected_date='2000-01-01', state_id='CA'):
    if "favicon" not in selected_date:

        print(selected_date)
        add_year_array = selected_date.split("-")
        print('YEAR->',add_year_array)
        selected_date_plus2yr = int(add_year_array[0])+3
        selected_date = str(selected_date_plus2yr) +'-'+ add_year_array[1] +'-'+ add_year_array[2]
        print('linePlot_yr2',selected_date)

        # query_visual_2 = f"commit;SELECT Date, aqi, state_id, city_ascii FROM us_aqi WHERE Date = '{selected_date}' ORDER BY Date limit 5;"
        query = f"""commit;SELECT Date, aqi, state_id, city_ascii 
                    FROM us_aqi WHERE Date = '{selected_date}' 
                    AND state_id like '{state_id}' 
                    ORDER BY aqi DESC;"""
        json_data = visual_3(query)
        print('LinePlot 3 YEAR  ',query)
        # cur.close()
        return jsonify(json_data)
    return {"ERROR": "DATE NEEDED"}

# Logic to get the selected date plus 4 year from db
@airApp.route('/lineplot4/<selected_date>')
def linePlot_yr4(selected_date='2000-01-01', state_id='CA'):
    if "favicon" not in selected_date:

        print(selected_date)
        add_year_array = selected_date.split("-")
        print('YEAR->',add_year_array)
        selected_date_plus2yr = int(add_year_array[0])+4
        selected_date = str(selected_date_plus2yr) +'-'+ add_year_array[1] +'-'+ add_year_array[2]
        print('linePlot_yr2',selected_date)

        # query_visual_2 = f"commit;SELECT Date, aqi, state_id, city_ascii FROM us_aqi WHERE Date = '{selected_date}' ORDER BY Date limit 5;"
        query = f"""commit;SELECT Date, aqi, state_id, city_ascii 
                    FROM us_aqi WHERE Date = '{selected_date}' 
                    AND state_id like '{state_id}' 
                    ORDER BY aqi DESC;"""
        json_data = visual_3(query)
        print('LinePlot 4 YEAR  ',query)
        # cur.close()
        return jsonify(json_data)
    return {"ERROR": "DATE NEEDED"}

# Logic to get the selected date plus 5 year from db
@airApp.route('/lineplot5/<selected_date>')
def linePlot_yr5(selected_date='2000-01-01', state_id='CA'):
    if "favicon" not in selected_date:

        print(selected_date)
        add_year_array = selected_date.split("-")
        print('YEAR->',add_year_array)
        selected_date_plus2yr = int(add_year_array[0])+5
        selected_date = str(selected_date_plus2yr) +'-'+ add_year_array[1] +'-'+ add_year_array[2]
        print('linePlot_yr2',selected_date)

        # query_visual_2 = f"commit;SELECT Date, aqi, state_id, city_ascii FROM us_aqi WHERE Date = '{selected_date}' ORDER BY Date limit 5;"
        query = f"""commit;SELECT Date, aqi, state_id, city_ascii 
                    FROM us_aqi WHERE Date = '{selected_date}' 
                    AND state_id like '{state_id}' 
                    ORDER BY aqi DESC;"""
        json_data = visual_3(query)
        print('LinePlot 5 YEAR  ',query)
        # cur.close()
        return jsonify(json_data)
    return {"ERROR": "DATE NEEDED"}
# @airApp.route('/test/stableDiff')
# def stableDiff():
#     if "favicon" not in selected_date:
#         pass
#     return jsonify(1)

if __name__ == '__main__':
    airApp.run(debug=True)
    