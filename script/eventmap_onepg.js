var TxDOTVectorTileLayer;
var imagery;
var esri;
var map;
var queryVariables = [];
var mappedRecords = [];
var recordCounter = 0;
var processCounter = 0;
var dropbox;
var currentRoute = "Nope";
var previousRoute = "";
var currentGeometry;

require(
  ["esri/map",
  "esri/dijit/Legend",
  "esri/config",
  "esri/geometry/Extent",
  "esri/toolbars/edit",
  "esri/geometry/geodesicUtils",
  "esri/units",
  "esri/toolbars/draw",
  "esri/dijit/Measurement",
  "esri/SnappingManager",
  "esri/request",
  "esri/layers/FeatureLayer",
  "esri/dijit/FeatureTable",
  "esri/geometry/geometryEngine",
  "esri/SpatialReference",
  "esri/layers/VectorTileLayer",
  "esri/symbols/SimpleLineSymbol",
  "esri/Color",
  "esri/geometry/Circle",
  "esri/geometry/webMercatorUtils",
  "esri/geometry/Polygon",
  "esri/layers/ArcGISTiledMapServiceLayer",
  "esri/InfoTemplate",
  "dojo/dom",
  "dojo/on",
  "dojo/parser",
  "dojo/domReady!"],
  function(Map,
  Legend,
  esriConfig,
  Extent,
  Edit,
  geodesicUtils,
  Units,
  Draw,
  Measurement,
  SnappingManager,
  esriRequest,
  FeatureLayer,
  FeatureTable,
  geometryEngine,
  SpatialReference,
  VectorTileLayer,
  SimpleLineSymbol,
  Color,
  Circle,
  webMercatorUtils,
  Polygon,
  ArcGISTiledMapServiceLayer,
  InfoTemplate,
  dom,
  on,
  parser) {

  console.log("eventmap_onepg");
  adjustApp();

  document.getElementById("mapProjects_btn").onclick = function () {
    console.log("mapProjects_btn clicked");
    console.log(queryVarStr);
    var qv = resolveStringMapService(queryVarStr);

    if (qv.length>0) {
      console.log("counting queryVariables and calling getSegmentWithM_URL for each");
      for (var i = 0; i < qv.length; i++) {
        getSegmentWithM_URL(qv[i]);
        console.log("getSegmentWithM_URL");
      }
    }

  };


  parser.parse();

  map = new Map("map", {
    center: [-99.5, 31.5], // longitude, latitude
    zoom: 5,
    minZoom:5,
    maxZoom:19,
    logo: false
  });

  // Vector basemap service
  TxDOTVectorTileLayer = new VectorTileLayer(
    "https://tiles.arcgis.com/tiles/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Vector_Tile_Basemap/VectorTileServer"
    //"https://www.arcgis.com/sharing/rest/content/items/507a9905e7154ce484617c7327ee8bc4/resources/styles/root.json?f=pjson"
    ); //TxDOT Vector Tile Basemap
  map.addLayer(TxDOTVectorTileLayer);

  imagery = new ArcGISTiledMapServiceLayer("https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
  map.addLayer(imagery);
  imagery.hide();


  function clearGraphics() {
    map.graphics.clear();
  }

      //---------------------------------------------------

  function getSegmentWithM_URL(theData) {
    //Checking for undefined parameters, stop process if found.
    for (var i = 0; i < theData.length; i++) {
      if (theData[i]==undefined) {
        console.log("Too few parameters.  Please check the URL");
        console.log(theData);
        return;
      }
    }


    var xmlhttp = new XMLHttpRequest();
    console.log("XMLHttpRequest");
    //Comment the following line out for synchronous
    xmlhttp.responseType = 'json';
    xmlhttp.onreadystatechange=function() {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)	{
        //Post edit activities
        findVertices("dynamic",xmlhttp.response,theData[1],theData[2],theData[3],theData[4],theData[5],theData[6]);
      }
    };

    var serviceString;
    var paraString;

    if (theData[0]=="RIA_RTE_ID"||theData[0]=="IA_RTE_ID") {
      serviceString = "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Roadways/FeatureServer/0";
      paraString = "/query?f=json&where=RTE_NM='" + theData[1] + "'&returnGeometry=true&returnM=true";
    }
    if (theData[0]=="CTRL_SECT_NBR"||theData[0]=="TRL_SECT_NBR") {
      serviceString = "https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Control_Sections/FeatureServer/0";
      paraString = "/query?f=json&where=CTRL_SECT_NBR='" + theData[1] + "'&returnGeometry=true&returnM=true";
    }

    var queryString = serviceString+paraString;
    //Asynchronous
    xmlhttp.open("POST",queryString,true);
    xmlhttp.send();
  }

      function findVertices(requestType,geomWithM,theRoute,theFrom,theTo,theColor,theSize,theDescription) {
        console.log("findVertices");
        var theGeomPart;
        var theGeometry;

        if (requestType=="static") {
          theGeometry = JSON.parse(geomWithM);
        }
        else {
          theGeometry = geomWithM;
        }

        var PrevCoordM;
        var CurCoordM;
        var partNumberBegin;
        var partNumberEnd;
        var vertexNumberBegin;
        var vertexNumberEnd;
        var beginM = 0;
        var endM = 0;

        var beginPoint=[];
        var endPoint=[];

        //Round measure parameters to prevent errors outside measure range
        theFrom = roundToDecimalPlace(theFrom,3);
        theTo = roundToDecimalPlace(theTo,3);

        var maxFeatureM = 0;
        var minFeatureM = 0;
        var maxCoordsLength = 0;

        for (var a=0; a < theGeometry.features.length; a++) {
          console.log("Check Event M's and Feature M's");
          theGeomPart = theGeometry.features[a].geometry.paths;

          //Check Event M's and Feature M's
          maxCoordsLength = theGeometry.features[a].geometry.paths[0].length-1;
          minFeatureM = roundToDecimalPlace(theGeometry.features[a].geometry.paths[0][0][2],3);
          maxFeatureM = roundToDecimalPlace(theGeometry.features[a].geometry.paths[0][maxCoordsLength][2],3);

          //if from >= minM and to <= maxM run normally
          //if from < minM and to > maxM take the whole segment

          if (theFrom<=minFeatureM&&theTo>=maxFeatureM) {
            //Take the whole segment
            partNumberBegin = a;
            partNumberEnd = a;
            vertexNumberBegin = 0;
            vertexNumberEnd = theGeometry.features[a].geometry.paths[0].length-1;
            beginM = minFeatureM;
            endM = maxFeatureM;
            theFrom = minFeatureM;
            theTo = maxFeatureM;
          }
          else {
            //Run normally
            for (var j = 1; j < theGeomPart[0].length; j++) {
              PrevCoordM = roundToDecimalPlace(theGeomPart[0][j-1][2],3);
              CurCoordM = roundToDecimalPlace(theGeomPart[0][j][2],3);

              //Finding the Begin Vertex
              if (theFrom>=PrevCoordM&&theFrom<=CurCoordM) {
                partNumberBegin = a;
                vertexNumberBegin = j-1;
                beginM = theGeomPart[0][j-1][2];
                beginPoint.push(theGeomPart[0][j-1][0],theGeomPart[0][j-1][1]);
              }

              //Finding the End Vertex
              if (theTo>=PrevCoordM&&theTo<=CurCoordM) {
                partNumberEnd = a;
                vertexNumberEnd = j;
                endM = theGeomPart[0][j][2];
                endPoint.push(theGeomPart[0][j][0],theGeomPart[0][j][1]);
              }
            }
          }
        }

        if (partNumberBegin!=partNumberEnd) {
          return;
        }

        //Build Line 102100
        var newPolyline = new esri.geometry.Polyline(new esri.SpatialReference({wkid:102100}));
        newPolyline.type = "polyline";
        var tmpAttLine = [];

        for (var x = vertexNumberBegin; x <= vertexNumberEnd; x++) {
          tmpAttLine.push([theGeometry.features[partNumberBegin].geometry.paths[0][x][0],theGeometry.features[partNumberBegin].geometry.paths[0][x][1]]);
        }

        newPolyline.addPath(tmpAttLine);

        //4326
        var spatialReferenceLatLong = new SpatialReference({wkid:4326});

        //-- Set Radius for Begin Circle --
        var beginCircleRadius = Math.abs(beginM-theFrom) * 1609.344; //was theFrom

        if (beginCircleRadius<=0) {
          beginCircleRadius=1;
        }

        var beginCircleLatLong = webMercatorUtils.xyToLngLat(tmpAttLine[0][0], tmpAttLine[0][1]);

        //Build Circle from begin point
        var beginCircle = new Circle([beginCircleLatLong[0], beginCircleLatLong[1]],{
          "radius": beginCircleRadius,
          "radiusUnit": Units.METERS,
          "geodesic": true,
          "spatialReference": spatialReferenceLatLong
        });

        //Convert Begin Circle to Polygon 4326
        var beginPolygon = new esri.geometry.Polygon(new esri.SpatialReference({wkid:4326}));
        beginPolygon.type = "polygon";
        beginPolygon.addRing(beginCircle.rings[0]);

        //Convert Lat Long to Web Mercator, so everything is the same
        var beginPolygonWebMer = webMercatorUtils.geographicToWebMercator(beginPolygon);

        //-- Set Radius for End Circle --
        var endCircleRadius = Math.abs(endM-theTo) * 1609.344; //was theTo

        if (endCircleRadius<=0) {
          endCircleRadius=1;
        }

        var endCircleLatLong = webMercatorUtils.xyToLngLat(tmpAttLine[tmpAttLine.length-1][0], tmpAttLine[tmpAttLine.length-1][1]);

        //Build Circle from end point
        var endCircle = new Circle([endCircleLatLong[0], endCircleLatLong[1]],{
          "radius": endCircleRadius,
          "radiusUnit": Units.METERS,
          "geodesic": true,
          "spatialReference": spatialReferenceLatLong
        });

        //Convert End Circle to Polygon 4326
        var endPolygon = new esri.geometry.Polygon(new esri.SpatialReference({wkid:4326}));
        endPolygon.type = "polygon";
        endPolygon.addRing(endCircle.rings[0]);

        //Convert Lat Long to Web Mercator, so everything is the same
        var endPolygonWebMer = webMercatorUtils.geographicToWebMercator(endPolygon);

        //Trimming event linework if needed from beginning and ending of segment
        var finalLinework = newPolyline;
        var beginClip;
        var endClip;

        if (Math.abs(beginM-theFrom)>=.001) { // was .002
          beginClip = intersectLinework(newPolyline,beginPolygonWebMer);
          finalLinework = cutLinework(newPolyline,beginClip);
        }

        if (Math.abs(endM-theTo)>=.001) { // was .002
          endClip = intersectLinework(newPolyline,endPolygonWebMer);
          finalLinework = cutLinework(finalLinework,endClip);
        }

        if (tmpAttLine.length>1) {
          mappedRecords.push(finalLinework);
          addToMap(finalLinework,theRoute,theFrom,theTo,theColor,theSize,theDescription,beginPolygon,endPolygon);
          // drawPoint(beginPoint,"Begin","#FF0000");
          // drawPoint(endPoint,"End","#0000FF");
        }
        else {
          alert("No points found within range " + theFrom + "-" + theTo);
        }

      }

      function intersectLinework(linework,polygon) {
        console.log("intersectLinework");
        var newGeometry = geometryEngine.intersect(linework, polygon);
        return newGeometry;
      }

      function cutLinework(linework,clipper) {
        console.log("cutLinework");
        var newGeometry = geometryEngine.difference(linework,clipper);
        return newGeometry;
      }

      function addToMap(theGeom,theRoute,theFrom,theTo,theColor,theSize,theDescription,beginPolygon,endPolygon) {
        console.log("addToMap");
        var symbol = new esri.symbol.SimpleLineSymbol("solid", theColor, theSize);

        //Replace All, works in all browsers
        theDescription = theDescription.replace(/%20/g, ' ');

        var attr = {"Route Name":theRoute,"Description":theDescription,"From":theFrom,"To":theTo};
        var infoTemplate = new InfoTemplate("${Route Name}","<br/>${Description} <br/><br/>");

        map.graphics.add(new esri.Graphic(theGeom, symbol, attr, infoTemplate));

        processCounter+=1;

        if (recordCounter==processCounter) {
          mergeExtents();
        }
      }

      function drawPoint(thePoint,theLabel,theColor) {
        var thePoint = new esri.geometry.Point([thePoint[0],thePoint[1]], new SpatialReference({wkid: 10200 }));
        //Point style
        var symbol = new esri.symbol.SimpleMarkerSymbol();
        symbol.style = esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE;
        symbol.setSize(6);
        symbol.setColor(new esri.Color(theColor));
        map.graphics.add(new esri.Graphic(thePoint, symbol));

        //Label
        var label_symbol =  new esri.symbol.TextSymbol(theLabel);
        label_symbol.setColor(new esri.Color(theColor));
        label_symbol.setFont(new esri.symbol.Font("10pt").setWeight(esri.symbol.Font.WEIGHT_BOLD));

        var currentScale = map.getScale();
        var labelOffset=Math.round(currentScale/350);

        //Location for the label
        var labelLocation = new esri.geometry.Point([thePoint.x,thePoint.y+labelOffset], new SpatialReference({wkid: 3857 }));
        map.graphics.add(new esri.Graphic(labelLocation, label_symbol));
      }

      function mergeExtents() {
        var newExtent = new Extent(mappedRecords[0].getExtent());

        for (var i = 0; i < mappedRecords.length; i++) {
          var thisExtent = mappedRecords[i].getExtent();
          newExtent = newExtent.union(thisExtent);
        }

        map.setExtent(newExtent.expand(2));
      }

      function roundToDecimalPlace(value,decimals) {
          return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
      }

      function getMiddleCharacters(theData,beginNumber,endNumber) {
        return theData.substring(beginNumber, beginNumber+endNumber);
      }

      function getRightCharacters(theData,theNumber) {
          console.log(theData.substring(theData.length-theNumber, theData.length));
          return theData.substring(theData.length-theNumber, theData.length);
      }

      function getRandomColor() {
        var availableColors = ["#ff0000","#ffbf00","#ffff00","#00ff00","#0000ff","#808080"];
        var ranColor = availableColors[getRandomIntInclusive(0,availableColors.length-1)];
        return ranColor;
      }

      //Random Number
      function getRandomIntInclusive(min,max) {
          min = Math.ceil(min);
          max = Math.floor(max);
          return Math.floor(Math.random() * (max - min + 1)) + min;
      }



      //Resolve String ----------------------------------------------------
      //this function takes a text string and converts it to queryVariables
      function resolveStringMapService(queryVarStr) {
        console.log("resolveStringMapService");

        console.log(queryVarStr);
        var thequeryVarStrlen = queryVarStr.length;
        //var typeBegin = queryVarStr.indexOf("?");
        var theVariables = [];
        var tempNAI;
        var tempFeature;

        /*if (typeBegin<1) {
          return;
        }*/

        console.log("using RIA");
        theVariables = queryVarStr.substring(0,thequeryVarStrlen).split("&R");

        recordCounter = theVariables.length;

        for (var i = 0; i < theVariables.length; i++) {
          var equalOperator = theVariables[i].indexOf("=");

          if (equalOperator>0) {
            tempNAI = theVariables[i].split("=");
            tempFeature = tempNAI[1].split("|");
            queryVariables.push([tempNAI[0],tempFeature[0],tempFeature[1],tempFeature[2],tempFeature[3],tempFeature[4],tempFeature[5]]);
          }
        }
        console.log(queryVariables);
        return queryVariables;
      }
      //---------------------------------------

      //-----Adjusts the header, index, and contents-----//
      function adjustApp() {
        console.log("adjustApp");
        var w = window.innerWidth;
        var h = window.innerHeight;

        //----Map Variables
        var mapStyleTop = 0;
        var mapStyleLeft = 0;
        var mapWidth = w;
        var mapHeight = h;

        document.getElementById("map").style.top = mapStyleTop + "px";
        document.getElementById("map").style.left = mapStyleLeft  + "px";
        document.getElementById("map").style.width = mapWidth + "px";
        document.getElementById("map").style.height = mapHeight + "px";
        //----End Map
      }
      //-----End header, index, and contents-----//

 //Function End
}
//Require end
);

//Adjusts the table of contents, map, and coordinate readouts.
function adjustApp() {
  var w = window.innerWidth;
  var h = window.innerHeight;

  document.getElementById("map").style.left = "0px";
  document.getElementById("map").style.width = (w - (2)) + "px";
  document.getElementById("map").style.height = h + "px";
}

function addImagery() {
    TxDOTVectorTileLayer.hide();
    imagery.show();
    document.getElementById("txdotMap").style.backgroundColor="white";
    document.getElementById("imagery").style.backgroundColor="#DCDCDC";
}

function addTxDOT() {
    imagery.hide();
    TxDOTVectorTileLayer.show();
    document.getElementById("txdotMap").style.backgroundColor="#DCDCDC";
    document.getElementById("imagery").style.backgroundColor="white";
}
