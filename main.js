

const loadChartJs = (urlGoogle, element) => {

    const url = urlGoogle
    const id = element
    google.charts.load('current', {
        'packages': ['corechart', 'bar']
      });
      google.charts.setOnLoadCallback(initChart);
    
      function initChart() {
        // Pruebas: https://docs.google.com/spreadsheets/d/1BQuJ6mRreTJ3eZ44n93N6DXULOh5r2isbMuTTM9fnrY/edit?usp=sharing
        // https://docs.google.com/spreadsheets/d/1YFu3mEJzUXsxWVFDTVK9RhZF91VlwzDB-3F4WzHITq4/edit?usp=sharing
        URL = url;
        var query = new google.visualization.Query(URL);
        query.setQuery('select *');
        query.send(function(response) {
          handleQueryResponse(response);
        });
      }
    
      function handleQueryResponse(response) {
        var data = response.getDataTable();
        var columns = data.getNumberOfColumns();
        var rows = data.getNumberOfRows();

        var canvas = document.getElementById(id);
        
        const dataSettings = canvas.dataset.settings

        if(dataSettings){
            const settingsJson = JSON.parse(dataSettings).settings

            const colors = settingsJson.colors;
            dataj = JSON.parse(data.toJSON());
            console.log(dataj.cols[0].label);
            const labels = [];
            for (c = 1; c < dataj.cols.length; c++) {
            if (dataj.cols[c].label != "") {
                labels.push(dataj.cols[c].label);
            }
        
            }
            const datasets = [];
            for (i = 0; i < dataj.rows.length; i++) {
                const series_data = [];
                for (j = 1; j < dataj.rows[i].c.length; j++) {
                    if (dataj.rows[i].c[j] != null) {
                    if (dataj.rows[i].c[j].v != null) {
                        series_data.push(dataj.rows[i].c[j].v);
                    } else {
                        series_data.push(0);
                    }
                    }
            
                }
                
                if(settingsJson.type == 'doughnut' || settingsJson.type == 'pie'){
                    var dataset = {
                        label: dataj.rows[i].c[0].v,
                        backgroundColor: colors,
                        data: series_data
                    }
                } else {
                    var dataset = {
                        label: dataj.rows[i].c[0].v,
                        backgroundColor: colors[i],
                        borderColor: colors[i],
                        data: series_data
                    }
                }
                
            
                datasets.push(dataset);
            
            }
        
            const chartdata = {
            labels: labels,
            datasets: datasets
            };
            
            var setup = {
            type: settingsJson.type,
            data: chartdata,
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: dataj.cols[0].label
                    }
                },
                responsive: true,
            }
            }
            chart = new Chart(canvas, setup);
        }
      }
}


const gevCharts = document.querySelectorAll('.gev-charts')

gevCharts.forEach(item => {
    const itemUrl = item.dataset.url
    const itemId = item.getAttribute('id')
    loadChartJs(itemUrl, itemId)

});