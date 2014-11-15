var socket = io.connect('http://localhost:8000');

var markers = {};

function startSockets(map) {
  socket.on('update', function(data) {
    if (markers[data.id] !== undefined) {
      var marker = markers[data.id]; 
      clearTimeout(marker.timeout);
      marker.iw.setContent("Approximate speed is " + String(data.speed) + "Mbps");
      var timeout = setTimeout(function() {
        marker.marker.setMap(null);
        delete marker.iw;
        delete marker.marker;
        delete markers[data.id];
      }, 20000);
      marker.timeout = timeout;
    }
    else {
      var coords = new google.maps.LatLng(Number(data.xLoc), Number(data.yLoc));

      var infowindow = new google.maps.InfoWindow({
        content: "Approximate speed is " + String(data.speed) + "Mbps"
      });

      var marker = new google.maps.Marker({
        position: coords,
        animation: google.maps.Animation.DROP,
        visible: true
      });
      marker.setMap(map);
      var timeout = setTimeout(function() {
        marker.setMap(null);
        delete infowindow;
        delete marker.marker;
        delete markers[data.id];
      }, 20000);

      function toggle() {
        var opened = false;
        var clickMarker = function() {
          if (opened) {
            opened = false;
            infowindow.close();
          }
          else {
            infowindow.open(map, marker);
            opened = true;
          }
        }
        return clickMarker;
      }
      google.maps.event.addListener(marker, 'click', toggle());
      
      markers[data.id] = { marker: marker,
                           iw: infowindow,
                           timeout: timeout };
    }
  });
}
