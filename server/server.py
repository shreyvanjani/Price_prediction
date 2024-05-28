from io import StringIO
import pandas as pd 
from flask import Flask, jsonify, request
import requests
import util


app = Flask(__name__)

@app.route('/hello')
def hello():
    return "Hi"


@app.route('/get_pincode', methods=['GET'])
def get_pincode():
    response = jsonify({
        'pincodes': util.get_pincode()          #util file
    })
    response.headers.add('access-control-allow-origin','*')
    return response

@app.route('/predict_home_price', methods=['GET','POST'])
def predict_home_price():
    bhk = int(request.form['bhk'])
    bathrooms = int(request.form['bathrooms'])
    living_area = int(request.form['living_area'])
    lot_area = int(request.form['lot_area'])
    floors = int(request.form['floors'])
    postal_code = int(request.form['postal_code'])
    distance_from_airport = int(request.form['distance_from_airport'])

    response = jsonify({
        'estimated_price': util.get_estimated_price(bhk, bathrooms, living_area, lot_area, floors, postal_code, distance_from_airport)
    })
    response.headers.add('access-control-allow-origin', '*')
    return response
    
@app.route('/fetch-pincode-data', methods=['GET','POST'])
def fetch_pincode_data():
    # Get the pincode from the query parameters
    pincode = request.args.get('pincode')
    if not pincode:
        return jsonify({"error": "PIN code is missing"}), 400

    # API endpoint with the provided PIN code
    api_url = f"https://api.data.gov.in/resource/5c2f62fe-5afa-4119-a499-fec9d604d5bd?api-key=579b464db66ec23bdd0000011c2b8a38f6a1409e4b0476daf248ecc8&format=csv&limit=4&filters%5Bpincode%5D={pincode}"

    try:
        response = requests.get(api_url)
        response.raise_for_status()  # Raise an HTTPError for bad responses

        data = StringIO(response.text)
        df = pd.read_csv(data)

        # Extract longitude and latitude values
        long = df['longitude'].values
        lat = df['latitude'].values
        
        # Create a list of coordinate pairs
        coordinates = list(zip(lat, long))

        # Convert the coordinates to a list of dictionaries for JSON serialization
        coordinates_list = [{"latitude": lat, "longitude": lon} for lat, lon in coordinates]

        return jsonify({"coordinates": coordinates_list})

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

 
if __name__ == "__main__":
    print("starting server")
    util.load_artifacts()
    app.run(debug = True)
