import json
import pickle
import numpy as np

__pincodes = None           #global Variables
__data_columns = None 
__model = None

def get_pincode():
    return __pincodes

def load_artifacts():
    print("loading artifacts")
    global __data_columns
    global __pincodes
    global __model

    try:
        with open("../ml_model/postal.json", 'r') as f:
            __pincodes = json.load(f)['data_columns']

        with open("../ml_model/house_price_model.pickle", 'rb') as g:  # Open pickle file in binary mode
            __model = pickle.load(g)

        print("Artifacts loaded successfully.")
    except Exception as e:
        print(f"Error loading artifacts: {e}")
    
    
    
    
def get_estimated_price(bedroom, bath, living_area, lot_area, floors, postal_code, distance_from_airport):

    res = np.zeros(7)
    # Assign input variables to the correct indices
    res[0] = bedroom
    res[1] = bath
    res[2] = living_area
    res[3] = lot_area
    res[4] = floors
    res[6] = distance_from_airport
    res[5] = postal_code
        
    return round(__model.predict([res])[0],2)

if __name__ == "__main__":
    load_artifacts()
    print(get_estimated_price(5,5,9200,35069,2,122071,53))
    print(get_pincode())