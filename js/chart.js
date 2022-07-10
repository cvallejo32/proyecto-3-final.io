import { cryptos } from './cryptoapi.js';

let chartCrypto = undefined

const ctx = document.getElementById('myChart');
export const myChart = async () => {
    // Asignación a Histórico
    let dateRange = document.getElementById('historico').value;
    if (dateRange == 'Histórico' || dateRange == 'Últimos 7 días') { dateRange = 'Semanal' } else { dateRange = 'Mensual' };
    // Asignación a Criptomoneda
    let cripto = document.getElementById('cripto').value;
    if (cripto == 'Criptomoneda') { cripto = 'BTC' };
    // Asignación a Moneda de Cambio
    let monedaCambio = document.getElementById('monedaCambio').value;
    if (monedaCambio == 'Moneda') { monedaCambio = 'MXN' };

    const { arrayCoinValue, arrayDates } = await cryptos(dateRange, cripto, monedaCambio);
    console.log(arrayCoinValue);
    console.log(arrayDates);

    if (chartCrypto !== undefined) chartCrypto.destroy()

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