var options = {
    series: [{
        name: ['Number of cryptocurrencies'],
        data: [7,67,501, 572,636,1359,2086,2403,4154, 10363],
  }],
    chart: {
    type: 'area',
    height: 160,
    sparkline: {
      enabled: true
    },
  },
  grid:{
    padding:{
        top: 7,
        right: 7,
        bottom: 7,
        left: 7,
    },
  },
  stroke: {
    curve: 'straight'
  },
  fill: {
    opacity: 0.3,
  },
  xaxis: {
    categories: ['April 2013', 'January 2014', 'January 2015', 'January 2016', 'January 2017', 'January 2018', 'January 2019', 'January 2020', 'January 2021', 'March 2022'],
  },
  yaxis: {
    min: 100
  },
  colors: ['#DCE6EC'],
  title: {
    text: 'Number of cryptocurrencies over years',
    offsetX: 0,
    align: 'center',
    margin: 25,
    style: {
      fontSize: '15px',
      fontFamily: 'monospace',
    }
  },
  theme: {
    mode: 'dark', 
    palette: 'palette4', 
    monochrome: {
        enabled: false,
        color: '#255aee',
        shadeTo: 'light',
        shadeIntensity: 0.65
    },
},
  subtitle: {
    text: 'since 2013',
    align: 'center',
    margin: 25,
    style: {
      fontSize: '14px',
      fontFamily: 'monospace',
    }
  }
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);
  chart.render();