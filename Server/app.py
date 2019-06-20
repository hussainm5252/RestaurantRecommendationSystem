from flask import Flask, jsonify, request
from flask_cors import CORS
from Main.GetReviews import getReviewInformation

app = Flask(__name__)
CORS(app)

@app.route('/get_restaurant_info', methods=['POST'])
def getRestaurantInfo():
    search_term = request.get_json()['search_term']
    print(search_term)
    restaurant_info = getReviewInformation(search_term)
    return jsonify(restaurant_info)

if __name__ == '__main__':
    app.run(debug=True)
