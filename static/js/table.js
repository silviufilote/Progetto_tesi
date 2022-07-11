     
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
            var td3 = "<td>" + element.current_price + "</td>";
            var td4 = "<td>" + element.total_volume + "</td>";
            var td5 = "<td>" + element.price_change_percentage_24h + "</td></tr>";

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