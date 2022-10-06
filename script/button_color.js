$( document ).ready(function() {
  $( "#resetFormView" ).click(function() {
    $( "#resetFormView" ).css('background-color', 'DimGrey');
    $( "#returnResultsLatLon" ).css('background-color', '#CC7B29');//full orange
    $( "#returnResultsRefMrkr" ).css('background-color', '#CC7B29');//full orange
    $( "#returnResultsDFO" ).css('background-color', '#CC7B29');//full orange
    $( "#returnResultsCS" ).css('background-color', '#CC7B29');//full orange
    $( "#addPointtoMiniMap_btn" ).css('background-color', '#D59F6A'); //half orange
  });
});

$( document ).ready(function() {
  $( "#returnResultsLatLon" ).click(function() {
    $( "#returnResultsLatLon" ).css('background-color', '#14375A');//full blue
    $( "#addPointtoMiniMap_btn" ).css('background-color', '#CC7B29');//full orange
    $( "#resetFormView" ).css('background-color', '#D59F6A');//half orange
  });
});



$( document ).ready(function() {
  $( "#returnResultsRefMrkr" ).click(function() {
    $( "#returnResultsRefMrkr" ).css('background-color', '#14375A');//full blue
    $( "#addPointtoMiniMap_btn" ).css('background-color', '#CC7B29');//full orange
    $( "#resetFormView" ).css('background-color', '#D59F6A');//half orange
  });
});

$( document ).ready(function() {
  $( "#returnResultsDFO" ).click(function() {
    $( "#returnResultsDFO" ).css('background-color', '#14375A');//full blue
    $( "#addPointtoMiniMap_btn" ).css('background-color', '#CC7B29');//full orange
    $( "#resetFormView" ).css('background-color', '#D59F6A');//half orange
  });
});

$( document ).ready(function() {
  $( "#returnResultsCS" ).click(function() {
    $( "#returnResultsCS" ).css('background-color', '#14375A');//full blue
    $( "#addPointtoMiniMap_btn" ).css('background-color', '#CC7B29');//full orange
    $( "#resetFormView" ).css('background-color', '#D59F6A');//half orange
  });
});

$( document ).ready(function() {
  $( "#addPointtoMiniMap_btn" ).click(function() {
    $( "#addPointtoMiniMap_btn" ).css('background-color', '#14375A');//full blue
    $( "#resetFormView" ).css('background-color', '#CC7B29');//full orange
  });
});

// rte view

$( document ).ready(function() {
  $( "#returnBDFO" ).click(function() {
    $( "#returnBDFO" ).css('background-color', '#14375A');//full blue
    $( "#returnEDFO" ).css('background-color', '#CC7B29');//full orange
  });
});

$( document ).ready(function() {
  $( "#returnEDFO" ).click(function() {
    $( "#returnEDFO" ).css('background-color', '#14375A');//full blue
    $( "#addOrAssembleQueryStr_btn" ).css('background-color', '#CC7B29');//full orange
  });
});

$( document ).ready(function() {
  $( "#addOrAssembleQueryStr_btn" ).click(function() {
    $( "#addOrAssembleQueryStr_btn" ).css('background-color', '#14375A');//full blue
    $( "#mapProjects_btn" ).css('background-color', '#CC7B29');//full orange
  });
});

$( document ).ready(function() {
  $( "#mapProjects_btn" ).click(function() {
    $( "#mapProjects_btn" ).css('background-color', '#14375A');//full blue
  });
});
