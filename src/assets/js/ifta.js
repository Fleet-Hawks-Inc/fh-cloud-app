$("#fuel-purchases-tab").click(function(){
    $("#fuelBtn").show();
    $("#fuel-purchases-div").show();
    $("#summary-div").hide();
    $("#summary-tab").removeClass("active");
    $("#fuel-purchases-tab").removeClass("active");
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