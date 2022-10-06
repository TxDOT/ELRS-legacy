var projects = [];
var queryConditions;
//var p_returned_RTE_DEFN_LN_NM = '';

function addOrAssembleQueryStr(method) {
  console.log("addOrAssembleQueryStr");
  var color = "#ff8000";
  var width = 4;
  var desc = '';

  if (rtenm.length<1) {
      alert("Please add a Route.");
      return;
  }

  var projStr = ("RIA_RTE_ID=" +
    rtenm + "|" + bdfo + "|" + edfo + "|" + color + "|" + width + "|" + desc);

  var currentValueCheck = projects.indexOf(projStr);
  console.log("Check location of current project in project list. currentValueCheck: " +
    (currentValueCheck) +
    ". " +
    "Value -1 means project is not in project list. " +
    "Value 0 means project is at top of project list. " +
    "Value 1+ means project is further down list.")

  if (currentValueCheck < 0){
    console.log("Project is not in project list.");
    var queryTask = new esri.tasks.QueryTask("https://services.arcgis.com/KTcxiTD9dsQw4r7Z/arcgis/rest/services/TxDOT_Roadways/FeatureServer/0");
    var query = new esri.tasks.Query();
    query.returnGeometry = false;
    query.outFields = ["*"];
    query.where = "RTE_NM='" + rtenm + "'" ;

    queryTask.executeForCount(query,function(count){
      if (count>0) {
        projects.push(projStr);
        listQueries();
        if (method ==  1){foo(projects);}
      } else {
        alert("Route Name not found, please try again.");
      }
    });
  } else
  if (currentValueCheck >= 0) {
    console.log("Project is further down list.");
    if (method == 1){foo(projects);}
  }
}

function foo(projects) {
  queryConditions = "";
  for (var i = 0; i < projects.length; i++) {
    queryConditions += "&";
    queryConditions += projects[i];
}

  queryVarStr = getRightCharacters(queryConditions, queryConditions.length-1);
  console.log(queryVarStr);
  projects = [];
}

function getRightCharacters(theData,theNumber) {
    return theData.substring(theData.length-theNumber, theData.length);
}

function removeLastProject() {
    projects.pop();
    listQueries();
}

function listQueries() {
    var theOutput = "";
    for (var i = 0; i < projects.length; i++) {
            theOutput += "<br>" + projects[i];
    }
}
