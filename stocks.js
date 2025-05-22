let chart;
let selectedDays = 30;
const API_KEY = 'Fad7p9aTRBUyxWp3qNr1Atk5ovmbeZuT';

// run this when the page loads
window.onload = function () {
  // when user clicks "lookup stock"
  document.getElementById('lookup-btn').onclick = function () {
    const ticker = document.getElementById('ticker-input').value.trim().toUpperCase();
    if (ticker) fetchStock(ticker, selectedDays);
  };

  // handle dropdown change for date range
  const dropdown = document.getElementById('timeframe-select');
  if (dropdown) {
    selectedDays = parseInt(dropdown.value, 10);

    dropdown.onchange = function () {
      selectedDays = parseInt(this.value, 10);
    };
  }

  // show top 5 reddit stocks
  loadRedditStocks();
};

// fetch stock data from polygon API
function fetchStock(ticker, days) {
  const end = new Date();
  end.setDate(end.getDate() - 1);
  const start = new Date(end);
  start.setDate(start.getDate() - days);

  const format = d => d.toISOString().split('T')[0];
  const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${format(start)}/${format(end)}?adjusted=true&sort=asc&apiKey=${API_KEY}`;

  document.getElementById('chart-message').textContent = 'Loading stock data...';

  fetch(url)
    .then(r => r.json())
    .then(data => {
      if (data.status === 'OK') {
        drawChart(data.results, ticker);
        document.getElementById('chart-message').style.display = 'none';
      } else {
        document.getElementById('chart-message').textContent = 'No data found.';
      }
    });
}

// draw the line chart
function drawChart(data, ticker) {
  const ctx = document.getElementById('stock-chart').getContext('2d');
  const labels = data.map(d => new Date(d.t).toLocaleDateString());
  const prices = data.map(d => d.c);
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: ticker + ' Stock Price',
        data: prices,
        borderColor: 'blue',
        tension: 0.3,
        fill: false
      }]
    }
  });
}

// load top 5 reddit stocks
function loadRedditStocks() {
  fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03')
    .then(r => r.json())
    .then(data => {
      const top5 = data.slice(0, 5);
      const tbody = document.querySelector('#reddit-stocks-table tbody');
      tbody.innerHTML = '';

      top5.forEach(function (stock) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><a href="https://finance.yahoo.com/quote/${stock.ticker}" target="_blank">${stock.ticker}</a></td>
          <td>${stock.no_of_comments}</td>
          <td><img src="${stock.sentiment === 'Bullish' ? 'bullish.png' : 'bearishh.png'}" width="50"></td>

        `;
        tbody.appendChild(row);
      });
    });
}

// used by voice command to trigger stock lookup
function lookupStockByVoice(ticker) {
  document.getElementById('ticker-input').value = ticker;
  fetchStock(ticker, selectedDays);
}
