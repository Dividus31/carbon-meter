new DataTable('#example', {
  paging: true,
  scrollCollapse: true,
  scrollY: '50vh',
  scrollX: true,
  fixedColumns: {
    left: 1,
    right: 1,
  },
});

new fullpage('#fullpage', {
  autoScrolling: true,
  scrollOverflow: true,
  paddingTop: '92px', // gleiche Zahl wie dein Header
  fixedElements: 'header', // optional, aber nett zu dokumentieren
});
