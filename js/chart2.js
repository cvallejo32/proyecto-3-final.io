const cryptos = async (dateRange, crypto, exchangeCurrency) => {
    try {
        //--API call--
        const jsonCryptos = await fetch(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${crypto}&market=${exchangeCurrency}&interval=5min&apikey=EEQ625GXQK69ZVQS`);
        console.log(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${crypto}&market=${exchangeCurrency}&interval=5min&apikey=EEQ625GXQK69ZVQS`);
        //------------
        const data = await jsonCryptos.json();
        const nowDate = new Date();
        let arrayCoinValue = [];
        let arrayDates = [];
        let arrayTest = [];
        let daysToInclude = 0;
        if (dateRange == 'Semanal') { daysToInclude = 7 } else if (dateRange == 'Mensual') { daysToInclude = 30 }
        for (let i = 0; i < daysToInclude; i++) {
            let day = (nowDate.getDate() < 10) ? '0' + nowDate.getDate() : nowDate.getDate();
            let month = (nowDate.getMonth() < 10) ? '0' + (nowDate.getMonth() + 1) : nowDate.getMonth() + 1;
            let nowDateFormatted = `${nowDate.getFullYear()}-${month}-${day}`;
            let coinValue = await data["Time Series (Digital Currency Daily)"][nowDateFormatted][`4a. close (${exchangeCurrency})`];
            coinValue = Number(coinValue).toFixed(2)
            arrayCoinValue.push(coinValue);
            arrayDates.push(nowDateFormatted);
            arrayTest.push({ "date": nowDateFormatted, "value": coinValue });
            //--Output current date value in the HTML--
            if (i == 0) {
                let dollarUSLocale = Intl.NumberFormat('en-US');
                document.getElementById('title').innerHTML = `Precio ${crypto} últimos ${daysToInclude} días`;
                document.getElementById('btc').innerHTML = `El valor de ${crypto} es $ ${dollarUSLocale.format(coinValue)} ${exchangeCurrency}`;
                document.getElementById('fecha').innerHTML = `Hoy es ${nowDateFormatted}`;
            }
            //-----------------------------------------              
            nowDate.setDate(nowDate.getDate() - 1);
        }
        arrayCoinValue.reverse();
        arrayDates.reverse();
        return { arrayCoinValue, arrayDates, arrayTest };
    } catch (err) {
        console.log('Se ha excedido el numero de peticiones API por minuto (5 por minuto). Favor de esperar algunos segundos antes de volver a correr la aplicación.');
    }
};

let chartCrypto = undefined

const myChart = async () => {
    const ctx = document.getElementById('myChart');

    // Asignación a Histórico
    let dateRange = document.getElementById('historico').value;
    if (dateRange == 'Histórico' || dateRange == 'Últimos 7 días') { dateRange = 'Semanal' } else { dateRange = 'Mensual' };
    // Asignación a Criptomoneda
    let cripto = document.getElementById('cripto').value;
    if (cripto == 'Criptomoneda') { cripto = 'BTC' };
    // Asignación a Moneda de Cambio
    let monedaCambio = document.getElementById('monedaCambio').value;
    if (monedaCambio == 'Moneda') { monedaCambio = 'MXN' };
    console.log(`dateRange=${dateRange}, cripto=${cripto}, monedaCambio=${monedaCambio}`);
    const { arrayCoinValue, arrayDates } = await cryptos(dateRange, cripto, monedaCambio);
    console.log(arrayCoinValue);
    console.log(arrayDates);

    if (chartCrypto !== undefined) chartCrypto.destroy();

    chartCrypto = new Chart(ctx, {
        type: 'line',
        data: {
            labels: arrayDates,
            datasets: [{
                label: 'Precio',
                data: arrayCoinValue,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(153, 107, 255, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

myChart();