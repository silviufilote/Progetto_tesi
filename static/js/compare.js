

var coinList = [];
getIdAllCoins(coinList);
var coinSelected = [];
var chart1 = null;





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

    $("#coin-selected1").html(coinSelected[0]);
    $("#coin-selected2").html(coinSelected[1]);
    $("#coin-selected3").html(coinSelected[2]);

    var url = "https://api.coingecko.com/api/v3/coins/markets";

    const options = {
        method: 'GET',
        url: url,
        params:{
            'vs_currency': 'eur',
            'ids': String(coinSelected[0] + ',' + coinSelected[1] + ',' + coinSelected[2])
        }
    };

    axios.request(options).then(function (response) {

        item = response.data;

        console.log(item);

        x = 1;

        for (let i = 0; i < 3; i++) {

            $("#coin-symbol"+x).html(item[i].id);
            $("#coin-current-price"+ x).html(item[i].current_price);
            $("#coin-market-cap"+ x).html(item[i].market_cap);
            $("#coin-market-cap-rank"+ x).html(item[i].market_cap_rank);


            $("#coin-high24-"+x).html(item[i].high_24h);
            $("#coin-low24-"+x).html(item[i].low_24h);
            $("#coin-price-change24-"+x).html(item[i].price_change_24h);
            $("#coin-price-change24-percentage-"+x).html(item[i].price_change_percentage_24h);


            $("#coin-market-cap24-"+x).html(item[i].market_cap_change_24h);
            $("#coin-market-cap24-percentage-"+x).html(item[i].market_cap_change_percentage_24h);
            $("#coin-supply-"+x).html(item[i].circulating_supply);


            $("#coin-total-supply-"+x).html(item[i].total_supply);
            $("#coin-max-supply-"+x).html(item[i].max_supply);
            $("#coin-ath-"+x).html(item[i].ath);
            $("#coin-atl-"+x).html(item[i].atl);

            x = x + 1;
        }

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
      $(".coin-time-series-coin").html('INSERT 3 COINS: ');
      $("#coin-selected1").html('Coin1');
      $("#coin-selected2").html('Coin2');
      $("#coin-selected3").html('Coin3');

      for (let x = 1; x < 4; x++) {
            $("#coin-symbol"+x).html('');
            $("#coin-current-price"+ x).html('');
            $("#coin-market-cap"+ x).html('');
            $("#coin-market-cap-rank"+ x).html('');


            $("#coin-high24-"+x).html('');
            $("#coin-low24-"+x).html('');
            $("#coin-price-change24-"+x).html('');
            $("#coin-price-change24-percentage-"+x).html('');


            $("#coin-market-cap24-"+x).html('');
            $("#coin-market-cap24-percentage-"+x).html('');
            $("#coin-supply-"+x).html('');


            $("#coin-total-supply-"+x).html('');
            $("#coin-max-supply-"+x).html('');
            $("#coin-ath-"+x).html('');
            $("#coin-atl-"+x).html('');
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
            // lista = JSON.parse(response.data);
            console.log(response.data);
        })
        .catch(function (response) {
          //handle error
          console.log(response);
    });
}



///////////////////////// Gestione attesa caricamento del modello e impossibilita di cambiare moneta ogni secondo


async function createChart(){

    var options1 = {
        series: [
            {
                name: "High - 2013",
                data: [28, 29, 33, 36, 32, 32, 33]
              },
              {
                name: "Low - 2013",
                data: [34, 22, 11, 18, 43, 22, 12]
              },
              {
                name: "Low - 2013",
                data: [32, 42, 54, 32, 39, 12, 67]
              },
              {
                name: "Low - 2013",
                data: [12, 11, 14, 18, 17, 13, 13]
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
    
    var chart1 = new ApexCharts(document.querySelector("#time-series-coin"), options1);
    chart1.render();
}



// function createLoadingState: crea lo stato di loading

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
    $('#coinDaysAgo').prop('disabled', true);
    createLoadingState();
    await forecastCoin(coinSelected[0], coinSelected[1], coinSelected[2], days);
    deleteLoadingState();
    createChart();
    $('#coinDaysAgo').prop('disabled', false);
}


