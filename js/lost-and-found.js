        function generateRandomNumber(min, max) {
            var rand_number = Math.random() * (max - min) + min;

            return rand_number;

        };
        //Within UBC
        var from_UBC_LAT = 49.279508,
        to_UBC_LAT = 49.250336,
        from_UBC_LNG = -123.260821,
        to_UBC_LNG = -123.233212;

        //Within DownTown Van
        var to_down_LAT = 49.272071,
        from_down_LAT = 49.290619,
        from_down_LNG = -123.143484,
        to_down_LNG = -123.094494;

        var LAND_LAT = generateRandomNumber(from_UBC_LAT,to_UBC_LAT);
        var LAND_LNG = generateRandomNumber(from_UBC_LNG, to_UBC_LNG);

        function initialize() {

                        //Set pointer location
                        var land_location = {lat: LAND_LAT, lng: LAND_LNG};
                        var friend_location = {lat: generateRandomNumber(from_UBC_LAT,to_UBC_LAT),
                            lng: generateRandomNumber(from_UBC_LNG,to_UBC_LNG)};
                            var other_friend_location = {lat: generateRandomNumber(from_UBC_LAT,to_UBC_LAT),
                               lng: generateRandomNumber(from_UBC_LNG,to_UBC_LNG)};

                               var down_friend_location = {lat: generateRandomNumber(from_down_LAT,to_down_LAT),
                                lng: generateRandomNumber(from_down_LNG,to_down_LNG)};


                                var mapProp = {
                                   center:new google.maps.LatLng(LAND_LAT,LAND_LNG),
                                   zoom:16,
                                   mapTypeId:google.maps.MapTypeId.ROADMAP,
                                   disableDefaultUI: true,
                               };

                               var map = new google.maps.Map(document.getElementById("map"), mapProp);

                    //Create pointer
                    var touchdownPoint = new google.maps.Marker({
                        position: land_location,
                        map: map,
                    });

                    var friend_touchdownPoint = new google.maps.Marker({
                        position: friend_location,
                        map:map,
                        icon: 'https://www.google.com/mapfiles/marker_green.png',
                    });

                    var other_friend_touchdownPoint = new google.maps.Marker({
                        position: other_friend_location,
                        map:map,
                        icon: 'https://www.google.com/mapfiles/marker_green.png',
                    });

                    var down_friend_touchdownPoint = new google.maps.Marker({
                        position: down_friend_location,
                        map:map,
                        icon: 'https://www.google.com/mapfiles/marker_green.png',
                    });


/*
                    down_friend_touchdownPoint.addListner('click', function() {
                            infowindow.open(map, down_friend_touchdownPoint);
                    });
                    */

                    //Set point down
                    touchdownPoint.setMap(map);
                    friend_touchdownPoint.setMap(map);
                    other_friend_touchdownPoint.setMap(map);
                    down_friend_touchdownPoint.setMap(map);


                    // Popup for map pins - Content
                    var touchdownInfo = new google.maps.InfoWindow({
                        content:
                        "<p><b>Mary Poppins</b></p>" +
                        "<a target='_blank' href = dial.html><img src=img/icon_phone.png></a> " + "&nbsp;&nbsp;&nbsp;" +
                        "<a href = profile.html><img src=img/icon_profile.png></a>"
                    });

                    var friend_touchdownInfo = new google.maps.InfoWindow({
                        content:
                        "<p><b>Bobby Tables</b></p>" +
                        "<a target='_blank' href = dial.html><img src=img/icon_phone.png></a> " + "&nbsp;&nbsp;&nbsp;" +
                        "<a href = profile.html><img src=img/icon_profile.png></a>"
                    });

                    var other_touchdownInfo = new google.maps.InfoWindow({
                        content:
                        "<p><b>William Shakes</b></p>" +
                        "<a target='_blank' href = dial.html><img src=img/icon_phone.png></a> " + "&nbsp;&nbsp;&nbsp;" +
                        "<a href = profile.html><img src=img/icon_profile.png></a>"
                    });

                    var global_touch = touchdownInfo;

                    touchdownPoint.addListener('click', function() {
                        global_touch.close();
                        touchdownInfo.open(map, touchdownPoint);
                        global_touch = touchdownInfo;
                    });

                    friend_touchdownPoint.addListener('click', function() {
                        global_touch.close();
                        friend_touchdownInfo.open(map, friend_touchdownPoint);
                        global_touch = friend_touchdownInfo;
                    });
                    other_friend_touchdownPoint.addListener('click', function() {
                        global_touch.close();
                        other_touchdownInfo.open(map, other_friend_touchdownPoint);
                        global_touch = other_touchdownInfo;
                    });
                    down_friend_touchdownPoint.addListener('click', function() {
                        global_touch.close();
                        touchdownInfo.open(map, down_friend_touchdownPoint);
                        global_touch = touchdownInfo;

                    });

                    //touchdownInfo.open(map,touchdownPoint);
                }

                google.maps.event.addDomListener(window, 'load', initialize);
