# First we will import the necessary Library 

import os
import pandas as pd
import numpy as np
import math
import datetime as dt

# For Evalution we will use these library

from sklearn.metrics import mean_squared_error, mean_absolute_error, explained_variance_score, r2_score 
from sklearn.metrics import mean_poisson_deviance, mean_gamma_deviance, accuracy_score
from sklearn.preprocessing import MinMaxScaler

# For model building we will use these library

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.layers import LSTM


# My libraries
from pycoingecko import CoinGeckoAPI
from datetime import date, timedelta
import concurrent.futures


cg = CoinGeckoAPI()
metrics_neural = []

def create_dataset(dataset, time_step=1):
    dataX, dataY = [], []
    for i in range(len(dataset)-time_step-1):
        a = dataset[i:(i+time_step), 0]   ### i=0, 0,1,2,3-----99   100 
        dataX.append(a)
        dataY.append(dataset[i + time_step, 0])
    return np.array(dataX), np.array(dataY)

def neural_network(coin, daysAgo):
    metrics_neural.clear()
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
    maindf = pd.DataFrame(prices, columns=geocols)
    maindf.index = dates
    maindf.index.name ='date'

    closedf = maindf
    closedf = closedf.price
    scaler=MinMaxScaler(feature_range=(0,1))
    closedf=scaler.fit_transform(np.array(closedf).reshape(-1,1))

    training_size=int(len(closedf)*0.60)
    test_size=len(closedf)-training_size
    train_data,test_data=closedf[0:training_size,:],closedf[training_size:len(closedf),:1]

    time_step = 15
    X_train, y_train = create_dataset(train_data, time_step)
    X_test, y_test = create_dataset(test_data, time_step)

    model=Sequential()
    model.add(LSTM(10,input_shape=(None,1),activation="relu"))
    model.add(Dense(1))
    model.compile(loss="mean_squared_error",optimizer="adam")
    history = model.fit(X_train,y_train,validation_data=(X_test,y_test),epochs=200,batch_size=32,verbose=1)

    x_input=test_data[len(test_data)-time_step:].reshape(1,-1)
    temp_input=list(x_input)
    temp_input=temp_input[0].tolist()

     ## metrics
        
    train_predict=model.predict(X_train)
    test_predict=model.predict(X_test)
    train_predict.shape, test_predict.shape

    train_predict = scaler.inverse_transform(train_predict)
    test_predict = scaler.inverse_transform(test_predict)
    original_ytrain = scaler.inverse_transform(y_train.reshape(-1,1)) 
    original_ytest = scaler.inverse_transform(y_test.reshape(-1,1)) 
    
    rmse_train = math.sqrt(mean_squared_error(original_ytrain,train_predict))
    mse_train = mean_squared_error(original_ytrain,train_predict)
    mae_train = mean_absolute_error(original_ytrain,train_predict)
                           
    rmse_test = math.sqrt(mean_squared_error(original_ytest,test_predict))
    mse_test = mean_squared_error(original_ytest,test_predict)
    mae_test = mean_absolute_error(original_ytest,test_predict)  
                          
    rscore_train = r2_score(original_ytrain, train_predict)
    rscore_test = r2_score(original_ytest, test_predict)
                          
    mgd_train = mean_gamma_deviance(original_ytrain, train_predict)
    mgd_test = mean_gamma_deviance(original_ytest, test_predict)
   
    mpd_train = mean_poisson_deviance(original_ytrain, train_predict)                     
    mpd_test = mean_poisson_deviance(original_ytest, test_predict)                    
    
    metrics_neural.append(rmse_train)
    metrics_neural.append(mse_train)
    metrics_neural.append(mae_train)
    metrics_neural.append(rscore_train)
    metrics_neural.append(mgd_train)
    metrics_neural.append(mpd_train)
    
    metrics_neural.append(rmse_test)                      
    metrics_neural.append(mse_test)
    metrics_neural.append(mae_test)
    metrics_neural.append(rscore_test)                    
    metrics_neural.append(mgd_test)
    metrics_neural.append(mpd_test)

    from numpy import array

    lst_output=[]
    n_steps=time_step
    i=0
    pred_days = 30
    while(i<pred_days):
        
        if(len(temp_input)>time_step):
            
            x_input=np.array(temp_input[1:])
            #print("{} day input {}".format(i,x_input))
            x_input = x_input.reshape(1,-1)
            x_input = x_input.reshape((1, n_steps, 1))
            
            yhat = model.predict(x_input, verbose=0)
            #print("{} day output {}".format(i,yhat))
            temp_input.extend(yhat[0].tolist())
            temp_input=temp_input[1:]
            #print(temp_input)
        
            lst_output.extend(yhat.tolist())
            i=i+1
            
        else:
            
            x_input = x_input.reshape((1, n_steps,1))
            yhat = model.predict(x_input, verbose=0)
            temp_input.extend(yhat[0].tolist())
            
            lst_output.extend(yhat.tolist())
            i=i+1
    
    lstmdf=closedf.tolist()
    lstmdf.extend((np.array(lst_output).reshape(-1,1)).tolist())
    lstmdf=scaler.inverse_transform(lstmdf).reshape(1,-1).tolist()[0]

    return list(lstmdf)


def neural_prediction_coin(coin, daysAgo):
    return_value = neural_network(coin, daysAgo)
    return str(return_value)


def neural_prediction_coins3(coin1, coin2, coin3, daysAgo):
    total_list = []
    
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future1 = executor.submit(neural_network, coin1, daysAgo)
        future2 = executor.submit(neural_network, coin2, daysAgo)
        future3 = executor.submit(neural_network, coin3, daysAgo)
        return_value1 = future1.result()
        return_value2 = future2.result()
        return_value3 = future3.result()
        total_list.append(return_value1)
        total_list.append(return_value2)
        total_list.append(return_value3)

    return str(total_list)


def metrics():
    return str(metrics_neural)