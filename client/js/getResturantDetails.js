//const regex = / /gm;
    function getReviews() {
        restaurant = document.getElementById('restaurant').value;
        restaurant = restaurant.replace(regex, '');
        if (restaurant) {
            var body = {
                search_term: restaurant
            };
            var options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            };
            fetch('http://127.0.0.1:5000/get_restaurant_info', options).then(function (response) {
                return response.json();
            }).then(function (data) {
                // THis is where the data is obtained
                console.log(data);
                results = document.getElementById('results');
                document.getElementById("statsPos").innerHTML = '';
                document.getElementById("statsNeu").innerHTML = '';
                document.getElementById("statsNeg").innerHTML = '';
                document.getElementById("ResNotFound").innerHTML = '';
                document.getElementById("results").innerHTML = '';
                if (data.restaurant_info == undefined || data.restaurant_info.length == 0) {
                    $('#ResNotFound').append('<strong>Resturant Not Found</strong>');
                }
                data.restaurant_info.forEach(res => {
                    $('#results').append('<hr />');
                    $('#results').append('<strong>Restaurant Name:</strong> '.fontsize(1) + res.restaurant_name);
                    $('#results').append('<br />');
                    $('#results').append('<strong>Restaurant Location:</strong> '.fontsize(1) + res.location);
                    $('#results').append('<br />');
                    //$('#results').append('Restaurant ID: ' + res.restaurant_id);
                    //$('#results').append('<br />');
                    $('#results').append('<strong>Review Statistics:</strong>'.fontsize(1) + ' Positive - ' + JSON.stringify(res.review_stats.pos) + '  Neutral - ' + JSON.stringify(res.review_stats.neu) + '  Negative - ' + JSON.stringify(res.review_stats.neg));
                    $('#results').append('<br />');
                    $('#results').append('Reviews'.fontsize(2));
                    $('#results').append('<br />');
                    var c = 1;
                    res.restaurant_reviews.forEach(review => {
                        $('#results').append('<strong>Review ' + c + ': </strong>' + review.review_text);
                        $('#results').append('<br />');
                        $('#results').append('<strong>Review ' + c + ' Sentiment: </strong>' + review.review_sentiment);
                        $('#results').append('<br />');
                        c++;
                        // console.log('Review: ' + review.review_text);
                        // console.log('Sentiment: ' + review.review_sentiment);
                    });
                    $('#results').append('<hr />');
                });
                $('#statsPos').append('<strong>Total Positive Reviews: </strong>' + JSON.stringify(data.all_restaurant_stats.tot_pos));
                $('#statsNeu').append('<strong>Total Neutral Reviews: </strong>' + JSON.stringify(data.all_restaurant_stats.tot_neu));
                $('#statsNeg').append('<strong>Total Negative Reviews: </strong>' + JSON.stringify(data.all_restaurant_stats.tot_neg));
            }).catch(function (error) {
                console.error(error);
            });
        }
    }