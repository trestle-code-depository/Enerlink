/* EnerLink corridor map — real Natural Earth geometry via d3-geo + topojson.
   Renders into every [data-corridor-map] container on the page. */
(function () {
  var CITIES = [
    { name: 'Calgary',          role: 'HQ',   lon: -114.07, lat: 51.05, dx: 0,  dy: -20, anchor: 'middle' },
    { name: 'Houston',          role: 'US',   lon:  -95.37, lat: 29.76, dx: 12, dy: 5,   anchor: 'start' },
    { name: 'Seoul',            role: 'ASIA', lon:  126.98, lat: 37.57, dx: 0,  dy: -20, anchor: 'middle' },
    { name: 'Ho Chi Minh City', role: 'ASIA', lon:  106.70, lat: 10.78, dx: -12, dy: 16, anchor: 'end' }
  ];
  var ROUTES = [
    [0, 2], [0, 3], [1, 2]
  ];

  function render(el) {
    var W = 1000, H = 480;
    var dark = el.getAttribute('data-map-theme') !== 'light';
    var land   = dark ? '#132c4a' : '#e8eef7';
    var stroke = dark ? '#2c5687' : '#b8c8de';
    var arcCol = dark ? '#69c37a' : '#3f9e50';
    var label  = dark ? '#e5eefc' : '#0c2f54';
    var sub    = dark ? '#8fb0d6' : '#5b7391';

    var svg = d3.select(el).append('svg')
      .attr('viewBox', '0 0 ' + W + ' ' + H)
      .attr('class', 'w-full h-auto')
      .attr('role', 'img')
      .attr('aria-label', 'World map showing EnerLink offices in Calgary, Houston, Seoul and Ho Chi Minh City, linked across the Pacific.');

    var projection = d3.geoNaturalEarth1().rotate([-155, 0]);
    var path = d3.geoPath(projection);

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(function (topo) {
      var countries = topojson.feature(topo, topo.objects.countries);
      projection.fitExtent([[16, 24], [W - 16, H - 24]], countries);

      var g = svg.append('g');
      g.append('g').selectAll('path').data(countries.features).join('path')
        .attr('d', path).attr('fill', land).attr('stroke', stroke).attr('stroke-width', 0.7);

      // great-circle routes
      ROUTES.forEach(function (r, i) {
        var a = CITIES[r[0]], b = CITIES[r[1]];
        var line = { type: 'LineString', coordinates: [[a.lon, a.lat], [b.lon, b.lat]] };
        g.append('path').attr('d', path(line))
          .attr('fill', 'none').attr('stroke', arcCol).attr('stroke-width', 2)
          .attr('stroke-linecap', 'round').attr('opacity', 0.85)
          .attr('class', 'arc').style('animation-delay', (i * 0.4) + 's');
      });

      // office pins
      CITIES.forEach(function (c) {
        var p = projection([c.lon, c.lat]);
        if (!p) return;
        var pin = g.append('g').attr('class', 'pin');
        pin.append('circle').attr('cx', p[0]).attr('cy', p[1]).attr('r', 4)
          .attr('fill', 'none').attr('stroke', arcCol).attr('stroke-width', 2).attr('class', 'ping');
        pin.append('circle').attr('cx', p[0]).attr('cy', p[1]).attr('r', 5.5)
          .attr('fill', arcCol).attr('stroke', dark ? '#0a1a2f' : '#ffffff').attr('stroke-width', 2);
        pin.append('text')
          .attr('x', p[0] + c.dx).attr('y', p[1] + c.dy).attr('text-anchor', c.anchor)
          .attr('fill', label).attr('font-size', 15).attr('font-weight', 600)
          .attr('font-family', '"Space Grotesk", sans-serif')
          .attr('paint-order', 'stroke').attr('stroke', dark ? '#0a1a2f' : '#ffffff').attr('stroke-width', 3.5)
          .text(c.name);
      });

      el.removeAttribute('data-loading');
    }).catch(function () {
      el.innerHTML = '<p style="text-align:center;padding:3rem 1rem;color:' + sub + ';font-size:.875rem">Map data unavailable.</p>';
    });
  }

  function init() {
    document.querySelectorAll('[data-corridor-map]').forEach(render);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
