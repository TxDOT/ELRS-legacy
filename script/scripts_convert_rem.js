var rtenm;
var bdfo;
var edfo;

function Convert_Coords(terminus) {
  console.log("Convert_Coords function");

  function makeURL(terminus) {
    console.log("make url: " + terminus);
    var gridpath = "https://grid-sys.us-e1.cloudhub.io/api/"
    var b_lat = $.trim(document.getElementById("b_lat").value);
    var b_lon = $.trim(document.getElementById("b_lon").value);
    var e_lat = $.trim(document.getElementById("e_lat").value);
    var e_lon = $.trim(document.getElementById("e_lon").value);
    console.log(b_lat + ", "+ b_lon + ", " + e_lat + ", " + e_lon);


    if (terminus == 0){
      var url = gridpath + "elrs1?Lat=" + b_lat + "&Lon=" + b_lon;
    } else if (terminus == 1){
      var url = gridpath + "elrs1?Lat=" + e_lat + "&Lon=" + e_lon;
    }
    console.log(url);
    return url;
  }


  async function getELRS(url) {
    console.log("get elrs from: " + url);
    const response = await fetch(url, {method: 'GET'});
    if (!response.ok) {throw new Error(`Error! status: ${response.status}`);}
      const result = await response.json();
      return result;
  }


  async function parseJSON(url) {
    console.log("parse JSON function");

    const result = await getELRS(url);
    const stringifiedObject = JSON.stringify(result);
    const parsedObject = JSON.parse(stringifiedObject);
    console.log(parsedObject);

    return parsedObject;
  }


  url = makeURL(terminus);
  routes = parseJSON(url);
  return routes;
}


async function renderRouteELRS(terminus) {
  console.log("render route elrs function");

  const routes = await Convert_Coords(terminus);

  if (terminus == 0){
    rtenm = routes[0].RTE_DEFN_LN_NM;
    document.getElementById("p_returned_RTE_DEFN_LN_NM").innerHTML = routes[0].RTE_DEFN_LN_NM;
    bdfo = routes[0].RTE_DFO;
    document.getElementById("BDFO").innerHTML = routes[0].RTE_DFO;
  } else if (terminus == 1){
    rtenm = routes[0].RTE_DEFN_LN_NM;
    document.getElementById("p_returned_RTE_DEFN_LN_NM").innerHTML = routes[0].RTE_DEFN_LN_NM;
    edfo = routes[0].RTE_DFO;
    document.getElementById("EDFO").innerHTML = routes[0].RTE_DFO;
  }
}
