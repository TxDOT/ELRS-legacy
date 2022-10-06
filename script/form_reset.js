function Reset_Parameters() {
  console.log("resetting parameters");
  current_page = 0;
  route_count = 0;
  elrs_method = 0;
  //document.getElementById("calculator_report").reset();
}

function Reset_InputFormsAll() {
  console.log("resetting all 4 forms");
  document.getElementById("calculator_form_latlon").reset();
  document.getElementById("calculator_form_refmrkr").reset();
  document.getElementById("calculator_form_dfo").reset();
  document.getElementById("calculator_form_csj").reset();
}

function Reset_InputFormsSome(elrs_method) {
  if (elrs_method == 1) {
    console.log("resetting all forms except 1");
    document.getElementById("calculator_form_refmrkr").reset();
    document.getElementById("calculator_form_dfo").reset();
    document.getElementById("calculator_form_csj").reset();
  } else if (elrs_method == 2) {
    console.log("resetting all forms except 2");
    document.getElementById("calculator_form_latlon").reset();
    document.getElementById("calculator_form_dfo").reset();
    document.getElementById("calculator_form_csj").reset();
  } else if (elrs_method == 3) {
    console.log("resetting all forms except 3");
    document.getElementById("calculator_form_latlon").reset();
    document.getElementById("calculator_form_refmrkr").reset();
    document.getElementById("calculator_form_dfo").reset();
  } else if (elrs_method == 4) {
    console.log("resetting all forms except 4");
    document.getElementById("calculator_form_latlon").reset();
    document.getElementById("calculator_form_refmrkr").reset();
    document.getElementById("calculator_form_csj").reset();
  } else if (elrs_method == 0) {
    console.log("resetting all 4 forms");
    document.getElementById("calculator_form_latlon").reset();
    document.getElementById("calculator_form_refmrkr").reset();
    document.getElementById("calculator_form_csj").reset();
    document.getElementById("calculator_form_dfo").reset();
  }
}


function Reset_Echo(elrs_method) {
  document.getElementById("parameter_echo").innerHTML = '';
  /*if (elrs_method == 1) {
    console.log("resetting all echos except 1");
    document.getElementById("show_routeid_2").innerHTML = '';
    document.getElementById("show_refmarker").innerHTML = '';
    document.getElementById("show_displacement").innerHTML = '';
    document.getElementById("show_routeid_4").innerHTML = '';
    document.getElementById("show_dfo").innerHTML = '';
    document.getElementById("show_csj").innerHTML = '';
    document.getElementById("show_mpm").innerHTML = '';
  } else if (elrs_method == 2) {
    console.log("resetting all echos except 2");
    document.getElementById("show_lat").innerHTML = '';
    document.getElementById("show_lon").innerHTML = '';
    document.getElementById("show_routeid_4").innerHTML = '';
    document.getElementById("show_dfo").innerHTML = '';
    document.getElementById("show_csj").innerHTML = '';
    document.getElementById("show_mpm").innerHTML = '';
  } else if (elrs_method == 3) {
    console.log("resetting all echos except 3");
    document.getElementById("show_lat").innerHTML = '';
    document.getElementById("show_lon").innerHTML = '';
    document.getElementById("show_routeid_2").innerHTML = '';
    document.getElementById("show_refmarker").innerHTML = '';
    document.getElementById("show_displacement").innerHTML = '';
    document.getElementById("show_routeid_4").innerHTML = '';
    document.getElementById("show_dfo").innerHTML = '';
  } else if (elrs_method == 4) {
    console.log("resetting all echos except 4");
    document.getElementById("show_lat").innerHTML = '';
    document.getElementById("show_lon").innerHTML = '';
    document.getElementById("show_routeid_2").innerHTML = '';
    document.getElementById("show_refmarker").innerHTML = '';
    document.getElementById("show_displacement").innerHTML = '';
    document.getElementById("show_csj").innerHTML = '';
    document.getElementById("show_mpm").innerHTML = '';
  } else if (elrs_method == 0) {
    console.log("resetting all echos");
    document.getElementById("show_lat").innerHTML = '';
    document.getElementById("show_lon").innerHTML = '';
    document.getElementById("show_routeid_2").innerHTML = '';
    document.getElementById("show_refmarker").innerHTML = '';
    document.getElementById("show_displacement").innerHTML = '';
    document.getElementById("show_csj").innerHTML = '';
    document.getElementById("show_mpm").innerHTML = '';
    document.getElementById("show_routeid_4").innerHTML = '';
    document.getElementById("show_dfo").innerHTML = '';
  }*/
}


function Reset_OutputForm() {
  console.log("resetting all text output");
  document.getElementById("p_returned_RouteCount").innerHTML = '';
  document.getElementById("p_returned_LAT").innerHTML = '';
  document.getElementById("p_returned_LON").innerHTML = '';
  document.getElementById("p_returned_ROUTEID").innerHTML = '';
  document.getElementById("p_returned_ROUTENUMBER").innerHTML = '';
  document.getElementById("p_returned_RTE_DEFN_LN_NM").innerHTML = '';
  document.getElementById("p_returned_RTE_DFO").innerHTML = '';
  document.getElementById("p_returned_RTE_PRFX_TYPE_DSCR").innerHTML = '';
  document.getElementById("p_returned_RDBD_TYPE_DSCR").innerHTML = '';
  document.getElementById("p_returned_RMRKR_PNT_NBR").innerHTML = '';
  document.getElementById("p_returned_RMRKR_DISPLACEMENT").innerHTML = '';
  document.getElementById("p_returned_CTRL_SECT_LN_NBR").innerHTML = '';
  document.getElementById("p_returned_CTRL_SECT_MPT").innerHTML = '';
}

function Reset_urlDisplay() {
  console.log("resetting url display");
  document.getElementById("elrs_url").innerHTML = '';
  document.getElementById("elrs_url").href = '';;
  document.getElementById("elrs_frame").src = '';
}


function HardReset_Calculator(elrs_method) {
  console.log("hard reset");
  Reset_InputFormsSome(elrs_method);
  Reset_Echo(elrs_method);
  Reset_OutputForm();
  Reset_urlDisplay();
  Reset_Parameters();
  setNextPrevVisibility(1, 0);
}

function SoftReset_Calculator(elrs_method) {
  console.log("soft reset");
  Reset_InputFormsSome(elrs_method);
  //Reset_Echo(elrs_method);
}
