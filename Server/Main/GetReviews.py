import requests
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

analyzer = SentimentIntensityAnalyzer()


def getReviewInformation(search_term):

    searchURL = "https://developers.zomato.com/api/v2.1/search?q=" + search_term
    searchHeaders = {'Accept': 'application/json', 'user-key': '25173136abdad28dc9442082a0cc609e'}
    response = requests.get(url=searchURL, headers=searchHeaders)
    data = response.json()

    restaurants = data['restaurants']

    total_posReviews = 0
    total_negReviews = 0
    total_neuReviews = 0

    final_outcome = []
    for restaurant in restaurants:
        posReviews = 0
        negReviews = 0
        neuReviews = 0

        total_compound_score = 0
        count = 0

        outcome = {}
        outcome['restaurant_name'] = restaurant['restaurant']['name']
        outcome['location'] = restaurant['restaurant']['location']['locality']
        outcome['restaurant_id'] = restaurant['restaurant']['R']['res_id']
        outcome['restaurant_reviews'] = []
        reviewURL = "https://developers.zomato.com/api/v2.1/reviews?res_id=" + str(restaurant['restaurant']['R']['res_id'])
        print(outcome)
        new_response = requests.get(url=reviewURL, headers=searchHeaders)
        new_data = new_response.json()

        for review in new_data['user_reviews']:
            review_info = {}
            review_text = review['review']['review_text']
            review_info['review_text'] = review_text
            compound_score = analyzer.polarity_scores(review_text)['compound']
            total_compound_score += compound_score
            count += 1
            if compound_score > 0.5:
                review_info['review_sentiment'] = 'Positive'
                posReviews+=1
                total_posReviews+=1
            elif compound_score < -0.5:
                review_info['review_sentiment'] = 'Negative'
                negReviews+=1
                total_negReviews+=1
            else:
                review_info['review_sentiment'] = 'Neutral'
                neuReviews+=1
                total_neuReviews+=1

            outcome['restaurant_reviews'].append(review_info)

        average_compund_score = total_compound_score / count
        outcome['review_stats'] = {'pos': posReviews, 'neg': negReviews, 'neu': neuReviews, 'average_compound_score': average_compund_score}
        final_outcome.append(outcome)

    return_result = {'restaurant_info': final_outcome, 'all_restaurant_stats': {'tot_pos': total_posReviews, 'tot_neg': total_negReviews, 'tot_neu': total_neuReviews}}

    return return_result
