require([
  "esri/map", //needed
  "esri/layers/VectorTileLayer", //needed
  "esri/geometry/webMercatorUtils", //needed
  "esri/geometry/geometryEngine", //needed
  "esri/geometry/Extent", //needed
  "esri/geometry/Point", //needed
  "esri/SpatialReference" //needed
], function (
  Map, //needed
  VectorTileLayer, //needed
  webMercatorUtils, //needed
  geometryEngine, //needed
  Extent, //needed
  Point, //needed
  SpatialReference //needed
) {

  map = new Map("mapDiv", {
    center: [-99.341389, 31.132222],
    zoom: 6,
    minZoom: 5,
    maxZoom: 20,
    logo: false,
    extent: new Extent({
      xmin: -20098296,
      ymin: -2804413,
      xmax: 5920428,
      ymax: 15813776,
      spatialReference: { wkid: 102100 },
    }),
  });

  var theExtent = new esri.geometry.Extent({
    xmin: -20098296,
    ymin: -2804413,
    xmax: 5920428,
    ymax: 15813776,
    spatialReference: { wkid: 102100 },
  });
  var theCenter = new Point([-99.341389, 31.132222]);
  var theZoom = 6;

  TxDOTVectorTileLayer = new VectorTileLayer(
    "https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Vector_Tile_Basemap/VectorTileServer"
    //"https://www.arcgis.com/sharing/rest/content/items/507a9905e7154ce484617c7327ee8bc4/resources/styles/root.json?f=pjson"
    );
  map.addLayer(TxDOTVectorTileLayer);

  map.on("load", function () {
    map.on("mouse-move", setCoordinates);
    map.on("mouse-drag", setCoordinates);
    document.getElementById("mapDiv_container").style.cursor = "crosshair";
  });

  map.on("click", identRoute);
  // do not delete
  // map.on("click", getPointnoSnap);


  map.on("mouse-up", function () {
    document.getElementById("mapDiv_container").style.cursor = "crosshair";
  });

  function identRoute(event) {
    queryTaskRoadways = new esri.tasks.QueryTask(
      "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Roadways_Unsegmented/FeatureServer/0"
    );

    queryR = new esri.tasks.Query();
    queryR.returnGeometry = true;
    queryR.outFields = ["*"];
    queryR.geometry = event.mapPoint;

    mapPoint = event.mapPoint;

    var point = event.mapPoint;
    var pxWidth = map.extent.getWidth() / map.width;
    var padding = 15 * pxWidth;
    var newGeom = new esri.geometry.Extent({
      xmin: point.x - padding,
      ymin: point.y - padding,
      xmax: point.x + padding,
      ymax: point.y + padding,
      spatialReference: point.spatialReference,
    });

    queryR.geometry = newGeom;
    queryTaskRoadways.execute(queryR, getSegment);
  }

  function getSegment(results) {
    map.graphics.clear();

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        gidWithMeasuresGeom = xmlhttp.response;
        getPoint(results);
      }
    };

    var serviceString =
      "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Roadways_Unsegmented/FeatureServer/0";
    var paraString =
      "/query?f=json&where=GID=" +
      results.features[0].attributes.GID +
      "&returnGeometry=true&returnM=true&outSR=102100";
    var queryString = serviceString + paraString;
    xmlhttp.open("GET", queryString, true);
    xmlhttp.responseType = "json";
    xmlhttp.send();
  }


  function getPoint(results) {
    var firstIntersectingPoint = findNearestCoordinate(mapPoint);
    drawPoint(firstIntersectingPoint, "#FF0000");

    // SET READOUT VALUES
    //document.getElementById("long").innerHTML = globalX;
    //document.getElementById("lat").innerHTML = globalY;

    renderELRS_Map(globalX, globalY, 0);
  }

  function getPointnoSnap(event) {
    mapPoint = event.mapPoint;
    drawPoint(mapPoint, "#FF0000");

    // SET READOUT VALUES
    document.getElementById("long").innerHTML = globalX;
    document.getElementById("lat").innerHTML = globalY;
  }


  function drawPoint(thePoint) {
    var thePoint = new esri.geometry.Point(
      [thePoint.x, thePoint.y],
      new SpatialReference({
        wkid: 3857,
      })
    );
    //Point style
    var symbol = new esri.symbol.SimpleMarkerSymbol();
    symbol.style = esri.symbol.SimpleMarkerSymbol.STYLE_X;
    symbol.setSize(14);

    map.graphics.add(new esri.Graphic(thePoint, symbol));
  }

  function createTwoPointPolyline(point1, point2) {
    var newPolyline = new esri.geometry.Polyline(
      new esri.SpatialReference({
        wkid: 3857,
      })
    );
    newPolyline.type = "polyline";
    var tmpAttLine = [];
    tmpAttLine.push(point1);
    tmpAttLine.push(point2);
    newPolyline.addPath(tmpAttLine);
    return newPolyline;
  }

  function findNearestCoordinate(point) {
    var shortestDistance = 20000;
    var firstIntersectingPoint;
    var firstIntersectingPointTemp;
    featurePartIndex = 0;

    for (var h = 0; h < gidWithMeasuresGeom.features.length; h++) {
      firstIntersectingPointTemp = geometryEngine.nearestCoordinate(
        gidWithMeasuresGeom.features[h].geometry,
        point
      );
      if (firstIntersectingPointTemp.distance < shortestDistance) {
        shortestDistance = firstIntersectingPointTemp.distance;
        firstIntersectingPoint = firstIntersectingPointTemp;
        featurePartIndex = h;
      }
    }
    var returnPoint = new esri.geometry.Point(
      [
        firstIntersectingPoint.coordinate.x,
        firstIntersectingPoint.coordinate.y,
      ],
      new SpatialReference({
        wkid: 3857,
      })
    );
    return returnPoint;
  }

  function setCoordinates(evt) {
    var mp = new webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
    globalX = mp.x.toFixed(6);
    globalY = mp.y.toFixed(6);
    var coords = mp.y.toFixed(6) + ", " + mp.x.toFixed(6);

  }

});
