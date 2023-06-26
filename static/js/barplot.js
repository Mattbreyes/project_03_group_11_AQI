function updateMap()
{
  // Get the selected date from the dropdown menu
  var selectedDate = document.getElementById('inputDate').value;
  // Construct the URL with the selected date
  var url = '/' + selectedDate;
  // Send a request to the Flask app with the selected date
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200)
    {
      var geoData = JSON.parse(xhr.responseText);
      console.log('Cats Rule!');
      console.log(geoData.features);
      Plotly.newPlot('visual2', geoData);
  };
  xhr.send();
  }
}

updateMap()