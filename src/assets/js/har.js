
$("#arrowRmini").on('click',function()
        {
          $("#driverMiniList").hide("slide", { direction: "right"  }, 1000 );   
          $("#arrowRmini").hide(1000);
          $("#arrowLmini").show(1000); 
        }); 
        $("#arrowLmini").on('click',function()
        {
          $("#driverMiniList").show("slide", { direction: "right"  }, 1000 );   
          $("#arrowRmini").show(1000);
          $("#arrowLmini").hide(1000); 
        }); 
        $("#arrowRvehicle").on('click',function()
        {
          $("#vehicleMiniList").hide("slide", { direction: "right"  }, 1000 );   
          $("#arrowRvehicle").hide(1000);
          $("#arrowLvehicle").show(1000); 
        }); 
        $("#arrowLvehicle").on('click',function()
        {
          $("#vehicleMiniList").show("slide", { direction: "right"  }, 1000 );   
          $("#arrowRvehicle").show(1000);
          $("#arrowLvehicle").hide(1000); 
        }); 
  $("#vehicle-basic-btn").click(function(){
          $("#vehicle-lifecycle-div,#vehicle-specifications-div,#vehicle-engine-div,#vehicle-wheels-div,#vehicle-fluids-div,#vehicle-purchase-div,#vehicle-loan-div").hide();
          $("#vehicle-lifecycle-btn,#vehicle-specifications-btn,#vehicle-engine-btn,#vehicle-wheels-btn,#vehicle-fluids-btn,#vehicle-purchase-btn,#vehicle-loan-btn").removeClass("active");
       
         $("#vehicle-basic-div").show();
         $(this).addClass("active");
  }); 
  
$("#vehicle-lifecycle-btn").click(function(){
   $("#vehicle-basic-div,#vehicle-specifications-div,#vehicle-engine-div,#vehicle-wheels-div,#vehicle-fluids-div,#vehicle-purchase-div,#vehicle-loan-div").hide();
   $("#vehicle-basic-btn,#vehicle-specifications-btn,#vehicle-engine-btn,#vehicle-wheels-btn,#vehicle-fluids-btn,#vehicle-purchase-btn,#vehicle-loan-btn").removeClass("active");

  $("#vehicle-lifecycle-div").show();
  $(this).addClass("active");
});   
$("#vehicle-specifications-btn").click(function(){
  $("#vehicle-basic-div,#vehicle-lifecycle-div,#vehicle-engine-div,#vehicle-wheels-div,#vehicle-fluids-div,#vehicle-purchase-div,#vehicle-loan-div").hide();
  $("#vehicle-basic-btn,#vehicle-lifecycle-btn,#vehicle-engine-btn,#vehicle-wheels-btn,#vehicle-fluids-btn,#vehicle-purchase-btn,#vehicle-loan-btn").removeClass("active");

 $("#vehicle-specifications-div").show();
 $(this).addClass("active");
}); 

$("#vehicle-engine-btn").click(function(){
  $("#vehicle-basic-div,#vehicle-lifecycle-div,#vehicle-specifications-div,#vehicle-wheels-div,#vehicle-fluids-div,#vehicle-purchase-div,#vehicle-loan-div").hide();
  $("#vehicle-basic-btn,#vehicle-lifecycle-btn,#vehicle-specifications-btn,#vehicle-wheels-btn,#vehicle-fluids-btn,#vehicle-purchase-btn,#vehicle-loan-btn").removeClass("active");

 $("#vehicle-engine-div").show();
 $(this).addClass("active");
}); 
$("#vehicle-wheels-btn").click(function(){
  $("#vehicle-basic-div,#vehicle-lifecycle-div,#vehicle-specifications-div,#vehicle-engine-div,#vehicle-fluids-div,#vehicle-purchase-div,#vehicle-loan-div").hide();
  $("#vehicle-basic-btn,#vehicle-lifecycle-btn,#vehicle-specifications-btn,#vehicle-engine-btn,#vehicle-fluids-btn,#vehicle-purchase-btn,#vehicle-loan-btn").removeClass("active");

 $("#vehicle-wheels-div").show();
 $(this).addClass("active");
});
$("#vehicle-fluids-btn").click(function(){
  $("#vehicle-basic-div,#vehicle-lifecycle-div,#vehicle-specifications-div,#vehicle-engine-div,#vehicle-wheels-div,#vehicle-purchase-div,#vehicle-loan-div").hide();
  $("#vehicle-basic-btn,#vehicle-lifecycle-btn,#vehicle-specifications-btn,#vehicle-engine-btn,#vehicle-wheels-btn,#vehicle-purchase-btn,#vehicle-loan-btn").removeClass("active");

 $("#vehicle-fluids-div").show();
 $(this).addClass("active");
});
$("#vehicle-purchase-btn").click(function(){
  $("#vehicle-basic-div,#vehicle-lifecycle-div,#vehicle-specifications-div,#vehicle-engine-div,#vehicle-wheels-div,#vehicle-fluids-div,#vehicle-loan-div").hide();
  $("#vehicle-basic-btn,#vehicle-lifecycle-btn,#vehicle-specifications-btn,#vehicle-engine-btn,#vehicle-wheels-btn,#vehicle-fluids-btn,#vehicle-loan-btn").removeClass("active");

 $("#vehicle-purchase-div").show();
 $(this).addClass("active");
});
$("#vehicle-loan-btn").click(function(){
  $("#vehicle-basic-div,#vehicle-lifecycle-div,#vehicle-specifications-div,#vehicle-engine-div,#vehicle-wheels-div,#vehicle-purchase-div,#vehicle-fluids-div").hide();
  $("#vehicle-basic-btn,#vehicle-lifecycle-btn,#vehicle-specifications-btn,#vehicle-engine-btn,#vehicle-wheels-btn,#vehicle-purchase-btn,#vehicle-fluids-btn").removeClass("active");

 $("#vehicle-loan-div").show();
 $(this).addClass("active");
});


// VEHICLE ADD PHOTO BUTTON
$("#vehicle-details-photo-btn").click(function(){
  $("#vehicle-details-photo-input").click();
});
// VEHICLE DETAILS SIDETABS PAGE
  var vehicleDetailsDivs = ["main-vehicle-area","vehicle-settings-area","vehicle-devices-area","vehicle-documents-area","vehicle-assignment-history-area","vehicle-service-program-area","vehicle-recalls-area","vehicle-photo-area","vehicle-inspections-area","vehicle-reminders-area","vehicle-issues-area","vehicle-service-history-area","vehicle-fuel-history-area","vehicle-expense-history-area","vehicle-meter-history-area"];
  var vehicleDetailsSidetabs = ["vehicle-overview-sidetab","vehicle-devices-area","vehicle-settings-sidetab","vehicle-documents-sidetab","vehicle-meter-history-sidetab","vehicle-assignment-history-sidetab","vehicle-service-program-sidetab","vehicle-recalls-sidetab","vehicle-photo-sidetab","vehicle-meter-history-sidetab","vehicle-reminders-sidetab","vehicle-issues-sidetab","vehicle-service-history-sidetab","vehicle-fuel-history-sidetab","vehicle-expense-history-sidetab","vehicle-inspections-sidetab"];
  function vehicle_details_sidetab(subdiv,link_id){
 
    vehicleDetailsDivs.forEach(function(el){
          document.getElementById(el).style.display='none';
         });
         vehicleDetailsSidetabs.forEach(function(e){
          document.getElementById(e).classList.remove('active');
         });
      document.getElementById(subdiv).style.display='block';
      document.getElementById(link_id).classList.add('active');
 
 }

// VEHICLE Main uder FLEET ISSUES TABS
var vehicle_details_issues_btns = ["vehicle-open-issues-btn","vehicle-overdue-issues-btn","vehicle-resolved-issues-btn","vehicle-closed-issues-btn"];
var vehicle_details_issues_divs = ["vehicle-open-issues-area","vehicle-overdue-issues-area","vehicle-resolved-issues-area","vehicle-closed-issues-area"];

$("#vehicle-open-issues-btn").click(function(){
   $("#vehicle-open-issues-area").show();
   $(this).addClass("active");
   $("#vehicle-overdue-issues-area,#vehicle-resolved-issues-area,#vehicle-closed-issues-area").hide();
   $("#vehicle-overdue-issues-btn,#vehicle-resolved-issues-btn,#vehicle-closed-issues-btn").removeClass("active");

});
$("#vehicle-overdue-issues-btn").click(function(){
  $("#vehicle-overdue-issues-area").show();
  $(this).addClass("active");
  $("#vehicle-open-issues-area,#vehicle-resolved-issues-area,#vehicle-closed-issues-area").hide();
  $("#vehicle-open-issues-btn,#vehicle-resolved-issues-btn,#vehicle-closed-issues-btn").removeClass("active");
});
$("#vehicle-resolved-issues-btn").click(function(){
  $("#vehicle-resolved-issues-area").show();
  $(this).addClass("active");
  $("#vehicle-overdue-issues-area,#vehicle-open-issues-area,#vehicle-closed-issues-area").hide();
  $("#vehicle-overdue-issues-btn,#vehicle-open-issues-btn,#vehicle-closed-issues-btn").removeClass("active");
});
$("#vehicle-closed-issues-btn").click(function(){
  $("#vehicle-closed-issues-area").show();
  $(this).addClass("active");
  $("#vehicle-overdue-issues-area,#vehicle-resolved-issues-area,#vehicle-open-issues-area").hide();
  $("#vehicle-overdue-issues-btn,#vehicle-resolved-issues-btn,#vehicle-open-issues-btn").removeClass("active");
});


// EXPENSE AREA
$("#vehicle-expense-past-btn").click(function(){
   $("#vehicle-expense-past-area").show();
   $(this).addClass("active");
   $("#vehicle-expense-future-area").hide();
   $("#vehicle-expense-future-btn").removeClass("active");

});
$("#vehicle-expense-future-btn").click(function(){
  $("#vehicle-expense-future-area").show();
  $(this).addClass("active");
  $("#vehicle-expense-past-area").hide();
  $("#vehicle-expense-past-btn").removeClass("active");
});


// Vehicle Details  Recalls
var vehicle_details_recalls_divs = ["vehicle-recalls-all-area","vehicle-recalls-acknowledged-area","vehicle-recalls-needsAction-area","vehicle-recalls-openIssue-area","vehicle-recalls-resolvedIssue-area"];
var vehicle_details_recalls_btns = ["vehicle-recalls-all-btn","vehicle-recalls-acknowledged-btn","vehicle-recalls-needsAction-btn","vehicle-recalls-openIssue-btn","vehicle-recalls-resolvedIssue-btn"];
function vehicle_details_recalls_show(subdiv,link_id){
 
  vehicle_details_recalls_divs.forEach(function(el){
        document.getElementById(el).style.display='none';
       });
       vehicle_details_recalls_btns.forEach(function(e){
        document.getElementById(e).classList.remove('active');
       });
    document.getElementById(subdiv).style.display='block';
    document.getElementById(link_id).classList.add('active');
}






// SERVICE PROGRAM PRIMARY METER
function primary_meter_reading()
{
  if(document.getElementById("primary-meter-miles").checked){
    document.getElementById("primary_meter").innerHTML = "miles";
  }
  if(document.getElementById("primary-meter-kms").checked){
    document.getElementById("primary_meter").innerHTML = "kilometers";
  }
  
}

// UNIT TYPE IN FUEL ENTRY
function fuel_unit()
{
   if(document.getElementById("fuel_unit_reefer").checked){
      document.getElementById("fuelReeferQty").style.display = "block";  
      document.getElementById("fuelReefer").style.display = "block"; 
      
      document.getElementById("fuelVehicleQty").style.display = "none"; 
      document.getElementById("fuelVehicle").style.display = "none"; 

   }
   if(document.getElementById("fuel_unit_vehicle").checked){
      document.getElementById("fuelVehicleQty").style.display = "block"; 
      document.getElementById("fuelVehicle").style.display = "block";  
      document.getElementById("fuelReeferQty").style.display = "none";  
      document.getElementById("fuelReefer").style.display = "none";     
   }
}

//ADDING ATTACH PHOTO LINES
var newPhotoLine = '<div class="col-lg-10"><label class="control-label font-weight-bold font-bold text-lg-right pt-2">Attach</label><input type="file" class="form-control p-0" id="inputDefault"></div><div class="col-lg-2  mar-top-37"><button type="button" class="btn btn-sm btn-success"><i class="fas fa-times"></i></button></div>';

function attachMorePhoto(){
  document.getElementById("attachPhotoLine").append(newPhotoLine);
 
}

// Past Future Expenses Tabs
var expensesTables = ["pastExpensesTable","futureExpensesTable"];
var expensesBtns = ["pastExpensesBtn","futureExpensesBtn"];
function expensesTablesShow(subdiv,link_id){
 
  expensesTables.forEach(function(el){
        document.getElementById(el).style.display='none';
       });
       expensesBtns.forEach(function(e){
        document.getElementById(e).classList.remove('active');
       });
    document.getElementById(subdiv).style.display='block';
    document.getElementById(link_id).classList.add('active');
}
//Active Archived Service Tasks Tabs
var serviceTaskTables = ["activeServiceTaskTable","archivedServiceTaskTable"];
var serviceTaskBtns = ["activeServiceTaskBtn","archivedServiceTaskBtn"];
function serviceTaskTablesShow(subdiv,link_id){
 
  serviceTaskTables.forEach(function(el){
        document.getElementById(el).style.display='none';
       });
    
       serviceTaskBtns.forEach(function(e){
        document.getElementById(e).classList.remove('active');
       });
    
    document.getElementById(subdiv).style.display='block';
    document.getElementById(link_id).classList.add('active');
}

// OTHER EXPENSES PAGE
function recurringExpenses(){
  if(document.getElementById('recurringChk').checked){
    document.getElementById('recurringDiv').style.display = "block";
    document.getElementById('notRecurringDiv').style.display = "none";

  }
  else{
    document.getElementById('recurringDiv').style.display = "none";
    document.getElementById('notRecurringDiv').style.display = "block";
  }
}


//Maintenance Truck Radio buttons
function maintenanceTruckRadioFn(){
  if(document.getElementById('maintenanceTruckTime').checked){
    document.getElementById('maintenanceTruckTimeDiv').style.display = "block";
    document.getElementById('maintenanceTruckMilesDiv').style.display = "none";
  }
 if(document.getElementById('maintenanceTruckMiles').checked){
    document.getElementById('maintenanceTruckMilesDiv').style.display = "block";
    document.getElementById('maintenanceTruckTimeDiv').style.display = "none";
  }
  if(document.getElementById('maintenanceTruckBoth').checked){
    document.getElementById('maintenanceTruckMilesDiv').style.display = "block";
    document.getElementById('maintenanceTruckTimeDiv').style.display = "block";
  }
}

// Next Due Maintenance
function nextDueMaintenance(){
  if(document.getElementById('maintenanceToday').checked){
    document.getElementById('maintenanceTodayDiv').style.display = "block";
    document.getElementById('maintenanceLastDiv').style.display = "none";

  }
  if(document.getElementById('maintenanceLast').checked){
    document.getElementById('maintenanceLastDiv').style.display = "block";
    document.getElementById('maintenanceTodayDiv').style.display = "none";

  }
}

// INVENTORY TRACK
function inventoryTrack()
{
  if(document.getElementById('inventoryTrackBtn').checked){
    document.getElementById('inventoryTrackDiv').style.display = "block";
  }
  else{
    document.getElementById('inventoryTrackDiv').style.display = "none";

  }

}


// SENSOR TYPE ADD SENSOR PAGE DROP DOWN SCRIPT
function sensorType(){
  if(document.getElementById("sensor_type").value == "Cargo"){
    document.getElementById("sensor_cargo_div").style.display = "block";
    document.getElementById("sensor_temp_div").style.display = "none";
    document.getElementById("sensor_door_div").style.display = "none";
    document.getElementById("sensor_tpms_div").style.display = "none";

  }
  if(document.getElementById("sensor_type").value == "Temperature")
  {
    document.getElementById("sensor_temp_div").style.display = "block";
    document.getElementById("sensor_cargo_div").style.display = "none";
     document.getElementById("sensor_door_div").style.display = "none";
    document.getElementById("sensor_tpms_div").style.display = "none";

  }
  if(document.getElementById("sensor_type").value == "Door")
  {
    document.getElementById("sensor_cargo_div").style.display = "none";
    document.getElementById("sensor_temp_div").style.display = "none";
    document.getElementById("sensor_door_div").style.display = "block";
    document.getElementById("sensor_tpms_div").style.display = "none";

  }
  if(document.getElementById("sensor_type").value == "TPMS")
  {
    document.getElementById("sensor_cargo_div").style.display = "none";
    document.getElementById("sensor_temp_div").style.display = "none";
    document.getElementById("sensor_door_div").style.display = "none";
    document.getElementById("sensor_tpms_div").style.display = "block";

  }
}


// HOS driver Details
$("#driver_details_box").click(function(){
  $("#driver_details_table").show();
  $("#driver_violations_table,#driver_near_violations_table,#driver_uncertified_table").hide();
  $(this).removeClass("hos_top_box").addClass("hos_box_active");
  $("#driver_violations_box,#driver_near_violations_box,#driver_uncertified_box").removeClass("hos_box_active").addClass("hos_top_box");
});
$("#driver_violations_box").click(function(){
  $("#driver_violations_table").show();
  $("#driver_details_table,#driver_near_violations_table,#driver_uncertified_table").hide();
  $(this).removeClass("hos_top_box").addClass("hos_box_active");
  $("#driver_details_box,#driver_near_violations_box,#driver_uncertified_box").removeClass("hos_box_active").addClass("hos_top_box");

});
$("#driver_near_violations_box").click(function(){
  $("#driver_near_violations_table").show();
  $("#driver_violations_table,#driver_details_table,#driver_uncertified_table").hide();
  $(this).removeClass("hos_top_box").addClass("hos_box_active");
  $("#driver_details_box,#driver_violations_box,#driver_uncertified_box").removeClass("hos_box_active").addClass("hos_top_box");

});
$("#driver_uncertified_box").click(function(){
  $("#driver_uncertified_table").show();
  $("#driver_violations_table,#driver_details_table,#driver_near_violations_table").hide();
  $(this).removeClass("hos_top_box").addClass("hos_box_active");
  $("#driver_details_box,#driver_near_violations_box,#driver_violations_box").removeClass("hos_box_active").addClass("hos_top_box");

});

function show_truck_seal_input()
{
    document.getElementById("truck_seal_input").style.display = "block";         
}
function show_truck_IIT_input()
{
    document.getElementById("truck_IIT_input").style.display = "block";         
}
function show_trailer_seal_input()
{
    document.getElementById("trailer_seal_input").style.display = "block";         
}
function show_trailer_IIT_input()
{
    document.getElementById("trailer_IIT_input").style.display = "block";         
}
function show_team_driver_input()
{
    document.getElementById("team_driver_input").style.display = "block";         
}
function show_passenger_input()
{
    document.getElementById("passenger_input").style.display = "block";         
} 

// HOS Violations Reports
var hosViolationsDivs = ["driver_hos_reports_div","group_hos_reports_div"];
var hosViolationsBtns = ["driver_hos_reports_btn","group_hos_reports_btn"];
function showHOSReports(subdiv,link_id){
 
  hosViolationsDivs.forEach(function(el){
        document.getElementById(el).style.display='none';
       });
    
       hosViolationsBtns.forEach(function(e){
        document.getElementById(e).classList.remove('btn-success');
       });
     
    
    document.getElementById(subdiv).style.display='block';
    document.getElementById(link_id).classList.add('btn-success');
}


// IFTA TRIP REPORTS

var iftaTripDivs = ["ifta-report-distance-vehicle-div","ifta-report-distance-fleet-div"];
var iftaTripBtns = ["ifta-report-distance-vehicle-btn","ifta-report-distance-fleet-btn"];
function showiftaDistanceReports(subdiv,link_id){
 
  iftaTripDivs.forEach(function(el){
        document.getElementById(el).style.display='none';
       });
    
       iftaTripBtns.forEach(function(e){
        document.getElementById(e).classList.remove('btn-success');
       });
     
    
    document.getElementById(subdiv).style.display='block';
    document.getElementById(link_id).classList.add('btn-success');
}

// TRIP RECORDED REPORTS

var recordedTripDivs = ["ifta-report-distance-vehicle-div","ifta-report-distance-driver-div","ifta-report-distance-fleet-div"];
var recordedTripBtns = ["ifta-report-distance-vehicle-btn","ifta-report-distance-driver-btn","ifta-report-distance-fleet-btn"];
function tripsRecordedReports(subdiv,link_id){
 
  recordedTripDivs.forEach(function(el){
        document.getElementById(el).style.display='none';
       });
    
       recordedTripBtns.forEach(function(e){
        document.getElementById(e).classList.remove('btn-success');
       });
     
    
    document.getElementById(subdiv).style.display='block';
    document.getElementById(link_id).classList.add('btn-success');
}

//DEVICE ATTACHED FUNCTION
function deviceAttachedFn()
{
  if(document.getElementById('attachedToVehicle').checked){
    document.getElementById('attachedVehicleDiv').style.display = "block";
    document.getElementById('attachedAssetDiv').style.display = "none";

  }
  if(document.getElementById('attachedToAsset').checked){
    document.getElementById('attachedAssetDiv').style.display = "block";
    document.getElementById('attachedVehicleDiv').style.display = "none";

  }
}
//  Manual Address checkbox
function manualAddressFn()
{
   if(document.getElementById('manualAddress').checked == false){
      var x = document.getElementsByClassName("manualAddressInput");
      var i;
      for(i=0; i<x.length; i++){
         x[i].disabled = true;
      }
   }
  else if(document.getElementById('manualAddress').checked == true){
      var x = document.getElementsByClassName("manualAddressInput");
      var i;
      for(i=0; i<x.length; i++){
         x[i].disabled = false;
      }
   }
}
   // UNIT TYPE IN FUEL ENTRY
   function fuel_unit()
   {
      if(document.getElementById("fuel_unit_reefer").checked){
         document.getElementById("fuelReeferQty").style.display = "block";  
         document.getElementById("fuelReefer").style.display = "block"; 
         
         document.getElementById("fuelVehicleQty").style.display = "none"; 
         document.getElementById("fuelVehicle").style.display = "none"; 
   
      }
      if(document.getElementById("fuel_unit_vehicle").checked){
         document.getElementById("fuelVehicleQty").style.display = "block"; 
         document.getElementById("fuelVehicle").style.display = "block";  
         document.getElementById("fuelReeferQty").style.display = "none";  
         document.getElementById("fuelReefer").style.display = "none";     
      }
   }
//ADDRESS BOOK SCRIPT
function openfeedback(){
  document.getElementById('feedbackBox').style.display = "block";
    document.getElementById("mainboxchat").style.display = "none";
  
}
function closefeedback(){
  document.getElementById('feedbackBox').style.display = "none";
}
// TABLE WITHOUT  SEARCH AND NUMBER OF RECORDS ONLY PAGINATION
$('.simple-table').dataTable({dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p',searching: false, paging: true, info: false});
$('.search-table').dataTable({dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p',searching: true, paging: true, info: false});

$('#simple-table').dataTable({dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p',searching: false, paging: true, info: false});
$('#simple-table1').dataTable({dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p',searching: false, paging: true, info: false});
$('#simple-table2').dataTable({dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p',searching: false, paging: true, info: false});
$('#simple-table3').dataTable({dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p',searching: false, paging: true, info: false});
$('#simple-table4').dataTable({dom: '<"row"<"col-lg-6"l><"col-lg-6"f>><"table-responsive"t>p',searching: false, paging: true, info: false});

$('.assetDetailsTable').DataTable( {
  "scrollY":        "310px",
  "scrollCollapse": true,
  "paging":         false,
  "info": false,
  "searching":false
} );

