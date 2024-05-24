from flask import Flask, jsonify, request
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
    
    
if __name__ == "__main__":
    print("starting server")
    util.load_artifacts()
    app.run()
