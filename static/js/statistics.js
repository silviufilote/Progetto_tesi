getTrending();
getGlobalStatusCrypto();
highestPriceCoin();

async function getTrending(){
    var url = "https://api.coingecko.com/api/v3/search/trending";

    const options = {
        method: 'GET',
        url: url
    };

    await axios.request(options).then(await function (response) {

        response.data.coins.forEach( element => {
            $('#trending-coins-id').append(element.item.id + '<br/>');
            $('#trending-coins-symbol').append(element.item.symbol + '<br/>');
        });

    }).catch(function (error) {
        console.error(error);
    });
}


async function getGlobalStatusCrypto(){
    var url = "https://api.coingecko.com/api/v3/global";

    const options = {
        method: 'GET',
        url: url
    };

    await axios.request(options).then(await function (response) {

        $('#active-coins').append('# ' + response.data.data.active_cryptocurrencies);
        $('#upcoming_icos').append(response.data.data.upcoming_icos);
        $('#ongoing_icos').append(response.data.data.ongoing_icos);
        $('#ended_icos').append(response.data.data.ended_icos);
        $('#markets').append(response.data.data.markets);

    }).catch(function (error) {
        console.error(error);
    });
}


async function highestPriceCoin(){
    var url = "https://api.coingecko.com/api/v3/coins/markets";

    const options = {
        method: 'GET',
        url: url,
        params: {
            'vs_currency': 'eur',
        }
    };

    await axios.request(options).then(await function (response) {


        max = 0;
        coin = '';

        console.log(response);

        response.data.forEach( element => {
            if(max < element.current_price){
                max = element.current_price;
                coin = element.id;
            }
        });

        $('#id-highest-coin').append(coin + ':');
        $('#price-highest-coin').append(max + ' €');
        console.log(max);

    }).catch(function (error) {
        console.error(error);
    });
}