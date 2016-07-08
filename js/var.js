var areas = {
    "UBC" : {
        "lat" : {
            "min" : 49.279508,
            "max" : 49.250336,
        },
        "lng" : {
            "min" : -123.260821,
            "max" : -123.233212,
        },
    },
    "Downtown" : {
        "lat" : {
            "min" : 49.272071,
            "max" : 49.290619,
        },
        "lng" : {
            "min" : -123.143484,
            "max" : -123.094494,
        },
    },
};

var groups = {
    "UBC" : {
        area    : areas["UBC"],
        centre  : new google.maps.LatLng(49.2611, -123.2531),
        members : [
            "Me",
            "Brian",
            "Eric",
            "Lisa",
            "Jodie",
        ],
    },
    "Downtown" : {
        area    : areas["Downtown"],
        centre  : {
            lat : 49.2842,
            lng : -123.1211
        },
        members : [
            "Me",
            "Adam",
            "Calvin",
            "Dexter",
            "Frank",
            "Kat",
            "Michelle",
            "Norah",
        ],
    },
};
