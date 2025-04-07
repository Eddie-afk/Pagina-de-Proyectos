import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-analytics.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

/*const firebaseConfig = {
  apiKey: "AIzaSyAd6onb12MTpsXwLp9UCgLyeLB5qQ5YFB4",
  authDomain: "fir-aplicacion-dcb79.firebaseapp.com",
  projectId: "fir-aplicacion-dcb79",
  storageBucket: "fir-aplicacion-dcb79.firebasestorage.app",
  messagingSenderId: "656275088365",
  appId: "1:656275088365:web:1b8adb71e68f7ac36bbde4",
  measurementId: "G-7VY9338CBL",


};*/
export { firebaseConfig };

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAd6onb12MTpsXwLp9UCgLyeLB5qQ5YFB4",
  authDomain: "fir-aplicacion-dcb79.firebaseapp.com",
  projectId: "fir-aplicacion-dcb79",
  storageBucket: "fir-aplicacion-dcb79.firebasestorage.app",
  messagingSenderId: "656275088365",
  appId: "1:656275088365:web:1b8adb71e68f7ac36bbde4",
  measurementId: "G-7VY9338CBL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

let map;
const { AvancedMarketElement } = await google.maps.importLibrary("marker");
const API_KEY = "SBA2D0SXHVSO";
const icons = [
  {
    src: "",
    description: "Selecciona un PIN",
  },
  {
    src: "./images/punto5.png",
    description: "Color blue pin",
  },

  {
    src: "./images/punto4.png",
    description: "Color Red pin",
  },

  {
    src: "./images/punto2.png",
    description: "Color black pin",
  },
  {
    src: "./images/beachflag.png",
    description: "Flag",
  },
];
const locations = [
  {
    place: "Select a place",
    lat: "",
    lng: "",
  },

  {
    place: "UTLD",
    lat: "25.501",
    lng: " -103.55129",
    zoom: 16,
  },
  {
    place: "TEC LERDO",
    lat: "10",
    lng: "10",
  },
];

const lat = document.getElementById("latitude");
const lng = document.getElementById("longitude");
const buttonSet = document.getElementById("buttonSet");
const zoomSlider = document.getElementById("zoomRange");
const zoomValue = document.getElementById("zoomValue");

const locationSelect = document.getElementById("locationSelect");
const iconSelect = document.getElementById("iconSelect");
const iconImage = document.getElementById("iconImage");
const dialog = document.querySelector(".popup"); //detiene el programa
const popupLatitude = document.querySelector("#popup_latitude");
const popupLongitude = document.querySelector("#popup_longitude");
const popupButtom = document.querySelector("#popupButton");
const timeZone = document.getElementById("timeZone");
const time = document.getElementById("time");
const timeButton = document.getElementById("timeButton");
const placename = document.querySelector("#placename");
const warning = document.querySelector("#warning");
console.log(location);

locations.forEach((location, i) => {
  let opt = document.createElement("option"); //Crear el Codigo
  opt.value = i;
  opt.innerHTML = location.place;
  locationSelect.appendChild(opt); //agrega codigo HTML
});

icons.forEach((icon, i) => {
  let opt = document.createElement("option"); //Crear el Codigo
  opt.value = i;
  opt.innerHTML = icon.description;
  iconSelect.appendChild(opt); //agrega codigo HTML
});

buttonSet.addEventListener("click", setCoordinates);

function setCoordinates() {
  const x1 = {
    lat: parseFloat(latitude.value),
    lng: parseFloat(longitude.value),
  };

  let zoom = parseInt(zoomSlider.value);
  console.log(x1);
  map.setCenter(x1);
  map.setZoom(zoom);
}

zoomSlider.addEventListener("input", () => {
  zoomValue.textContent = zoomSlider.value;
  map.setZoom(parseInt(zoomSlider.value));
});

async function getTimeZone() {
  if (!lat.value || !lng.value) return;

  // Ahora la petición va a tu servidor proxy en lugar de TimeZoneDB directamente
  const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat.value}&lng=${lng.value}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      let formattedTime = data.formatted.split(" ")[1].slice(0, 5); // 🔹 Muestra solo horas y minutos
      time.value = `${formattedTime} - ${data.countryName}, ${data.regionName}`;
    } else {
      time.value = "Error al obtener la hora";
    }
  } catch (error) {
    console.error("Error:", error);
    time.value = "Error de conexión";
  }
}

function SetLocations() {
  let x1 = locationSelect.value;
  lat.value = locations[x1].lat;
  lng.value = locations[x1].lng;

  const y1 = {
    lat: parseFloat(lat.value),
    lng: parseFloat(lng.value),
  };
  map.setCenter(y1);
}
function addMarker(
  location,
  iconSrc,
  name = "Sin nombre",
  description = "Sin descripción"
) {
  const image = {
    url: iconSrc,
    size: new google.maps.Size(30, 30),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(15, 30),
  };
  const marker = new google.maps.Marker({
    map,
    position: location,
    icon: image,
  });
  const infoWindow = new google.maps.InfoWindow({
    content: `<strong>${name}</strong><br>${description}`,
  });

  marker.addListener("mouseover", () => {
    infoWindow.open(map, marker);
  });

  marker.addListener("mouseout", () => {
    infoWindow.close();
  });
}

function addInfo(location) {
  lat.value = location.lat();
  lng.value = location.lng();
}

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 25.501, lng: -103.55129 },
    zoom: 16,
  });

  map.addListener("click", function (e) {
    console.log("Funciona el click en el mapa");
    console.log(e.latLng.lat());
    console.log(e.latLng.lng());
    //addMarker(e.latLng);

    addInfo(e.latLng);

    showPopup(e.latLng);
  });
}
async function showPopup(location) {
  console.log(popupLatitude);
  popupLatitude.value = location.lat();
  popupLongitude.value = location.lng();
  await getTimeZone();
  dialog.showModal();
  const now = new Date();
  const timeString = time.value; // Formato de hora local
  document.getElementById("popup_time").value = timeString;
  document.getElementById("popup_description").value = "";

  dialog.showModal();
}

function addDB(location) {
  const coords = {
    lat: location.lat,
    lng: location.lng,
    placename: location.place,
    description: location.description, // Asegurar que se guarde la descripción
    time: location.time,
    icon: icons[parseInt(iconSelect.value)].src, // Guardar la URL del icono
  };

  addDoc(collection(db, "locations"), coords)
    .then(() => {
      console.log("Coordinates stored in Firestore");
      addMarker(coords, coords.icon, coords.placename, coords.description); // 🔹 Agregar marcador directamente
    })
    .catch((error) =>
      console.error("Error storing coordinates in Firestore:", error)
    );
}
// Guardamos los marcadores en la colección "user_markers" con el UID del usuario

function setImage() {
  iconImage.src = icons[parseInt(iconSelect.value)].src; // 🔹 Actualiza la imagen
}

buttonSet.addEventListener("click", setCoordinates);

locationSelect.addEventListener("change", SetLocations);
iconSelect.addEventListener("change", () => {
  if (parseInt(iconSelect.value) !== 0) {
    warning.textContent = "";
  }
});

popupButtom.addEventListener("click", (e) => {
  e.preventDefault();

  const selectedIcon = parseInt(iconSelect.value);
  const nameValid = placename.value.trim().length > 0;
  const iconValid = selectedIcon !== 0;

  if (!nameValid) {
    warning.textContent = "¡Falta el nombre del lugar!";
    return;
  }

  if (!iconValid) {
    warning.textContent = "¡Selecciona un PIN válido!";
    return;
  }

  let data = {
    lat: parseFloat(popupLatitude.value),
    lng: parseFloat(popupLongitude.value),
    place: placename.value.trim(),
    time: document.getElementById("popup_time").value,
    description: document.getElementById("popup_description").value.trim(),
    icon: icons[selectedIcon].src,
  };

  addDB(data);
  dialog.close();
  warning.textContent = "";
});

async function loadMarkersFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, "locations"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const position = { lat: data.lat, lng: data.lng };
      addMarker(position, data.icon, data.placename, data.description); // 🔹 Pasar placename y description
    });
    console.log("Markers loaded from Firestore");
  } catch (error) {
    console.error("Error loading markers from firestore", error);
  }
}

const apiKey = "pub_78731cc5d8c4dcf79d391355fc9767db0cdce"; // reemplaza con tu API Key real
const newsContainer = document.getElementById("newsContainer");

async function getNews() {
  const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=mx&language=es&category=top`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      newsContainer.innerHTML = "";
      data.results.forEach((article) => {
        const card = document.createElement("div");
        card.className = "news-card";

        card.innerHTML = `
          <h3>${article.title}</h3>
          <a href="${article.link}" target="_blank">Leer más</a>
        `;

        newsContainer.appendChild(card);
      });
    } else {
      newsContainer.innerHTML = "<p>No se encontraron noticias.</p>";
    }
  } catch (error) {
    console.error("Error:", error);
    newsContainer.innerHTML = "<p>Error al cargar noticias.</p>";
  }
}

getNews();

getNews();

initMap().then(loadMarkersFromFirestore);

//selectores

//son mas viejos, pero no obsoletos
//getElementById
//getElementByClass

//tipos de variables
//const, let, var

//arreglos
//const x1= []

//Mas recomendados
//Query selector
//Query selectorALL

//tipos de objetos, p, input, select (estudiar los principales propuedades)

//switch

//listeners, tipos de eventos que se pueden programar (click y change)

//DOM estructura del HTML la manera que carga la pagina

//funciones, nombradas, arrow y anonimas
