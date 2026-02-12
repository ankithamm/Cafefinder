let map;
let service;
let markers=[];

const darkStyle=[
  {elementType:"geometry",stylers:[{color:"#1d2c4d"}]},
  {elementType:"labels.text.fill",stylers:[{color:"#8ec3b9"}]},
  {elementType:"labels.text.stroke",stylers:[{color:"#1a3646"}]}
];

function initMap(){

  const mysore={lat:12.2958,lng:76.6394};

  map=new google.maps.Map(document.getElementById("map"),{
    zoom:14,
    center:mysore,
    styles:darkStyle
  });

  service=new google.maps.places.PlacesService(map);

  loadCafes(mysore);
}

// Load cafes near location
function loadCafes(location){

  clearMarkers();

  const request={
    location:location,
    radius:2000,
    keyword:"cafe"
  };

  service.nearbySearch(request,(results,status)=>{

    if(status===google.maps.places.PlacesServiceStatus.OK && results){

      results.forEach(place=>{

        const marker=new google.maps.Marker({
          map:map,
          position:place.geometry.location,
          title:place.name,
          icon:"https://maps.google.com/mapfiles/ms/icons/coffeehouse.png"
        });

        const info=new google.maps.InfoWindow({
          content:`<b>${place.name}</b>`
        });

        marker.addListener("click",()=>{
          info.open(map,marker);
        });

        markers.push(marker);
      });
    }
  });
}

// ⭐ SEARCH CAFE OR CITY
function searchLocation(){

  const query=document.getElementById("searchBox").value;

  if(!query){
    alert("Type something first");
    return;
  }

  clearMarkers();

  service.textSearch({query:query},(results,status)=>{

    console.log("TextSearch:",status);

    if(status===google.maps.places.PlacesServiceStatus.OK && results){

      const loc=results[0].geometry.location;

      map.setCenter(loc);
      map.setZoom(15);

      results.forEach(place=>{

        const marker=new google.maps.Marker({
          map:map,
          position:place.geometry.location,
          title:place.name,
          icon:"https://maps.google.com/mapfiles/ms/icons/coffeehouse.png"
        });

        const info=new google.maps.InfoWindow({
          content:`<b>${place.name}</b>`
        });

        marker.addListener("click",()=>{
          info.open(map,marker);
        });

        markers.push(marker);
      });

    }else{
      alert("Cafe or location not found");
    }

  });
}

// 📍 My location
function useMyLocation(){

  navigator.geolocation.getCurrentPosition((pos)=>{

    const loc={
      lat:pos.coords.latitude,
      lng:pos.coords.longitude
    };

    map.setCenter(loc);
    loadCafes(loc);
  });
}

// Clear markers
function clearMarkers(){
  markers.forEach(m=>m.setMap(null));
  markers=[];
}