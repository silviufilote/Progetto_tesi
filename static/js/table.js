     
    var url = "https://api.coingecko.com/api/v3/coins/markets";

    const options = {
        method: 'GET',
        url: url,
        params: {
            'vs_currency': 'eur',
        }
    };

    axios.request(options).then(function (response) {
       //console.log(response.data);

        var x = 1;

        response.data.forEach(element => {

            var tr = "<tr class='clickable-row text' data-href='check.html?coin=" + element.id + "' >";
            var td1 = "<td style='text-align:center'>" + x + "</td>";
            var td2 = '<td><div class="row"><div class="col"><img class="logo-crypto-table" " src = "' + element.image  + '"> </div><div class="col">'+ element.name + '</div><div class="col">' + element.symbol.toUpperCase() + '</div></div></td>';
            var td3 = "<td>" + roundNumber(element.current_price, 5) + " €" + "</td>";
            var td4 = "<td>" + nFormatter(element.total_volume, 1) +  " €" + "</td>";
            var td5 = "<td>" + roundNumber(element.price_change_percentage_24h, 2) + " %" + "</td></tr>";

            x = x + 1;

            $("#dataTable").append(tr + td1 + td2 + td3 + td4 + td5);
        });

        $('#dataTable').DataTable();

    }).catch(function (error) {
        console.error(error);
    });

    jQuery(document).ready(function($) {
        $(".clickable-row").click(function() {
            window.location = $(this).data("href");
        });
    });


    $('#dataTable').on( 'click', 'tbody tr', function () {
        window.location.href = $(this).data('href');
    });


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