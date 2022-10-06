function Convert_Coords_Map(x, y) {
  console.log("Convert_Coords_Map function");

  function makeURL(x, y) {
    console.log("make url");
    var lat = y;
    var lon = x;
    var gridpath = "https://grid-sys.us-e1.cloudhub.io/api/"
    var grid_elrs1 = gridpath + "elrs1?Lat=" + lat + "&Lon=" + lon;
    var url = grid_elrs1;

    document.getElementById("elrs_url").innerHTML=url;
    document.getElementById("elrs_url").href=url;

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

    var route_count = Object.keys(result).length;
    //document.getElementById("p_returned_RouteCount").innerHTML = route_count;
    return parsedObject;
  }

  url = makeURL(x, y);
  routes = parseJSON(url);
  return routes;
}


function setNextPrevVisibility(route_count, page) {
  console.log("set button visibility function");
  var btn_next = document.getElementById("btn_next");
  var btn_prev = document.getElementById("btn_prev");
  var page_span = document.getElementById("page");
  document.getElementById("page").innerHTML = "Route " + (page+1) + " of " + route_count;

  if (page == 0) { btn_prev.style.visibility = "hidden";
  } else { btn_prev.style.visibility = "visible"; }

  if (page == (route_count-1)) { btn_next.style.visibility = "hidden";
  } else { btn_next.style.visibility = "visible"; }

  if (route_count < 2) { page_span.style.visibility = "hidden";
  } else { page_span.style.visibility = "visible"; }
}

async function renderELRS_Map(x, y, pg) {
  console.log("render elrs map function");

  const routes = await Convert_Coords_Map(x, y);
  route_count = Object.keys(routes).length;
  // Validate page
  if (pg < 0) pg = 0;
  if (pg > (route_count-1)) pg = (route_count-1);
  console.log("setting button visibility from within render elrs function");
  setNextPrevVisibility(route_count, pg);
  console.log("page: " + pg);

  //document.getElementById("p_returned_RouteCount").innerHTML = route_count;
  console.log("route_count: " + route_count);
  document.getElementById("p_returned_LAT").innerHTML = routes[pg].LAT;
  document.getElementById("p_returned_LON").innerHTML = routes[pg].LON;
  document.getElementById("p_returned_ROUTEID").innerHTML = routes[pg].ROUTEID;
  document.getElementById("p_returned_ROUTENUMBER").innerHTML = routes[pg].ROUTENUMBER;
  document.getElementById("p_returned_RTE_DEFN_LN_NM").innerHTML = routes[pg].RTE_DEFN_LN_NM;
  document.getElementById("p_returned_RTE_DFO").innerHTML = routes[pg].RTE_DFO;
  document.getElementById("p_returned_RTE_PRFX_TYPE_DSCR").innerHTML = routes[pg].RTE_PRFX_TYPE_DSCR;
  document.getElementById("p_returned_RDBD_TYPE_DSCR").innerHTML = routes[pg].RDBD_TYPE_DSCR;
  document.getElementById("p_returned_RMRKR_PNT_NBR").innerHTML = routes[pg].RMRKR_PNT_NBR;
  document.getElementById("p_returned_RMRKR_DISPLACEMENT").innerHTML = routes[pg].RMRKR_DISPLACEMENT;
  document.getElementById("p_returned_CTRL_SECT_LN_NBR").innerHTML = routes[pg].CTRL_SECT_LN_NBR;
  document.getElementById("p_returned_CTRL_SECT_MPT").innerHTML = routes[pg].CTRL_SECT_MPT;
}

function prevPage() {
    console.log("prevPage");
    if (current_page > 0) {
        current_page--;
        renderELRS_Map(current_page);
    }
}

function nextPage() {
  console.log("nextPage");
    if (current_page < (route_count-1)) {
        current_page++;
        renderELRS_Map(current_page);
    }
}
