var map = L.map("map").setView([-15.7801, -47.9292], 4.5);

L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 17,
    minZoom: 4.5,
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
).addTo(map);

document.getElementById("apply-filters").addEventListener("click", () => {
  const searchName = document.getElementById("search-name").value.trim();
  const searchId = document.getElementById("search-id").value.trim();
  const searchProcesso = document
    .getElementById("search-processo")
    .value.trim();
  const searchAno = document.getElementById("search-ano").value.trim();
  const searchFase = document.getElementById("search-fase").value.trim();
  const searchSubs = document
    .getElementById("search-subs")
    .value.trim()
    .toUpperCase();
  const searchUso = document.getElementById("search-uso").value.trim();
  const searchUf = document.getElementById("search-uf").value.trim();
  const searchFid = document.getElementById("search-fid").value.trim();

  fetchArcGISData(
    searchName,
    searchId,
    searchProcesso,
    searchAno,
    searchFase,
    searchSubs,
    searchUso,
    searchUf,
    searchFid
  );
});

async function fetchArcGISData(
  searchName = "",
  searchId = "",
  searchProcesso = "",
  searchAno = "",
  searchFase = "",
  searchSubs = "",
  searchUso = "",
  searchUf = "",
  searchFid = ""
) {
  const baseURL =
    "https://geo.anm.gov.br/arcgis/rest/services/SIGMINE/dados_anm/MapServer";
  const layerId = 0;

  let whereClause = "1=1";
  if (searchName) {
    whereClause += ` AND nome LIKE '%${searchName}%'`;
  }
  if (searchId) {
    whereClause += ` AND ID = '${searchId}'`;
  }
  if (searchProcesso) {
    whereClause += ` AND PROCESSO LIKE '%${searchProcesso}%'`;
  }
  if (searchAno) {
    whereClause += ` AND ANO = ${searchAno}`;
  }
  if (searchFase) {
    whereClause += ` AND FASE LIKE '%${searchFase}%'`;
  }
  if (searchSubs) {
    whereClause += ` AND SUBS LIKE '%${searchSubs}%'`;
  }
  if (searchUso) {
    whereClause += ` AND USO LIKE '%${searchUso}%'`;
  }
  if (searchUf) {
    whereClause += ` AND UF = '${searchUf}'`;
  }
  if (searchFid) {
    whereClause += ` AND FID = ${searchFid}`;
  }

  const url = `${baseURL}/${layerId}/query?where=${encodeURIComponent(
    whereClause
  )}&outFields=*&f=geojson`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    addGeoJSONToMap(data);
  } catch (error) {
    console.error("Erro ao buscar dados da API: ", error);
  }
}

// Função para adicionar GeoJSON ao mapa
function addGeoJSONToMap(data) {
  // Limpar camadas anteriores
  map.eachLayer((layer) => {
    if (layer instanceof L.GeoJSON) {
      map.removeLayer(layer);
    }
  });

  // Adicionar novos dados
  L.geoJSON(data).addTo(map);
}

// Chamar a função para buscar e adicionar os dados ao mapa
fetchArcGISData();

map.on("click", function (e) {
  var coords = e.latlng;

  var identifyUrl =
    "https://geo.anm.gov.br/arcgis/rest/services/SIGMINE/dados_anm/MapServer/identify";

  var params = {
    f: "json",
    tolerance: 3,
    returnGeometry: true,
    mapExtent: map.getBounds().toBBoxString(),
    imageDisplay: map.getSize().x + "," + map.getSize().y + ",96",
    geometryType: "esriGeometryPoint",
    sr: "4326",
    geometry: JSON.stringify({
      x: coords.lng,
      y: coords.lat,
      spatialReference: { wkid: 4326 },
    }),
    layers: "visible:0",
  };

  fetch(identifyUrl + "?" + new URLSearchParams(params))
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        var result = data.results[0];
        var props = result.attributes;

        var popupContent = `
                  <b>Nome:</b> ${props["Titular"] || "Não informado"}<br>
                  <b>ID:</b> ${props["ID"] || "Não informado"}<br>
                  <b>Processo:</b> ${props["Processo"] || "Não informado"}<br>
                  <b>Ano:</b> ${props["Ano"] || "Não informado"}<br>
                  <b>Fase:</b> ${props["Fase"] || "Não informado"}<br>
                  <b>Subs:</b> ${props["Substância"] || "Não informado"}<br>
                  <b>Uso:</b> ${props["Uso"] || "Não informado"}<br>
                  <b>UF:</b> ${props["UF"] || "Não informado"}<br>
                  <b>FID:</b> ${props["FID"] || "Não informado"}
                  <b>FID:</b> ${props["Último evento"] || "Não informado"}
              `;
        var popupContent = `
                  <div class="popup-header">Detalhes da Área</div>
                  <div class="popup-content"><b>Nome:</b> ${
                    props["Titular"] || "Não informado"
                  }</div>
                  <div class="popup-content"><b>ID:</b> ${
                    props["ID"] || "Não informado"
                  }</div>
                  <div class="popup-content"><b>Processo:</b> ${
                    props["Processo"] || "Não informado"
                  }</div>
                  <div class="popup-content"><b>Ano:</b> ${
                    props["Ano"] || "Não informado"
                  }</div>
                  <div class="popup-content"><b>Fase:</b> ${
                    props["Fase"] || "Não informado"
                  }</div>
                  <div class="popup-content"><b>Subs:</b> ${
                    props["Substância"] || "Não informado"
                  }</div>
                  <div class="popup-content"><b>Uso:</b> ${
                    props["Uso"] || "Não informado"
                  }</div>
                  <div class="popup-content"><b>UF:</b> ${
                    props["UF"] || "Não informado"
                  }</div>
                  <div class="popup-content"><b>UF:</b> ${
                    props["Último evento"] || "Não informado"
                  }</div>
                  <div class="popup-content"><b>FID:</b> ${
                    props["FID"] || "Não informado"
                  }</div>
                  <div class="popup-footer">Dados fornecidos por SIGMINE</div>
              `;

        L.popup().setLatLng(coords).setContent(popupContent).openOn(map);
      } else {
        L.popup()
          .setLatLng(coords)
          .setContent("Nenhum dado disponível para esta área.")
          .openOn(map);
      }
    })
    .catch((error) => {
      console.error("Erro ao obter dados:", error);
      L.popup()
        .setLatLng(coords)
        .setContent("Erro ao obter dados.")
        .openOn(map);
    });
});
