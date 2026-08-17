/* EnerLink corridor map — real Natural Earth geometry via d3-geo + topojson.
   Renders into every [data-corridor-map] container on the page.
   Marker legend: solid = EnerLink office, dotted ring = partner coverage, hollow = associate coverage.
   Per brand guide: cities only, no connecting route lines. */
(function () {
  var CITIES = [
    { name: 'Calgary',          tier: 'office',    lon: -114.07, lat: 51.05, dx: 0,   dy: -20, anchor: 'middle' },
    { name: 'Seoul',             tier: 'office',    lon:  126.98, lat: 37.57, dx: 0,   dy: -20, anchor: 'middle' },
    { name: 'Ho Chi Minh City',  tier: 'office',    lon:  106.70, lat: 10.78, dx: 12,  dy: 20,  anchor: 'start' },
    { name: 'San Francisco',     tier: 'office',    lon: -122.42, lat: 37.77, dx: 0,   dy: -20, anchor: 'middle' },
    { name: 'Houston',           tier: 'partner',   lon:  -95.37, lat: 29.76, dx: 12,  dy: 5,   anchor: 'start' },
    { name: 'New York',          tier: 'partner',   lon:  -74.01, lat: 40.71, dx: 12,  dy: -14, anchor: 'start' },
    { name: 'Phnom Penh',        tier: 'associate', lon:  104.92, lat: 11.57, dx: -12, dy: -10, anchor: 'end' }
  ];

  function render(el) {
    var W = 1000, H = 480;
    var dark = el.getAttribute('data-map-theme') !== 'light';
    var land   = dark ? '#132c4a' : '#e8eef7';
    var stroke = dark ? '#2c5687' : '#b8c8de';
    var officeCol = dark ? '#69c37a' : '#3f9e50';
    var partnerCol = dark ? '#a9c8ee' : '#3d5a80';
    var label  = dark ? '#e5eefc' : '#0c2f54';
    var sub    = dark ? '#8fb0d6' : '#5b7391';

    var svg = d3.select(el).append('svg')
      .attr('viewBox', '0 0 ' + W + ' ' + H)
      .attr('class', 'w-full h-auto')
      .attr('role', 'img')
      .attr('aria-label', 'Map showing EnerLink offices in Calgary, Seoul, Ho Chi Minh City and San Francisco, partner coverage in Houston and New York, and associate coverage in Phnom Penh.');

    var projection = d3.geoNaturalEarth1().rotate([-155, 0]);
    var path = d3.geoPath(projection);

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(function (topo) {
      var countries = topojson.feature(topo, topo.objects.countries);
      projection.fitExtent([[16, 24], [W - 16, H - 24]], countries);

      var g = svg.append('g');
      g.append('g').selectAll('path').data(countries.features).join('path')
        .attr('d', path).attr('fill', land).attr('stroke', stroke).attr('stroke-width', 0.7);

      // markers only — no connecting route lines (brand guide rule)
      CITIES.forEach(function (c) {
        var p = projection([c.lon, c.lat]);
        if (!p) return;
        var pin = g.append('g').attr('class', 'pin');

        if (c.tier === 'office') {
          pin.append('circle').attr('cx', p[0]).attr('cy', p[1]).attr('r', 4)
            .attr('fill', 'none').attr('stroke', officeCol).attr('stroke-width', 2).attr('class', 'ping');
          pin.append('circle').attr('cx', p[0]).attr('cy', p[1]).attr('r', 5.5)
            .attr('fill', officeCol).attr('stroke', dark ? '#0a1a2f' : '#ffffff').attr('stroke-width', 2);
        } else if (c.tier === 'partner') {
          pin.append('circle').attr('cx', p[0]).attr('cy', p[1]).attr('r', 6)
            .attr('fill', 'none').attr('stroke', partnerCol).attr('stroke-width', 2.5)
            .attr('stroke-dasharray', '3 2.5');
        } else {
          pin.append('circle').attr('cx', p[0]).attr('cy', p[1]).attr('r', 5.5)
            .attr('fill', dark ? '#0a1a2f' : '#ffffff').attr('stroke', partnerCol).attr('stroke-width', 2.25);
        }

        pin.append('text')
          .attr('x', p[0] + c.dx).attr('y', p[1] + c.dy).attr('text-anchor', c.anchor)
          .attr('fill', label).attr('font-size', c.tier === 'office' ? 15 : 12.5)
          .attr('font-weight', c.tier === 'office' ? 600 : 500)
          .attr('opacity', c.tier === 'office' ? 1 : 0.85)
          .attr('font-family', '"Space Grotesk", sans-serif')
          .attr('paint-order', 'stroke').attr('stroke', dark ? '#0a1a2f' : '#ffffff').attr('stroke-width', 3.5)
          .text(c.name);
      });

      // legend
      var legendItems = [
        { label: 'EnerLink Office', tier: 'office' },
        { label: 'Partner Coverage', tier: 'partner' },
        { label: 'Associate Coverage', tier: 'associate' }
      ];
      var lg = svg.append('g').attr('transform', 'translate(20,' + (H - 26) + ')');
      legendItems.forEach(function (item, i) {
        var lx = i * 190;
        var grp = lg.append('g').attr('transform', 'translate(' + lx + ',0)');
        if (item.tier === 'office') {
          grp.append('circle').attr('r', 5).attr('fill', officeCol);
        } else if (item.tier === 'partner') {
          grp.append('circle').attr('r', 5.5).attr('fill', 'none').attr('stroke', partnerCol).attr('stroke-width', 2.5).attr('stroke-dasharray', '3 2.5');
        } else {
          grp.append('circle').attr('r', 5).attr('fill', dark ? '#0a1a2f' : '#ffffff').attr('stroke', partnerCol).attr('stroke-width', 2.25);
        }
        grp.append('text').attr('x', 12).attr('y', 4).attr('font-size', 11.5).attr('fill', sub).attr('font-family', 'Inter, sans-serif').text(item.label);
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
