$("#fuel-purchases-reports-tab").click(function(){
    
    $("#fuel-purchases-reports-div").show();
    $("#distance-summary-div").hide();
    $("#distance-summary-tab").removeClass("active");
    $("#trip-reports-tab").removeClass("active");;
    $(this).addClass("active");
    $("#trip-reports-div").hide();
  });

  $("#distance-summary-tab").click(function(){
   
    $("#fuel-purchases-reports-div").hide();
    $("#distance-summary-div").show();
    $("#trip-reports-div").hide();
    $("#trip-reports-tab").removeClass("active");
    $("#fuel-purchases-reports-tab").removeClass("active");
    $(this).addClass("active");
  });
  $("#trip-reports-tab").click(function(){
   
    $("#fuel-purchases-reports-div").hide();
    $("#distance-summary-div").hide();
    $("#trip-reports-div").show();
    $("#distance-summary-tab").removeClass("active");
    $("#fuel-purchases-reports-tab").removeClass("active");
    $(this).addClass("active");
  });


  $(".distance-summary-vehicle-btn").click(function(){

      $("#distance-summary-vehicle-div").show();
      $("#distance-summary-fleet-div").hide();
      // $(this).removeClass("btn-default").addClass("btn-success");
      // $(".distance-summary-fleet-btn").removeClass("btn-success").addClass("btn-default");
  });

  $(".distance-summary-fleet-btn").click(function(){
    $("#distance-summary-vehicle-div").hide();
    $("#distance-summary-fleet-div").show(); 
    // $(this).removeClass("btn-default").addClass("btn-success");
    // $(".distance-summary-vehicle-btn").removeClass("btn-success").addClass("btn-default");
   
  });

   $(".trip-reports-vehicle-btn").click(function(){
      $("#trip-reports-vehicle-div").show();
      $("#trip-reports-group-div").hide();
      // $(this).removeClass("btn-default").addClass("btn-success");
      // $("#trip-reports-group-btn").removeClass("btn-success").addClass("btn-default");
   });
   $(".trip-reports-group-btn").click(function(){
    $("#trip-reports-vehicle-div").hide();
    $("#trip-reports-group-div").show();
    // $(this).removeClass("btn-default").addClass("btn-success");
    // $("#trip-reports-vehicle-btn").removeClass("btn-success").addClass("btn-default");
 });

  $(".fuel-purchases-reports-vehicle-btn").click(function(){
    $("#fuel-purchases-reports-vehicle-div").show();
    $("#fuel-purchases-reports-driver-div,#fuel-purchases-reports-group-div").hide();
    

  });
  $(".fuel-purchases-reports-driver-btn").click(function(){
    $("#fuel-purchases-reports-vehicle-div").hide();
    $("#fuel-purchases-reports-driver-div").show();
    $("#fuel-purchases-reports-group-div").hide();

  });
  $(".fuel-purchases-reports-group-btn").click(function(){
    $("#fuel-purchases-reports-vehicle-div").hide();
    $("#fuel-purchases-reports-driver-div").hide();
    $("#fuel-purchases-reports-group-div").show();

  });