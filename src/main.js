// ===== Feste Dummy-Werte je Jahr (kein Zugriff auf CARBON_DATA) =====
const YEAR_STATS = {
  1980: { totalMt: 21000, perCapitaT: 5.8, co2PerGdp: 0.42, greenPct: 5 },
  1990: { totalMt: 23000, perCapitaT: 6.2, co2PerGdp: 0.39, greenPct: 8 },
  2010: { totalMt: 33000, perCapitaT: 4.9, co2PerGdp: 0.28, greenPct: 12 },
  2025: { totalMt: 37000, perCapitaT: 4.3, co2PerGdp: 0.23, greenPct: 19 },
};

// Helfer für Formatierung
const fmt = (n, d = 0) =>
  Number(n).toLocaleString('de-DE', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });

// Cards updaten
function updateCards(year) {
  const data = YEAR_STATS[year] || YEAR_STATS[2025];

  const cardTotal = document.querySelector('#card-total  .display-6');
  const cardCapita = document.querySelector('#card-capita .display-6');
  const cardGdp = document.querySelector('#card-gdp    .display-6');
  const cardGreen = document.querySelector('#card-green  .display-6');

  if (cardTotal) cardTotal.textContent = `${fmt(data.totalMt, 0)} Mt`;
  if (cardCapita) cardCapita.textContent = `${fmt(data.perCapitaT, 2)} t`;
  if (cardGdp) cardGdp.textContent = `${fmt(data.co2PerGdp, 2)}`;
  if (cardGreen) cardGreen.textContent = `${fmt(data.greenPct, 0)} %`;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  const select = document.getElementById('yearSelect');
  if (select) {
    updateCards(select.value);
    select.addEventListener('change', () => updateCards(select.value));
  } else {
    updateCards('2025');
  }
});

// DataTable initialisieren
document.addEventListener('DOMContentLoaded', function () {
  // Datenquelle aus carbon_country_stats.js suchen
  const blocks =
    window.CARBON_DATA && Array.isArray(window.CARBON_DATA.data)
      ? window.CARBON_DATA.data
      : [];
  const tableBlock = blocks.find(
    (b) => b && b.type === 'table' && b.name === 'carbon_country_stats'
  );

  if (!tableBlock || !Array.isArray(tableBlock.data)) {
    console.error('carbon_country_stats nicht gefunden oder leer.', window.CARBON_DATA);
    alert(
      'Datenquelle nicht gefunden. Prüfe Pfad/Datei: ../data/carbon_country_stats.js'
    );
    return;
  }

  // Strings → Numbers
  const rows = tableBlock.data.map((r) => ({
    country_name: r.country_name,
    iso_code: r.iso_code,
    year: Number(r.year),
    total_emissions_mt: Number(r.total_emissions_mt),
    per_capita_t: Number(r.per_capita_t),
    co2_per_gdp: Number(r.co2_per_gdp),
    green_energy_pct: Number(r.green_energy_pct),
  }));

  // Debug (optional)
  console.log('rows count:', rows.length);
  console.log('first row:', rows[0]);

  // DataTable EINMAL initialisieren
  new DataTable('#example', {
    data: rows,
    columns: [
      { data: 'country_name', title: 'Country' },
      { data: 'iso_code', title: 'ISO' },
      { data: 'year', title: 'Year' },
      { data: 'total_emissions_mt', title: 'Total Emissions (Mt)' },
      { data: 'per_capita_t', title: 'Per Capita (t)' },
      { data: 'co2_per_gdp', title: 'CO₂ per GDP' },
      { data: 'green_energy_pct', title: 'Green Energy (%)' },
    ],
    paging: true,
    scrollCollapse: true,
    scrollY: '50vh',
    scrollX: true,
    fixedColumns: { left: 1, right: 1 },
    responsive: true,
  });
});

// FullPage.js initialisieren
new fullpage('#fullpage', {
  autoScrolling: true,
  scrollOverflow: true,
  paddingTop: '92px', // gleiche Zahl wie dein Header
  fixedElements: 'header', // optional, aber nett zu dokumentieren
});

google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

// Diagramm zeichnen
function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Year', 'Green Energy', 'Carbon Fuel'],
    ['2010', 14, 86],
    ['2025', 19, 81],
    ['2035', 34, 66],
    ['2045', 70, 30],
  ]);

  var options = {
    title: 'Change in Energy Consumption in %',
    curveType: 'function',
    legend: { position: 'bottom' },
    colors: ['#19af13', '#ff6b6b'],
  };

  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

  chart.draw(data, options);
}

// Sidebar-Funktionen
function w3_open() {
  document.getElementById('mySidebar').style.display = 'block';
  document.getElementById('myOverlay').style.display = 'block';
}
function w3_close() {
  document.getElementById('mySidebar').style.display = 'none';
  document.getElementById('myOverlay').style.display = 'none';
}

$(window).resize(function () {
  drawChart();
});
