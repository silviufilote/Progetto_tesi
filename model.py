from pycoingecko import CoinGeckoAPI
from datetime import date, timedelta
import numpy as np, pandas as pd, matplotlib.pyplot as plt

import math 
from statsmodels.tsa.arima.model import ARIMA

cg = CoinGeckoAPI()

def forecastArima(coin, daysAgo = 100):
    data = cg.get_coin_market_chart_by_id(id=coin, vs_currency='eur', days=daysAgo, interval = 'daily')['prices']
    array_completo = []
    prices = []
    dates = []
    for i in range(len(data)):
        d = date.today() - timedelta(len(data) - i - 1)
        array_completo.append([str(d), data[i][1]])
        prices.append([data[i][1]])
        dates.append(str(d))
    
    
    geocols = ['price']
    df = pd.DataFrame(prices, columns=geocols)
    df.index = dates
    df.index.name ='date'

    model2 = ARIMA(df['price'], order =(4,1,0))
    model2 = model2.fit()

    index_future_dates = pd.date_range(start = str(date.today() + timedelta(1)), end= str(date.today() + timedelta(7)))
    pred = model2.predict(start=len(df), end=len(df) +6, typ='levels').rename('ARIMA Predictions')
    pred.index = index_future_dates

    return str(list(pred))