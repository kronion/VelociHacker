function timeDownload() {
  var imageAddr = 'http://ncesse.org/wp-content/uploads/2010/04/EarthFromSpace_2560x10241.jpg?n=' + Math.random();
  var startTime, endTime;
  var downloadSize = 1132521;
  var download = new Image();
  download.onload = function () {
      endTime = (new Date()).getTime();
      showResults();
  }
  startTime = (new Date()).getTime();
  download.src = imageAddr;

  function showResults() {
      navigator.geolocation.getCurrentPosition(function(position) {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        socket.emit('message', { speed: speedMbps,
                                 xLoc: position.coords.latitude,
                                 yLoc: position.coords.longitude });
      });
  }
}
setInterval(timeDownload, 10000);
window.onload = timeDownload();
