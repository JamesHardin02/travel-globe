const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

const getVal = feat => feat.properties.POP_EST;

fetch(`/public/datasets/ne_110m_admin_0_countries.geojson`)
  .then(res => res.json())
  .then(countries => {
    fetch(`${window.location.protocol + "//" + window.location.host}/api/posts/itinerary`)
      .then(itineraries => {
        return itineraries.json()
      })
      .then((itineraries) => {
        fetch(`${window.location.protocol + "//" + window.location.host}/api/posts/itinerary/feature`)
          .then(staticItineraries => staticItineraries.json())
          .then(staticItineraries => {
            console.log(countries, 
              itineraries, 
              staticItineraries) 
            // TESTS
            for (i = 0; i < countries.features.length; i++) {
              if (countries.features[i].properties.ADM0_A3 == "GRC") {
                console.log(countries.features[i])
              }
            }
            const maxVal = Math.max(...countries.features.map(getVal));
            colorScale.domain([0, maxVal]);
            const world = Globe()
              .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
              .lineHoverPrecision(0)
              .polygonsData(countries.features.filter(d => {
                for (i = 0; i < itineraries.length; i++) {
                  if (itineraries[i].nation_A3 == d.properties.ADM0_A3) {
                    return d;
                  };
                };
                for (i = 0; i < staticItineraries.length; i++) {
                  if (staticItineraries[i].nation_A3 == d.properties.ADM0_A3) {
                    return d;
                  };
                };
              }))
              .polygonAltitude(0.01)
              .polygonCapColor(feat => 'rgba(217, 180, 87, 0.700)')
              .polygonSideColor(() => 'rgba(252, 214, 149, 0.10)')
              .polygonStrokeColor(() => '#111')
              .polygonLabel(({ properties: d }) => `
              <div data-nation="${d.ADM0_A3}">
                <h2>${d.ADMIN}</h2>
              </div>
            `)
              .onPolygonHover(hoverD => world
                .polygonAltitude(d => d === hoverD ? 0.02 : 0.01)
                .polygonCapColor(d => d === hoverD ? 'rgba(238, 134, 30, 0.700)' : 'rgba(217, 180, 87, 0.700)')
              )
              .polygonsTransitionDuration(300)
              (document.getElementById('globeViz'))
          })
          .then(() => {
            document.querySelector('canvas').addEventListener('click', (e) => {
              if (e.target.parentElement.querySelector('.scene-tooltip').children[0]) {
                console.log(e.target.parentElement.querySelector('.scene-tooltip').children[0].getAttribute('data-nation'))
                window.location.assign(
                  `${window.location.protocol + "//" + window.location.host}/itinerary/nation/${e.target.parentElement.querySelector('.scene-tooltip').children[0].getAttribute('data-nation')}`)
              };
            });
          });
      });
  });
