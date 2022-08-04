

///// Global Variables

var coin = getUrlParameter('coin');
var coinList = [];
var yValues = [];
var todayPrice = null;
var neuralNetworkChart = null;
var seriesChart = null;

getIdAllCoins(coinList);
urlCheck();




///////////////////////////// => URL CHECK and refill info



// Function getUrlParameter: prende get url passato

  function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
}
  
  
  

// Function urlCheck - controlla se ricevo coin tramite url 

async function urlCheck(){
    if(coin == false){
        console.log('you must insert a coin');
        $(".coin-title").html('INSERT A COIN');
    }else{
        $('#coinDaysAgo').prop('disabled', false);
        refillCoinInfo();
        insertCoinCard(coin); // card1
        await timeSeriesCoin(yValues, coin); // card2  Devo aspettare che questo finisca per visualizzare la lista yValues
    }
}



function refillCoinInfo(){
    $("#time-series").html('Select days ago, check above...');
    $("#forecasting-time-series").html('Select days ago, check above...');
    $('#time-series-title').html(coin.toUpperCase() + ' TIME SERIES');
    $('#forecast-time-series-title').html(coin.toUpperCase() + ' NEURAL NETWORK');
    $('#coinListInput').val(coin);

    $("#time-series-params").html('<p style="text-align:center">Select days ago, check above...</p>');
    $("#neural-netowrk-params").html('<p style="text-align:center">Select days ago, check above...</p>');

}


///////////////////////////// =>  Inserimento dati prima card


// Function nFormatter - number format with letters

function nFormatter(num, digits) {
    x = num;
    num = Math.abs(num);
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });

    if(x < 0) {
        return item ? (- num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    } else {
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    }
  }
  

  // Function roundNumber - for decimals numbers
  function roundNumber(num, scale) {
    if(!("" + num).includes("e")) {
      return +(Math.round(num + "e+" + scale)  + "e-" + scale);
    } else {
      var arr = ("" + num).split("e");
      var sig = ""
      if(+arr[1] + scale > 0) {
        sig = "+";
      }
      return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
    }
  }
  
  
// Function insertCoinCard: riempie la prima card

function insertCoinCard(coin){
    var url = "https://api.coingecko.com/api/v3/coins/"+coin;

    const options = {
        method: 'GET',
        url: url
    };

    axios.request(options).then(function (response) {

        $(".coin-title").html(response.data.name.toUpperCase());

        $("#coin-gecko-rank").append(response.data.coingecko_rank);

        $("#coin-id").html(response.data.id);
        $("#coin-symbol").html(response.data.symbol);
        $("#coin-name").html(response.data.name);
        $("#coin-genesis_date").html(response.data.genesis_date);
        $("#coin-ath").html(roundNumber(response.data.market_data.ath.eur, 5) + " €");
        $("#coin-atl").html(roundNumber(response.data.market_data.atl.eur, 5) + " €");
        $("#coin-ath-change-percentage").html(roundNumber(response.data.market_data.ath_change_percentage.eur, 5) + " %");
        $("#coin-atl-change-percentage").html(roundNumber(response.data.market_data.atl_change_percentage.eur, 5) + " %");


        // nFormatter function 
        $("#coin-market_cap_rank").html(response.data.market_cap_rank);
        $("#coin-market_cap").html(nFormatter(response.data.market_data.market_cap.eur,1) + " €");
        $("#coin-market_cap-change-currency-24h").html(nFormatter(response.data.market_data.market_cap_change_24h_in_currency.eur,1) + " €");
        $("#coin-market_cap-change-percentage-24h").html(roundNumber(response.data.market_data.market_cap_change_percentage_24h_in_currency.eur, 5) + " %");
        $("#coin-total_volume").html(nFormatter(response.data.market_data.total_volume.eur,1));


        $("#coin-current_price").html(roundNumber(response.data.market_data.current_price.eur,5) + " €");
        $("#coin-high_24h").html(roundNumber(response.data.market_data.high_24h.eur, 5) + " €");
        $("#coin-low_24h").html(roundNumber(response.data.market_data.low_24h.eur, 5) + " €");

        $("#coin-price-change-percentage-24h").html(roundNumber(response.data.market_data.price_change_percentage_24h_in_currency.eur,5) + " %");
        $("#coin-price-change-currency-24h").html(roundNumber(response.data.market_data.price_change_24h_in_currency.eur, 5) + " €");
        
        $("#coin-price-change-percentage-7d").html(roundNumber(response.data.market_data.price_change_percentage_7d_in_currency.eur, 5) + " %");
        $("#coin-price-change-percentage-14d").html(roundNumber(response.data.market_data.price_change_percentage_14d_in_currency.eur, 5) + " %");
        $("#coin-price-change-percentage-30d").html(roundNumber(response.data.market_data.price_change_percentage_30d_in_currency.eur, 5) + " %");
        $("#coin-price-change-percentage-60d").html(roundNumber(response.data.market_data.price_change_percentage_60d_in_currency.eur, 5) + " %");
        $("#coin-price-change-percentage-200d").html(roundNumber(response.data.market_data.price_change_percentage_200d_in_currency.eur, 5) + " %");
        $("#coin-price-change-percentage-1y").html(roundNumber(response.data.market_data.price_change_percentage_1y_in_currency.eur, 5) + " %");


        // nFormatter function 
        total_supply_flag = null;

        if(response.data.market_data.total_supply == null){
            total_supply_flag = 'Nan';
        } else{
            total_supply_flag = nFormatter(response.data.market_data.total_supply, 1);
        }


        $("#total-supply").html(total_supply_flag);

        max_supply_flag = null;

        if(response.data.market_data.max_supply == null){
            max_supply_flag = 'Nan';
        } else{
            max_supply_flag = nFormatter(response.data.market_data.max_supply,1);
        }

        $("#max-supply").html(max_supply_flag);
        $("#circulating-supply").html(nFormatter(response.data.market_data.circulating_supply, 1));

    }).catch(function (error) {
        console.error(error);
    });

}



function clearOnChangeCoin(){

    // Clear daysAgo select
    $("#coinDaysAgo").prop("selectedIndex", 0);


    // Clear Card2 - time series chart
    if(seriesChart != null) {
        seriesChart.destroy();
    }

    // Clear Card3 - neural network chart
    if(neuralNetworkChart != null) {
        neuralNetworkChart.destroy();
    }

    // Clear card4 - time series metrics
    $("#series-mean").html('');
    $("#series-max").html('');
    $("#series-min").html('');
    $("#series-daysAgo").html('');

    // Clear card4 - neural network metrics
    $("#neural-network-total-days").html('');
}


///////////////////////// =========> Inserimento dati seconda card




// Function timeSeriesCoin: calcola il max=1000 lista dell'andamento 

async function timeSeriesCoin(yValues, coin){

    var daysAgo = 1000; // max possible to select

    var url = "https://api.coingecko.com/api/v3/coins/" + coin + "/market_chart";

    const options = {
        method: 'GET',
        url: url,
        params: {
        'vs_currency': 'eur',
        'days': daysAgo,
        'interval': 'daily'
        }
    };

    await axios.request(options).then( await function (response) {
        response.data.prices.forEach(element => {
            yValues.push(element[1]);
        });
    
        todayPrice =  yValues.pop();
        yValues.reverse(); // prendere i giorni in ordine: ieri - l'altro ieri
    });
}


//////////////////////////////// Gestione input - dropbox e flitro

// Function getIdAllCoins: prende tutti gli id dei primi 100 coin di geckocoin

function getIdAllCoins(coinList){
    var url = "https://api.coingecko.com/api/v3/coins/markets";

    const options = {
        method: 'GET',
        url: url,
        params:{
            'vs_currency': 'eur'
        }
    };

    axios.request(options).then(function (response) {

        response.data.forEach(element => {

            //console.log(element.id);
            coinList.push(element.id);
        });

    }).catch(function (error) {
        console.error(error);
    });
}



// Function freshDropdown - inserisce tutti gli id all'interno della dropbox tramite filtro 
//                          con funzione getCoinFromInput(item) per elemento

function freshDropdown(){
    $('#coinListDropdown').empty();

    filter = $('#coinListInput').val();

    if(filter == null || filter == '' || filter == undefined){
        $('#coinListDropdown').append('<li class = "dropdown-item"> insert a coin </li>');
    }
    else{
        dropdownList = coinList.filter(coin => coin.includes(filter));
        console.log(dropdownList);

        for (let i = 0; i < dropdownList.length; i++) {
            $('#coinListDropdown').append('<li class = "dropdown-item to-select-item" onclick="getCoinFromInput(this)">' +   dropdownList[i]  + '</li>');
        }
    } 
}



 // Function getCoinFromInput - dopo aver selezione il coin della dropbox 
 
 function getCoinFromInput(item){

    clearOnChangeCoin();

    coin = $(item).text();
    $('#coinDaysAgo').prop('disabled', false);
    refillCoinInfo();
    insertCoinCard(coin); // card1
    timeSeriesCoin(yValues, coin); 
}



// Function freshtimeSeries - selezione dei days ago

function freshtimeSeries(item){
    timeSeriesChart();

    if($(item).val() != ''){
        updateTimeSeriesChart($(item).val()); // card2 
        manageLoading($(item).val()); // card3 - Card4 neural 
        getSeriesResults($(item).val()); // card4 - time series
    }
}


function updateTimeSeriesChart(daysAgo){
    seriesChart.render();
    seriesChart.updateSeries([{
        data: yValues.slice(0, daysAgo)
   }]);
}



// Function getSeriesResults - calcola mean, max, min dalla serie => card 3

function getSeriesResults(daysAgo){

    card4TimeSeriesParams();

    seriesValues = yValues.slice(0, daysAgo);

    max = 0;
    min = yValues[0];
    mean = 0;
    total = 0;
    for (let i = 0; i < seriesValues.length; i++) {
       if(seriesValues[i] > max){
           max = seriesValues[i];
       }
       if (seriesValues[i] < min){
           min = seriesValues[i];
       }
       total += seriesValues[i];
    }

    mean = total / seriesValues.length;
    
    $("#series-mean").html(roundNumber(mean,2) + " €");
    $("#series-max").html(roundNumber(max,2) + " €");
    $("#series-min").html(roundNumber(min,2) + " €");
    $("#series-daysAgo").html(seriesValues.length);
}



///////////////////////////// Time series forecatin

// Function dateByDaysAgo - get date by days ago

function dateByDaysAgo(days){
    let today = new Date();
    today.setDate(today.getDate() + days);
    return today.toJSON().slice(0,10);
}



// Function Axistochart - calcolate date to data for chart => card 3

async function Axistochart(data, daysAgo){

    list = [];
    prices = yValues.slice(0, daysAgo).reverse(); 

    for (var i = 0; i < daysAgo; i++) {
        list.push([dateByDaysAgo(i - daysAgo), prices[i]]);
    }

    list.push([dateByDaysAgo(0),todayPrice]);  // il valore di oggi

    for (var i = 0; i < (data.length - daysAgo - 1); i++) {
        list.push([dateByDaysAgo(i + 1), data[i]]);
    }

    neuralChart(list);
}





// Function forecastCoin - request data for forecast

async function forecastCoin(daysAgo){

    var bodyFormData = new FormData();

    bodyFormData.append('coin', coin);
    bodyFormData.append('yValues', daysAgo); 

    await axios({
        method: "post",
        url: "forecast.html",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(await function (response) {

            deleteLoadingState();
            Axistochart(response.data, daysAgo);

        })
        .catch(function (response) {
          //handle error
          console.log(response);
    });
}

 

///////////////////////// Gestione attesa caricamento del modello e impossibilita di cambiare moneta ogni secondo

// Function neuralChart - card3 Neural network chart

async function neuralChart(data){

    var options2 = {
        series: [{
            name: "Coin value",
            data: data
        }],
        chart: {
            type: 'area',
            stacked: false,
            height: 350,
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
            },
            toolbar: {
                autoSelected: 'zoom'
            },
            dropShadow: {
                enabled: true,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 0.2,
                color: '#000',
                opacity: 0.3
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 2,
            dashArray: 0,
        },
        grid: {
            row: {
                colors: undefined, // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        theme: {
            mode: 'light',
            monochrome: {
                enabled: true,
                color: '#00c9b7' ,
                shadeTo: 'light',
                shadeIntensity: 0.8
            },
        },
        title:{
            style:{
                fontFamily: 'monospace'
            }
        },
        xaxis: {
            type: 'datetime',
            tickAmount: 6,
            decimalsInFloat: 0,
            title: {
                text: 'Date',
                style:{
                    color: '#FFFFFF',
                    fontFamily: 'monospace'
                }
            },
            labels: {
                show: true,
                style:{
                    fontFamily: 'monospace',
                    colors: 'white',
                }
            }
        },
        forecastDataPoints: {
            count: 30,
            fillOpacity: 0.5,
            strokeWidth: undefined,
            dashArray: 4,
        },
        yaxis: {
            type: 'numeric',
            tickAmount: 4,
            decimalsInFloat: 2,
            title: {
                text: 'value in €',
                style:{
                    fontFamily: 'monospace',
                    color: '#FFFFFF'
                }
            },
            labels:{
                show: true,
                style:{
                    fontFamily: 'monospace',
                    colors: '#fff'
                }
            },
            tooltip:{
                style:{
                    color:'#F86624',
                }
            }
        },
        tooltip:{
            enabled: true,
            fillSeriesColor: false,
            style:{
                fontFamily: 'monospace'
            }
        }
    };

    neuralNetworkChart = new ApexCharts(document.querySelector("#forecasting-time-series"), options2);
    neuralNetworkChart.render();
}


async function timeSeriesChart(){

    var options = {
        series: [{
            name: "Coin value",
            data: []
        }],
        chart: {
            type: 'area',
            stacked: false,
            height: 350,
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true
            },
            toolbar: {
                autoSelected: 'zoom'
            },
            dropShadow: {
                enabled: true,
                enabledOnSeries: undefined,
                top: 0,
                left: 0,
                blur: 0.2,
                color: '#000',
                opacity: 0.3
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 2,
            dashArray: 0,
        },
        grid: {
            row: {
                colors: undefined, // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        theme: {
            mode: 'light',
            monochrome: {
                enabled: true,
                color: '#00c9b7' ,
                shadeTo: 'light',
                shadeIntensity: 0.8
            },
        },
        title:{
            style:{
                fontFamily: 'monospace'
            }
        },
        xaxis: {
            type: 'numeric',
            tickAmount: 6,
            decimalsInFloat: 0,
            title: {
                text: 'days ago',
                style:{
                    color: '#FFFFFF',
                    fontFamily: 'monospace'
                }
            },
            labels: {
                show: true,
                style:{
                    fontFamily: 'monospace',
                    colors: 'white',
                }
            }
        },
        forecastDataPoints: {
            count: 0,
            fillOpacity: 0.5,
            strokeWidth: undefined,
            dashArray: 4,
        },
        yaxis: {
            type: 'numeric',
            tickAmount: 4,
            decimalsInFloat: 2,
            title: {
                text: 'value in €',
                style:{
                    fontFamily: 'monospace',
                    color: '#FFFFFF'
                }
            },
            labels:{
                show: true,
                style:{
                    fontFamily: 'monospace',
                    colors: '#fff'
                }
            },
            tooltip:{
                style:{
                    color:'#F86624',
                }
            }
        },
        tooltip:{
            enabled: true,
            fillSeriesColor: false,
            style:{
                fontFamily: 'monospace'
            }
        }
    };

    seriesChart = new ApexCharts(document.querySelector("#time-series"), options);
}


// function createLoadingState: crea ed elimina lo stato di loading

async function createLoadingState(){
    $("#forecasting-time-series").html('<div style="width: 3rem; height: 3rem;" class="spinner-border m-5" role="status"> <span class="visually-hidden">Loading...</span></div>');
    $("#neural-netowrk-params").html('<div style="text-align: center"><div style="width: 3rem; height: 3rem;" class="spinner-border m-5" role="status"> <span style="text-align: center" class="visually-hidden">Loading...</span></div></div>');
}


async function deleteLoadingState(){
    $("#forecasting-time-series").html('');
    $("#neural-netowrk-params").html('');
}



// Function neuralChart - card3/card4 neural chart and info

async function manageLoading(days){
    $('#selectCoinbtn').prop('disabled', true);
    $('#coinDaysAgo').prop('disabled', true);
    $('#coinListInput').prop('disabled', true);
    createLoadingState();
    await forecastCoin(days);
    card4NeuralNetworkParams(); // create labels to Card4
    getMetrics(); // card4 - neural network
    $('#coinDaysAgo').prop('disabled', false);
    $('#coinListInput').prop('disabled', false);
    $('#selectCoinbtn').prop('disabled', false);
}


async function card4NeuralNetworkParams(){
    $('#neural-netowrk-params').html('<div style="text-align: left;" class="col"> <label>Days:</label><br> <label>Forecasted days:</label><br> <label>Test data:</label><br> <label>Train data:</label><br> <hr><hr> <label>Train RMSE</label><br> <label>Train MSE:</label><br> <label>Train MAE</label><br> <label>Train RSCORE:</label><br> <label>Train MGD</label><br> <label>Train MPD:</label><br> <hr><hr> <label>Test RMSE</label><br> <label>Test MSE:</label><br> <label>Test MAE</label><br> <label>Test RSCORE:</label><br> <label>Test MGD</label><br> <label>Test MPD:</label><br> </div> <div style="text-align: right;" class="col"> <label id="neural-network-total-days"></label><br> <label id="neural-network-forecasted-days"></label><br> <label id="neural-network-train-data"></label><br> <label id="neural-network-test-data"></label><br> <hr><hr> <label id="neural-network-train-rmse"></label><br> <label id="neural-network-train-mse"></label><br> <label id="neural-network-train-mae"></label><br> <label id="neural-network-train-rscore"></label><br> <label id="neural-network-train-mgd"></label><br> <label id="neural-network-train-mpd"></label><br> <hr><hr> <label id="neural-network-test-rmse"></label><br> <label id="neural-network-test-mse"></label><br> <label id="neural-network-test-mae"></label><br> <label id="neural-network-test-rscore"></label><br> <label id="neural-network-test-mgd"></label><br> <label id="neural-network-test-mpd"></label><br> </div>');
}


async function card4TimeSeriesParams(){
    $('#time-series-params').html(' <div style="text-align: left;" class="col"> <label>Mean: </label><br> <label>Highest value: </label><br> <label>Lowest value: </label><br> <label>Days ago: </label><br> <hr><hr> </div> <div style="text-align: right;" class="col"> <label id="series-mean"></label><br> <label id="series-max"></label><br> <label id="series-min"></label><br> <label id="series-daysAgo"></label><br> <hr><hr> </div>');
}

async function getMetrics(){
    await axios({
        method: "post",
        url: "metrics.html",
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(await function (response) {

            console.log(response.data);

            daysTimeSeries = $('#series-daysAgo').text();


            $('#neural-network-total-days').html(parseFloat(daysTimeSeries)  + 1 + 30);
            $('#neural-network-forecasted-days').html(30);

            $('#neural-network-train-data').html('60% of total dataset');
            $('#neural-network-test-data').html('40% of total dataset');

            $('#neural-network-train-rmse').html(roundNumber(response.data[0],5));
            $('#neural-network-train-mse').html(roundNumber(response.data[1],5));
            $('#neural-network-train-mae').html(roundNumber(response.data[2],5));
            $('#neural-network-train-rscore').html(roundNumber(response.data[3],5));
            $('#neural-network-train-mgd').html(roundNumber(response.data[4],5));
            $('#neural-network-train-mpd').html(roundNumber(response.data[5],5));

            $('#neural-network-test-rmse').html(roundNumber(response.data[6],5));
            $('#neural-network-test-mse').html(roundNumber(response.data[7],5));
            $('#neural-network-test-mae').html(roundNumber(response.data[8],5));
            $('#neural-network-test-rscore').html(roundNumber(response.data[9],5));
            $('#neural-network-test-mgd').html(roundNumber(response.data[10],5));
            $('#neural-network-test-mpd').html(roundNumber(response.data[11],5));

        })
        .catch(function (response) {
          //handle error
          console.log(response);
    });
}