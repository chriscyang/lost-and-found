$(document).ready(function() {

    // -------------------------------------------------------------------------
    // PAGE TRANSITIONS
    // -------------------------------------------------------------------------

    $(".tab-map").click(function() {
        $(".tabs").removeClass("active");
        $("li.tabs.tab-map").addClass("active");
        $(".body").hide();
        $("#map").show();
    });

    $(".tab-groups").click(function() {
        $(".tabs").removeClass("active");
        $("li.tabs.tab-groups").addClass("active");
        $(".body").hide();
        $("#groups").show();
    });

    $(".tab-profile").click(function() {
        $(".tabs").removeClass("active");
        $("li.tabs.tab-profile").addClass("active");
        $(".body").hide();
        $("#profile").show();
    });

    // -------------------------------------------------------------------------
    // GROUPS
    // -------------------------------------------------------------------------

    $("[data-toggle='collapse'").click(function() {
        $(".collapse").collapse("hide");
    });

    // -------------------------------------------------------------------------
    // USER PROFILE
    // -------------------------------------------------------------------------

    $("#new-location").focus(function() {
        return false;
    });

    $("#new-location").popover({
        placement : "top",
    });

    $("#add-location").click(function() {
        if ($("#new-location").val()) {
            $("#locations").append("<h3>" + $("#new-location").val() + "</h3>");
        } else {
            $("#new-location").popover("show");
            setTimeout(function() {
                $("#new-location").popover("hide");
            }, 1000);
        }
        $("#new-location").val("");
    });

    // -------------------------------------------------------------------------
    // DIAL FRIEND
    // -------------------------------------------------------------------------

    $("#dial").click(function() {
        $(this).hide();
    });
});

// -----------------------------------------------------------------------------
// FRIEND
// -----------------------------------------------------------------------------

function dialFriend() {
    $("#dial").show();
}

function showFriend(name) {
    $(".tabs").removeClass("active");
    $(this).addClass("active");
    $(".body").hide();
    $("#friend").show();
    $("#friend-name").html(name);
    $("#friend-picture").initial({
        name     : name,
        width    : 200,
        height   : 200,
        fontSize : 80,
    });
}
