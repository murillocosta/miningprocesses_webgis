var map = L.map("map").setView([-15.7801, -47.9292], 4.5);

L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
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

// Atualizar a função fetchArcGISData para aceitar múltiplos parâmetros de filtro
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
  const layerId = 0; // Altere conforme necessário

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
