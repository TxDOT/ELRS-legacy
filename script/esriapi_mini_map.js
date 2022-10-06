require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/layers/VectorTileLayer"
  ], function(
    esriConfig,
    Map,
    MapView,
    Graphic,
    GraphicsLayer,
    FeatureLayer,
    VectorTileLayer
  ) {

  const map = new Map({

  });

  TxDOTVectorTileLayer = new VectorTileLayer(
    "https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Vector_Tile_Basemap/VectorTileServer"
    //"https://www.arcgis.com/sharing/rest/content/items/507a9905e7154ce484617c7327ee8bc4/resources/styles/root.json?f=pjson"
    );
  map.add(TxDOTVectorTileLayer);



  const view = new MapView({
    map: map,
    center: [-99.341389, 31.132222], //Longitude, latitude
    zoom: 6,
    minZoom: 5,
    maxZoom: 20,
    container: "minimapDiv"
  });


  document.getElementById("addPointtoMiniMap_btn").onclick = function () {
    addPointtoMiniMap();
  };


  function addPointtoMiniMap(){
    var plot_lon = document.getElementById("p_returned_LON").value;
    var plot_lat = document.getElementById("p_returned_LAT").value;
    createGraphic(plot_lat, plot_lon);

    view.center = [plot_lon, plot_lat];
    view.zoom = 12;
  };


 	/*************************
 	 * Create a point graphic
 	 *************************/
 	function createGraphic(lat, lon){
 	  // First create a point geometry
 	  var point = {
   		type: "point", // autocasts as new Point()
   		longitude: lon,
   		latitude: lat
 	  };

 	  // Create a symbol for drawing the point
 	  var markerSymbol = {
   		type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
   		color: [226, 119, 40]
 	  };

 	  // Create a graphic and add the geometry and symbol to it
 	  var pointGraphic = new Graphic({
   		geometry: point,
   		symbol: markerSymbol
 	  });

 	  // Add the graphics to the view's graphics layer
 	  view.graphics.add(pointGraphic);
 	}




 });
