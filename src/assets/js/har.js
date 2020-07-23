
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

// Add Driver
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
   else if(document.getElementById("driver_female").checked){
      document.getElementById("female_photo").style.display = "block"; 
      document.getElementById("male_photo").style.display = "none";       
   }
}
// DRIVER PAYMENT 
function changePaymentMode(){
    var payType = document.getElementById("paymentType");
     if(payType.value == "Pay Per Mile")
     {
        document.getElementById("payPerMile").style.display = "block";
        document.getElementById("payPercentage").style.display = "none";
        document.getElementById("payPerHour").style.display = "none";
    
     }
     else if(payType.value == "Percentage")
     {
        document.getElementById("payPercentage").style.display = "block";
        document.getElementById("payPerMile").style.display = "none";
        document.getElementById("payPerHour").style.display = "none";
    
     }
     else if(payType.value == "Pay Per Hour")
     {
        document.getElementById("payPercentage").style.display = "none";
        document.getElementById("payPerMile").style.display = "none";
        document.getElementById("payPerHour").style.display = "block";
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