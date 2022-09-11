

var coinList = [];
getIdAllCoins(coinList);
var coinSelected = [];
var chartFlag = null;





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

function freshDropdown(){
    $('#coinListDropdown').empty();

    filter = $('#coinListInput').val();

    if(filter == null || filter == '' || filter == undefined){
        $('#coinListDropdown').append('<li class = "dropdown-item"> insert a coin </li>');
    }
    else{
        dropdownList = coinList.filter(coin => coin.includes(filter));

        for (let i = 0; i < dropdownList.length; i++) {
            $('#coinListDropdown').append('<li class = "dropdown-item to-select-item" onclick="getCoinFromInput(this)">' +   dropdownList[i]  + '</li>');
        }
    } 
}


// Function getCoinFromInput - carica la pagina se riceve qualcosa tramite input
 
 function getCoinFromInput(item){
    coin = $(item).text();
    if(document.querySelectorAll('input[type="checkbox"]:checked').length < 3 &&  ! coinSelected.includes(coin)){
        $("#coins_selected").append('<input class="form-check-input" type="checkbox" value="'+ coin +'" id="' + coin + '-selected" onchange="UpdateCoinsSelected(this)"  checked><label class="form-check-label textbox" for="' + coin + '-selected" id="label-'+coin+'">'+ '&nbsp;' + coin + '&nbsp;' + '</label></input>' );
        coinSelected.push(coin);
    }

    // una volta che seleziono le 3 crypto

    if(coinSelected.length == 3) {
        $('#coinDaysAgo').prop('disabled', false);
        //$("#coinDaysAgo").val("100").change();

        $(".coin-time-series-coin").html(coinSelected[0].toUpperCase() + ', ' + coinSelected[1].toUpperCase() + ', ' + coinSelected[2].toUpperCase());
        
        displayInfoCoins(coinSelected);
        $("#time-series-coin").html('Select days ago, check above...');
    }
}


// Function displayInfoCoins - Riempie con info la card

function displayInfoCoins(coinSelected){
    get_fullDitailedInfo(coinSelected[0], 1);
    get_fullDitailedInfo(coinSelected[1], 2);
    get_fullDitailedInfo(coinSelected[2], 3);
}


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


function  get_fullDitailedInfo(coin, x){

    var url = "https://api.coingecko.com/api/v3/coins/"+coin;

    const options = {
        method: 'GET',
        url: url
    };

    axios.request(options).then(function (response) {

        $("#coin-selected-"+x).html(response.data.symbol);

        $("#coin-id-"+x).html(response.data.id);
        $("#coin-name-"+ x).html(response.data.name);
        $("#coin-genesis_date-"+ x).html(response.data.name);
        $("#coin-ath-"+ x).html(roundNumber(response.data.market_data.ath.eur, 5) + " €");
        $("#coin-atl-"+ x).html(roundNumber(response.data.market_data.atl.eur, 5) + " €");
        $("#coin-ath-change-percentage-"+x).html(roundNumber(response.data.market_data.ath_change_percentage.eur, 5) + " %");
        $("#coin-atl-change-percentage-"+x).html(roundNumber(response.data.market_data.atl_change_percentage.eur, 5) + " %");

        $("#coin-market_cap_rank-"+x).html(response.data.market_cap_rank);
        $("#coin-market_cap-"+x).html(nFormatter(response.data.market_data.market_cap.eur,1) + " €");
        $("#coin-market_cap-change-currency-24h-"+x).html(nFormatter(response.data.market_data.market_cap_change_24h_in_currency.eur,1) + " €");
        $("#coin-market_cap-change-percentage-24h-"+x).html(roundNumber(response.data.market_data.market_cap_change_percentage_24h_in_currency.eur, 5) + " %");
        $("#coin-total_volume-"+x).html(nFormatter(response.data.market_data.total_volume.eur,1));


        $("#coin-current_price-"+x).html(roundNumber(response.data.market_data.current_price.eur,5) + " €");
        $("#coin-high_24h-"+x).html(roundNumber(response.data.market_data.high_24h.eur, 5) + " €");
        $("#coin-low_24h-"+x).html(roundNumber(response.data.market_data.low_24h.eur, 5) + " €");
        
        $("#coin-price-change-percentage-24h-"+x).html(roundNumber(response.data.market_data.price_change_percentage_24h_in_currency.eur,5) + " %");
        $("#coin-price-change-currency-24h-"+x).html(roundNumber(response.data.market_data.price_change_24h_in_currency.eur, 5) + " €");

        $("#coin-price-change-percentage-7d-"+x).html(roundNumber(response.data.market_data.price_change_percentage_7d_in_currency.eur, 5) + " %");
        $("#coin-price-change-percentage-14d-"+x).html(roundNumber(response.data.market_data.price_change_percentage_14d_in_currency.eur, 5) + " %");
        $("#coin-price-change-percentage-30d-"+x).html(roundNumber(response.data.market_data.price_change_percentage_30d_in_currency.eur, 5) + " %");
        $("#coin-price-change-percentage-60d-"+x).html(roundNumber(response.data.market_data.price_change_percentage_60d_in_currency.eur, 5) + " %");
        $("#coin-price-change-percentage-200d-"+x).html(roundNumber(response.data.market_data.price_change_percentage_200d_in_currency.eur, 5) + " %");
        $("#coin-price-change-percentage-1y-"+x).html(roundNumber(response.data.market_data.price_change_percentage_1y_in_currency.eur, 5) + " %");

        total_supply_flag = null;

        if(response.data.market_data.total_supply == null){
            total_supply_flag = 'Nan';
        } else{
            total_supply_flag = nFormatter(response.data.market_data.total_supply, 1);
        }


        $("#total-supply-"+x).html(total_supply_flag);

        max_supply_flag = null;

        if(response.data.market_data.max_supply == null){
            max_supply_flag = 'Nan';
        } else{
            max_supply_flag = nFormatter(response.data.market_data.max_supply,1);
        }

        $("#max-supply-"+x).html(max_supply_flag);
        $("#circulating-supply-"+x).html(nFormatter(response.data.market_data.circulating_supply, 1));     


    }).catch(function (error) {
        console.error(error);
    });

}





// Function UpdateCoinsSelected - elimina i coin uncheccando la checkbox

function UpdateCoinsSelected(checkboxCoin){
    if (checkboxCoin.checked == false) {
       
        coin = checkboxCoin.getAttribute('value');

        $(checkboxCoin).remove();
        $("#label-"+ coin).remove();

        var index = coinSelected.indexOf(coin);
        console.log(index);
        if (index !== -1) {
            coinSelected.splice(index, 1);
        }
      }


      // pulizia 

      $('#coinDaysAgo').prop('disabled', true);
      $("#coinDaysAgo").prop("selectedIndex", 0).change();
      $(".coin-time-series-coin").html('INSERT 3 COINS: ');
      $("#coin-selected1").html('Coin1');
      $("#coin-selected2").html('Coin2');
      $("#coin-selected3").html('Coin3');

      if(chartFlag != null) {
        chartFlag.destroy();
      }

      for (let x = 1; x < 4; x++) {

            $("#coin-symbol-"+x).html('');
            $("#coin-name-"+ x).html('');
            $("#coin-ath-"+ x).html('');
            $("#coin-atl-"+ x).html('');
            $("#coin-genesis_date-"+ x).html('');
            $("#coin-ath-change-percentage-"+x).html('');
            $("#coin-atl-change-percentage-"+x).html('');

            $("#coin-market_cap_rank-"+x).html('');
            $("#coin-market_cap-"+x).html('');
            $("#coin-market_cap-change-currency-24h-"+x).html('');
            $("#coin-market_cap-change-percentage-24h-"+x).html('');
            $("#coin-total_volume-"+x).html('');


            $("#coin-current_price-"+x).html('');
            $("#coin-high_24h-"+x).html('');
            $("#coin-low_24h-"+x).html('');
            
            $("#coin-price-change-percentage-24h-"+x).html('');
            $("#coin-price-change-currency-24h-"+x).html('');

            $("#coin-price-change-percentage-7d-"+x).html('');
            $("#coin-price-change-percentage-14d-"+x).html('');
            $("#coin-price-change-percentage-30d-"+x).html('');
            $("#coin-price-change-percentage-60d-"+x).html('');
            $("#coin-price-change-percentage-200d-"+x).html('');
            $("#coin-price-change-percentage-1y-"+x).html('');

            $("#total-supply-"+x).html('');
            $("#max-supply-"+x).html('');
            $("#circulating-supply-"+x).html('');
    }
}





///////////////////////////// Time series forecatin

async function forecastCoin(coin1, coin2, coin3, daysAgo){

    var bodyFormData = new FormData();

    bodyFormData.append('coin1', coin1);
    bodyFormData.append('coin2', coin2);
    bodyFormData.append('coin3', coin3);
    bodyFormData.append('yValues', daysAgo); 

    await axios({
        method: "post",
        url: "neural.html",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
            console.log(response.data);

            deleteLoadingState();

            AxisToChart(response.data[0], response.data[1], response.data[2], daysAgo);
        })
        .catch(function (response) {
          //handle error
          console.log(response);
    });
}

// Function dateByDaysAgo - get date by days ago

function dateByDaysAgo(days){
    let today = new Date();
    today.setDate(today.getDate() + days);
    return today.toJSON().slice(0,10);
}


async function AxisToChart(data1 , data2, data3, daysAgo) {

    double_list1 = [];
    double_list2 = [];
    double_list3 = [];

    for (var i = 0; i <= daysAgo; i++) {
        double_list1.push([dateByDaysAgo(i - daysAgo), data1[i]]);
        double_list2.push([dateByDaysAgo(i - daysAgo), data2[i]]);
        double_list3.push([dateByDaysAgo(i - daysAgo), data3[i]]);
    }

    for (var i = 1; i < 31; i++) {
        double_list1.push([dateByDaysAgo(i + 1), data1[i]]);
        double_list2.push([dateByDaysAgo(i + 1), data2[i]]);
        double_list3.push([dateByDaysAgo(i + 1), data3[i]]);
    }

    createChart(double_list1, double_list2, double_list3);
}


///////////////////////// Gestione attesa caricamento del modello e impossibilita di cambiare moneta ogni secondo



// Function createChart - Crea il grafico che viene richiamato in forecastCoin()

async function createChart(data1, data2, data3){

    var options1 = {
        series: [
            {
              name: coinSelected[0],
              data: data1
            },
            {
              name: coinSelected[1],
              data: data2
            },
            {
              name: coinSelected[2],
              data: data3
            }
          ],
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
            mode: 'light'
        },
        title:{
            style:{
                fontFamily: 'monospace'
            }
        },
        xaxis: {
            type: 'datetime',
            tickAmount: 10,
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
            decimalsInFloat: 4,
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
        },
        legend:{
            show: true,
            fontFamily: 'monospace',
            labels: {
                colors: '#fff'
            }
        }
    };
    
    chartFlag = new ApexCharts(document.querySelector("#time-series-coin"), options1);
    chartFlag.render();
}



// function createLoadingState: crea ed elimina lo stato di loading

async function createLoadingState(){
    $("#time-series-coin").html('<div style="width: 3rem; height: 3rem;" class="spinner-border m-5" role="status"> <span class="visually-hidden">Loading...</span></div>');
}


async function deleteLoadingState(){
    $("#time-series-coin").html('');
}




// Function freshtimeSeries: refresha la serie tramite selezione della select
 
async function selectDaysAgo(item){
    if($(item).val() != ''){
        manageLoading($(item).val());
    }
}



async function manageLoading(days){

    if(chartFlag != null) {
        chartFlag.destroy();
    }

    $('#coinDaysAgo').prop('disabled', true);
    $('#coinListInput').prop('disabled', true);
    $("input.form-check-input").prop("disabled", true);
    $('#btn-select-coin').prop('disabled', true);
    createLoadingState();
    await forecastCoin(coinSelected[0], coinSelected[1], coinSelected[2], days);
    $('#coinDaysAgo').prop('disabled', false);
    $('#coinListInput').prop('disabled', false);
    $("input.form-check-input").prop("disabled", false);
    $('#btn-select-coin').prop('disabled', false);
}



