$("#liveViewBtn1").click(function(){
   $("#liveView1").toggle();
   $("#hawk-btn").toggle();
   
});

$("#liveViewBtn2").click(function(){
    $("#liveView2").toggle();
    $("#hawk-btn").toggle();
 });

 $("#liveViewBtn3").click(function(){
    $("#liveView3").toggle();
    $("#hawk-btn").toggle();
 });
 $("#liveViewBtn4").click(function(){
   $("#liveView4").toggle();
   $("#hawk-btn").toggle();
});


$("#hawk-btn").click(function(){
   // $("#dcam").show("slide", {direction: "down"});  
 });
$("#cam-close-btn").click(function(){
   // $("#dcam").hide("slide", {direction: "down"});
 });
 $(".temp_graph").click(function(){
   $("#with_temp_graph").toggle();
   $("#without_temp_graph").toggle();
 });

$("#driver_basic_btn").click(function()
{
   $("#driver_basic_div").show();
   $("#driver_address_div,#driver_payment_div,#driver_emergency_div,#driver_additional_div,#driver_compliance_div").hide();
   $("#driver_basic_btn").addClass("acitve");
   $("#driver_address_btn,#driver_payment_btn,#driver_emergency_btn,#driver_additional_btn,#driver_compliance_btn").removeClass("active");

});
$("#driver_address_btn").click(function()
{
   $("#driver_address_div").show();
   $("#driver_basic_div,#driver_payment_div,#driver_emergency_div,#driver_additional_div,#driver_compliance_div").hide();
   $("#driver_address_btn").addClass("active");
   $("#driver_basic_btn,#driver_payment_btn,#driver_emergency_btn,#driver_additional_btn,#driver_compliance_btn").removeClass("active");
});
$("#driver_payment_btn").click(function()
{
   $("#driver_payment_div").show();
   $("#driver_address_div,#driver_basic_div,#driver_emergency_div,#driver_additional_div,#driver_compliance_div").hide();
   $("#driver_payment_btn").addClass("active");
   $("#driver_basic_btn,#driver_address_btn,#driver_emergency_btn,#driver_additional_btn,#driver_compliance_btn").removeClass("active");
});
$("#driver_compliance_btn").click(function()
{
   $("#driver_compliance_div").show();
   $("#driver_address_div,#driver_basic_div,#driver_emergency_div,#driver_additional_div,#driver_payment_div").hide();
   $("#driver_compliance_btn").addClass("active");
   $("#driver_basic_btn,#driver_address_btn,#driver_emergency_btn,#driver_additional_btn,#driver_payment_btn").removeClass("active");
});
$("#driver_emergency_btn").click(function()
{
   $("#driver_emergency_div").show();
   $("#driver_address_div,#driver_payment_div,#driver_basic_div,#driver_additional_div,#driver_compliance_div").hide();
   $("#driver_emergency_btn").addClass("active");
   $("#driver_basic_btn,#driver_payment_btn,#driver_address_btn,#driver_additional_btn,#driver_compliance_btn").removeClass("active");
});
$("#driver_additional_btn").click(function()
{
   $("#driver_additional_div").show();
   $("#driver_address_div,#driver_payment_div,#driver_emergency_div,#driver_basic_div,#driver_compliance_div").hide();
   $("#driver_additional_btn").addClass("active");
   $("#driver_basic_btn,#driver_payment_btn,#driver_address_btn,#driver_emergency_btn,#driver_compliance_btn").removeClass("active");
});

// DRIVER ADD PHOTO
$("#driverPhotoBtn").click(function(){
   $("#driverPhotoInHidden").click();
});

$("#PhotoBtn").click(function(){
   $("#PhotoInHidden").click();
});

// Vehicle Tabs
var vehicleList = ["vehicle_new_details","vehicle_new_lifecycle","vehicle_new_specifications","vehicle_new_fluids","vehicle_new_wheels","vehicle_new_engine","vehicle_new_settings"];
var vehId = ['veh_details','veh_lifecycle','veh_specifications','veh_fluids','veh_wheels','veh_engine','veh_settings'];
function displayDetails(subdiv,link_id){
 
   vehicleList.forEach(function(el){
         document.getElementById(el).style.display='none';
        });
        vehId.forEach(function(e){
         document.getElementById(e).classList.remove('active');
        });
     document.getElementById(subdiv).style.display='block';
     document.getElementById(link_id).classList.add('active');

}

$("#veh_details_btn").click(function(){
   $("#veh_details_div").show();
   $(this).addClass("active");
   $("#veh_lifecycle_div,#veh_specifications_div,#veh_fluids_div,#veh_wheels_div,#veh_settings_div").hide();
   $("#veh_lifecycle_btn,#veh_specifications_btn,#veh_fluids_btn,#veh_wheels_btn,#veh_settings_btn").removeClass("active");
});
$("#veh_lifecycle_btn").click(function(){
  $("#veh_lifecycle_div").show();
  $(this).addClass("active");
  $("#veh_details_div,#veh_specifications_div,#veh_fluids_div,#veh_wheels_div,#veh_settings_div").hide();
  $("#veh_details_btn,#veh_specifications_btn,#veh_fluids_btn,#veh_wheels_btn,#veh_settings_btn").removeClass("active");

});
$("#veh_specifications_btn").click(function(){
   $("#veh_specifications_div").show();
   $(this).addClass("active");
   $("#veh_lifecycle_div,#veh_details_div,#veh_fluids_div,#veh_wheels_div,#veh_settings_div").hide();
   $("#veh_lifecycle_btn,#veh_details_btn,#veh_fluids_btn,#veh_wheels_btn,#veh_settings_btn").removeClass("active");

 });
 $("#veh_fluids_btn").click(function(){
   $("#veh_fluids_div").show();
   $(this).addClass("active");
   $("#veh_lifecycle_div,#veh_specifications_div,#veh_details_div,#veh_wheels_div,#veh_settings_div").hide();
   $("#veh_lifecycle_btn,#veh_specifications_btn#veh_details_btn,#veh_wheels_btn,#veh_settings_btn").removeClass("active");

 });
 $("#veh_wheels_btn").click(function(){
   $("#veh_wheels_div").show();
   $(this).addClass("active");
   $("#veh_lifecycle_div,#veh_specifications_div,#veh_fluids_div,#veh_details_div,#veh_settings_div").hide();
   $("#veh_lifecycle_btn,#veh_specifications_btn,#veh_fluids_btn,#veh_details_btn,#veh_settings_btn").removeClass("active");
 });
 $("#veh_settings_btn").click(function(){
   $("#veh_settings_div").show();
   $(this).addClass("active");
   $("#veh_lifecycle_div,#veh_specifications_div,#veh_fluids_div,#veh_wheels_div,#veh_details_div").hide();
   $("#veh_lifecycle_btn,#veh_specifications_btn,#veh_fluids_btn,#veh_wheels_btn,#veh_details_btn").removeClass("active");
 });


//  USER PAGE
$("#user_basic_btn").click(function()
{
   $("#user_basic_div").show();
   $("#user_address_div,#user_account_div,#user_other_div").hide();
   $("#user_basic_btn").addClass("active");
   $("#user_address_btn,#user_account_btn,#user_other_btn").removeClass("active");
});
$("#user_address_btn").click(function()
{
   $("#user_address_div").show();
   $("#user_basic_div,#user_account_div,#user_other_div").hide();
   $("#user_address_btn").addClass("active");
   $("#user_basic_btn,#user_account_btn,#user_other_btn").removeClass("active");
});
$("#user_account_btn").click(function()
{
   $("#user_account_div").show();
   $("#user_basic_div,#user_address_div,#user_other_div").hide();
   $(this).addClass("active");
   $("#user_address_btn,#user_basic_btn,#user_other_btn").removeClass("active");
});
$("#user_other_btn").click(function()
{
   $("#user_other_div").show();
   $("#user_basic_div,#user_account_div,#user_address_div").hide();
   $(this).addClass("active");
   $("#user_address_btn,#user_account_btn,#user_basic_btn").removeClass("active");
});


// DRIVER PAYMENT 
function changePaymentMode(){
var paymentType = document.getElementById("paymentType");
 if(paymentType.value == "Pay Per Mile")
 {
    document.getElementById("payPerMile").style.display = "block";
    document.getElementById("payPercentage").style.display = "none";
    document.getElementById("payPerHour").style.display = "none";

 }
 if(paymentType.value == "Percentage")
 {
    document.getElementById("payPercentage").style.display = "block";
    document.getElementById("payPerMile").style.display = "none";
    document.getElementById("payPerHour").style.display = "none";

 }
 if(paymentType.value == "Pay Per Hour")
 {
    document.getElementById("payPercentage").style.display = "none";
    document.getElementById("payPerMile").style.display = "none";
    document.getElementById("payPerHour").style.display = "block";
 }
 if(paymentType.value == "Manual Pay")
 {
    document.getElementById("payPercentage").style.display = "none";
    document.getElementById("payPerMile").style.display = "none";
    document.getElementById("payPerHour").style.display = "none";
 }
}


// ISSUE LIST TABLE
$("#openIssueBtn").click(function(){
   $("#closedIssueTable,#resolvedIssueTable,#overdueIssueTable").hide();
   $("#openIssueTable").show();
   $(this).addClass("active");
   $("#resolvedIssueBtn,#overdueIssueBtn,#closedIssueBtn").removeClass("active");
});
$("#resolvedIssueBtn").click(function(){
   $("#resolvedIssueTable").show();
   $("#openIssueTable,#closedIssueTable,#overdueIssueTable").hide();
   $(this).addClass("active");
   $("#openIssueBtn,#overdueIssueBtn,#closedIssueBtn").removeClass("active");
});
$("#closedIssueBtn").click(function(){
   $("#closedIssueTable").show();
   $("#openIssueTable,#resolvedIssueTable,#overdueIssueTable").hide();
   $(this).addClass("active");
   $("#resolvedIssueBtn,#overdueIssueBtn,#openIssueBtn").removeClass("active");
});
$("#overdueIssueBtn").click(function(){
   $("#overdueIssueTable").show();
   $("#closedIssueTable,#resolvedIssueTable,#openIssueTable").hide();
   $(this).addClass("active");
   $("#resolvedIssueBtn,#closedIssueBtn,#openIssueBtn").removeClass("active");
});


//ADD DRIVER
function driver_type()
{
   if(document.getElementById("driver_contractor").checked){
      document.getElementById("companyDiv").style.display = "block";  
      document.getElementById("employeeIDDiv").style.display = "none";     
   }
   if(document.getElementById("driver_employee").checked){
      document.getElementById("employeeIDDiv").style.display = "block"; 
      document.getElementById("companyDiv").style.display = "none";       
   }
}
function driver_gender()
{
   if(document.getElementById("driver_male").checked){
      document.getElementById("male_photo").style.display = "block";  
      document.getElementById("female_photo").style.display = "none";     
   }
   if(document.getElementById("driver_female").checked){
      document.getElementById("female_photo").style.display = "block"; 
      document.getElementById("male_photo").style.display = "none";       
   }
}


// DRIVERS PAGE

$("#map_view_btn").click(function(){
   $("#map_view").show();
   $("#list_view").hide();
   $(this).removeClass("btn-default").addClass("btn-success");
   $("#list_view_btn").removeClass("btn-success").addClass("btn-default");
});
$("#list_view_btn").click(function(){
   $("#list_view").show();
   $("#map_view").hide();
   $(this).removeClass("btn-default").addClass("btn-success");
   $("#map_view_btn").removeClass("btn-success").addClass("btn-default");
});


// CHAT SCRIPT

function openChat() {
   document.getElementById('feedbackBox').style.display = "none";
   var x= document.getElementById("mainboxchat");
  if(x.style.display === "block"){
        x.style.display = "none";
  }
  else{
   x.style.display = "block";
  }
  document.getElementById('feedbackBox').style.display = "none";

}

function closeChat() {
  document.getElementById("mainboxchat").style.display = "none";
}


function openbroadcastmsg() {
  document.getElementById("broadcastMsgchatbox").style.display = "block";
}


function closebroadcastmsg() {
    document.getElementById("broadcastMsgchatbox").style.display = "none";
  }


  function openchatboxalldrivers() {
  document.getElementById("alldriverschatbox").style.display = "block";
}


function closechatboxalldrivers() {
    document.getElementById("alldriverschatbox").style.display = "none";
  }

  function opendriverchatbox1() {
  document.getElementById("driverchatbox1").style.display = "block";
}


function closedriverchatbox1() {
    document.getElementById("driverchatbox1").style.display = "none";
  }

  function opendriverchatbox2() {
  document.getElementById("driverchatbox2").style.display = "block";
}
function closedriverchatbox2() {
    document.getElementById("driverchatbox2").style.display = "none";
  }
  function opendriverchatbox3() {
   document.getElementById("driverchatbox3").style.display = "block";
 }
 function closedriverchatbox3() {
     document.getElementById("driverchatbox3").style.display = "none";
   }

