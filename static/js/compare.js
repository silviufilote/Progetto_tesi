
/// forecast coin


var options1 = {
    series: [
        {
            name: "Coin value",
            data: []
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

var chart1 = new ApexCharts(document.querySelector("#time-series-coin"), options1);
chart1.render();



var coinList = [];
getIdAllCoins(coinList);
var coinSelected = [];





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
    if(coinSelected.length == 3) {
        $('#coinDaysAgo').prop('disabled', false);
        //$("#coinDaysAgo").val("100").change();

        $(".coin-time-series-coin").html(coinSelected[0].toUpperCase() + ', ' + coinSelected[1].toUpperCase() + ', ' + coinSelected[2].toUpperCase());
        
        displayInfoCoins(coinSelected)
    
    }
}



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

      $('#coinDaysAgo').prop('disabled', true);
      $(".coin-time-series-coin").html('INSERT 3 COINS: ');
      $("#coin-selected1").html('Coin1');
      $("#coin-selected2").html('Coin2');
      $("#coin-selected3").html('Coin3');
}


///////////////////////////// Time series forecatin

async function forecastCoin(daysAgo){

    var bodyFormData = new FormData();

    bodyFormData.append('coin', coin);
    bodyFormData.append('yValues', daysAgo); 

    axios({
        method: "post",
        url: "forecast.html",
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (response) {
          //handle error
          console.log(response);
    });
}



// Function freshtimeSeries: refresha la serie tramite selezione della select
 
function freshtimeSeries(item){
    if($(item).val() != ''){

        

         //updateChart($(item).val()); // card2 - card4
        //getSeriesResults($(item).val()); // card3
    }
}


/*
// Function drawChart: calcola il max=1000 lista dell'andamento 
 
async function updateChart(daysAgo){
    chart.updateSeries([{
         data: yValues.slice(0, daysAgo)
    }]);
    forecastCoin(daysAgo);
}

*/