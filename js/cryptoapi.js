export const cryptos = async (dateRange, crypto, exchangeCurrency) => {
    try {
        //--API call--
        const jsonCryptos = await fetch(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${crypto}&market=${exchangeCurrency}&interval=5min&apikey=EEQ625GXQK69ZVQS`);
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
        return { arrayCoinValue, arrayDates, arrayTest };
    } catch (err) {
        console.log(err);
    }
};