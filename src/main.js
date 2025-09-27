document.addEventListener('DOMContentLoaded', function () {
  // phpMyAdmin-Wrapper auflösen → tableBlock holen
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

new fullpage('#fullpage', {
  autoScrolling: true,
  scrollOverflow: true,
  paddingTop: '92px', // gleiche Zahl wie dein Header
  fixedElements: 'header', // optional, aber nett zu dokumentieren
});

google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Year', 'Green Energy', 'Carbon Fuel'],
    ['2004', 1000, 400],
    ['2005', 1170, 460],
    ['2006', 660, 1120],
    ['2007', 1030, 540],
  ]);

  var options = {
    title: 'Change in Energy Consumption',
    curveType: 'function',
    legend: { position: 'bottom' },
    colors: ['#19af13', '#ff6b6b'],
  };

  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

  chart.draw(data, options);
}

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
