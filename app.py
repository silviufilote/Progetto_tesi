from flask import Flask, jsonify, render_template, url_for, request
from model import forecastArima
from neural import neural_prediction


app = Flask(__name__)


@app.route("/")
def empty_page():
    return render_template('index.html')



@app.route("/index.html")
def index_page():
    return render_template('index.html')



@app.route("/home.html")
def home_page():
    return render_template('home.html')


@app.route("/statistics.html")
def statistics_page():
    return render_template('statistics.html')
    

@app.route("/check.html")
def check_page():
    return render_template('check.html')


@app.route("/compare.html")
def compare_page():
    return render_template('compare.html')


@app.route("/forecast.html", methods=['GET', 'POST'])
def forecast_coin():
    if request.method == 'POST':
        coin = request.form['coin']
        daysAgo = request.form['yValues']

        yValues = forecastArima(coin, daysAgo)
        return yValues
       
    else:
        return 'non funziona'


@app.route("/neural.html", methods=['GET', 'POST'])
def neural_coins():
    if request.method == 'POST':
        coin1 = request.form['coin1']
        coin2 = request.form['coin2']
        coin3 = request.form['coin3']
        daysAgo = request.form['yValues']

        yValues = neural_prediction(coin1, coin2, coin3, daysAgo)
        return yValues
       
    else:
        return 'non funziona'


with app.test_request_context():
    print(url_for('forecast_coin'))
    print(url_for('neural_coins'))


if __name__ == "__main__":
    app.run(debug=True) ## sarebbe false
    ## app.run(use_reloader=False)







    
   