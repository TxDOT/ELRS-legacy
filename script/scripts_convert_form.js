function Convert_Coords(elrs_method) {
  console.log("Convert_Coords function");
  //var elrs_method = elrs_method;
  //elrs_method = elrs_method;
  console.log("elrs_method: " + elrs_method);

  function updateEcho(elrs_method) {
    console.log("update echo function");

    /*if (elrs_method == 1) {
      var lat = $.trim(document.getElementById("lat").value);
      document.getElementById("show_lat").innerHTML = lat;
      var lon = $.trim(document.getElementById("lon").value);
      document.getElementById("show_lon").innerHTML = lon;
    } else if (elrs_method == 2) {
      var routeid = $.trim(document.getElementById("routeid_2").value);
      document.getElementById("show_routeid_2").innerHTML = routeid;
      var refmarker = $.trim(document.getElementById("refmarker").value);
      document.getElementById("show_refmarker").innerHTML = refmarker;
      var displacement = $.trim(document.getElementById("displacement").value);
      document.getElementById("show_displacement").innerHTML = displacement;
    } else if (elrs_method == 3) {
      var csj = $.trim(document.getElementById("csj").value);
      document.getElementById("show_csj").innerHTML = csj;
      var mpm = $.trim(document.getElementById("mpm").value);
      document.getElementById("show_mpm").innerHTML = mpm;
    } else if (elrs_method == 4) {
      var routeid = $.trim(document.getElementById("routeid_4").value);
      document.getElementById("show_routeid_4").innerHTML = routeid;
      var dfo = $.trim(document.getElementById("dfo").value);
      document.getElementById("show_dfo").innerHTML = dfo;
    }*/

    if (elrs_method == 1) {
      var lat = $.trim(document.getElementById("lat").value);
      var lon = $.trim(document.getElementById("lon").value);
      document.getElementById("parameter_echo").innerHTML = "latitude: " + lat + "; longitude: " + lon;
    } else if (elrs_method == 2) {
      var routeid = $.trim(document.getElementById("routeid_2").value);
      var refmarker = $.trim(document.getElementById("refmarker").value);
      var displacement = $.trim(document.getElementById("displacement").value);
      document.getElementById("parameter_echo").innerHTML = "routeid: " + routeid + "; refmarker: " + refmarker + "; displacement: " + displacement;
    } else if (elrs_method == 3) {
      var csj = $.trim(document.getElementById("csj").value);
      var mpm = $.trim(document.getElementById("mpm").value);
      document.getElementById("parameter_echo").innerHTML = "control section: " + csj + "; milepoint: " + mpm;
    } else if (elrs_method == 4) {
      var routeid = $.trim(document.getElementById("routeid_4").value);
      var dfo = $.trim(document.getElementById("dfo").value);
      document.getElementById("parameter_echo").innerHTML = "routeid: " + routeid + "; dfo: " + dfo;
    }


  }


  function makeURL(elrs_method) {
    console.log("make url: " + elrs_method);
    var lat = $.trim(document.getElementById("lat").value);
    var lon = $.trim(document.getElementById("lon").value);
    var routeid_2 = $.trim(document.getElementById("routeid_2").value);
    var routeid_4 = $.trim(document.getElementById("routeid_4").value);
    var refmarker = $.trim(document.getElementById("refmarker").value);
    var displacement = $.trim(document.getElementById("displacement").value);
    var dfo = $.trim(document.getElementById("dfo").value);
    var csj = $.trim(document.getElementById("csj").value);
    var mpm = $.trim(document.getElementById("mpm").value);

    var gridpath = "https://grid-sys.us-e1.cloudhub.io/api/"
    var grid_elrs1 = gridpath + "elrs1?Lat=" + lat + "&Lon=" + lon;
    var grid_elrs2 = gridpath + "elrs2?RouteID=" + routeid_2 + "&ReferenceMarker=" + refmarker + "&Displacement=" + displacement
    var grid_elrs3 = gridpath + "elrs3?ControlSectionNumber=" + csj + "&MilePointMeasure=" + mpm;
    var grid_elrs4 = gridpath + "elrs4?RouteID=" + routeid_4 + "&DistanceFromOrigin=" + dfo

/*
    if (lat && lon) {
      var url = grid_elrs1;
    } else if (routeid_2 && refmarker && displacement) {
      var url = grid_elrs2;
    } else if (csj && mpm) {
      var url = grid_elrs3;
    } else if (routeid_4 && dfo) {
      var url = grid_elrs4;
    } else {
      console.log("no URL");
    }*/

    if (elrs_method == 1) {
      var url = grid_elrs1;
    } else if (elrs_method == 2) {
      var url = grid_elrs2;
    } else if (elrs_method == 3) {
      var url = grid_elrs3;
    } else if (elrs_method == 4) {
      var url = grid_elrs4;
    } else {
      console.log("no URL");
    }

    document.getElementById("elrs_url").innerHTML=url;
    document.getElementById("elrs_url").href=url;
    document.getElementById("elrs_frame").src=url;
    console.log("updating URL & iframe");

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
    console.log("pj elrs_method: " + elrs_method);

    const result = await getELRS(url);
    const stringifiedObject = JSON.stringify(result);
    //console.log(stringifiedObject);
    const parsedObject = JSON.parse(stringifiedObject);
    console.log(parsedObject);

    var route_count = Object.keys(result).length;
    console.log("routes returned: " + route_count);
    document.getElementById("p_returned_RouteCount").innerHTML = route_count;
    /*result.forEach(foo => {
        console.log(foo);
      })*/
    return parsedObject;
  }

  updateEcho(elrs_method);
  SoftReset_Calculator(elrs_method);
  url = makeURL(elrs_method);
  console.log("url: " + url);
  routes = parseJSON(url);
  return routes;
}


function setNextPrevVisibility(route_count, page) {
  console.log("set button visibility function");
  console.log("sbv elrs_method: " + elrs_method);
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

async function renderELRS(em, pg) {
  console.log("render elrs function");
  elrs_method = em;
  console.log("render elrs method: " + elrs_method);

  const routes = await Convert_Coords(em);
  //var route_count = Object.keys(routes).length;
  route_count = Object.keys(routes).length;
  // Validate page
  if (pg < 0) pg = 0;
  if (pg > (route_count-1)) pg = (route_count-1);
  console.log("setting button visibility from within render elrs function");
  setNextPrevVisibility(route_count, pg);
  console.log("page: " + pg);

  document.getElementById("p_returned_RouteCount").innerHTML = route_count;
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
    console.log(current_page);
    console.log(route_count);
    if (current_page > 0) {
        current_page--;
        console.log("prev page render elrs: " + "method: " + elrs_method + "current page: " + current_page);
        renderELRS(elrs_method, current_page);
    }
}

function nextPage() {
  console.log("nextPage");
  console.log("np current_page: " + current_page);
  console.log("np route_count: " + route_count);
  console.log("np elrs_method: " + elrs_method);
    if (current_page < (route_count-1)) {
        current_page++;
        console.log("next page render elrs: " + "method: " + elrs_method + "current page: " + current_page);
        renderELRS(elrs_method, current_page);
    }
}
