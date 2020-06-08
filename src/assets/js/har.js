
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



// IFTA PAGE 
$("#fuel-purchases-tab").click(function(){
    $("#fuelBtn").show();
    $("#fuel-purchases-div").show();
    $("#summary-div").hide();
    $("#summary-tab").removeClass("active");
    $("#trip-reports-tab").removeClass("active");
    $(this).addClass("active");
    $("#trip-reports-div").hide();
  });

  $("#summary-tab").click(function(){
    $("#fuelBtn").hide();
    $("#fuel-purchases-div").hide();
    $("#summary-div").show();
    $("#trip-reports-div").hide();
    $("#trip-reports-tab").removeClass("active");
    $("#fuel-purchases-tab").removeClass("active");
    $(this).addClass("active");
  });
  $("#trip-reports-tab").click(function(){
    $("#fuelBtn").hide();
    $("#fuel-purchases-div").hide();
    $("#summary-div").hide();
    $("#trip-reports-div").show();
    $("#summary-tab").removeClass("active");
    $("#fuel-purchases-tab").removeClass("active");
    $(this).addClass("active");
  });