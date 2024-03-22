const express = require('express');
const cors =require('cors');

const app= express(),
    port = 3080;

app.use(cors());

let request =require("request");


types = ["Cafétéria", "Restaurant", "Brasserie", "Foodtruck", "Kiosque", "Libre-service", "Coffee Corner", "épicerie", "Triporteur", "Sandwicherie", "crous and go"];

function estType(ch, types) {
  for (let i = 0; i < types.length; i++) {
    if (ch == types[i]) {
      return true;
    }
  }
  return false;
}

function lien_rech(tab, types,type,infos) {
  let res = "";

  if (estType(tab[0], types)) res = res + 'search('+type+',"' + tab[0] + '")';
  else res = res + 'search('+infos+',"' + tab[0] + '")';
  if (tab.length > 1) {
    for (let i = 1; i < tab.length; i++) {
      if (estType(tab[i], types))
        res = res + ' or search('+type+',"' + tab[i] + '")';
      else res = res + ' and  search('+infos+',"' + tab[i] + '")';
    }
  }
  if(tab[0].length>0){
    res="where="+encodeURIComponent(res);
  }
  return res;
}


app.get("/restaurant/:data", (req, res) => {
  let Jtrie = JSON.parse(req.params.data);

  let trie = lien_rech(Jtrie.trie, types,"type","infos");

  let url =
       "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr_crous_restauration_france_entiere/records?" +
       trie +
       "&limit=10";
  console.log(url);
  request.get(
    {
    url: url,
    json: true,
    headers: { "User-Agent": "request", "Content-Type": "application/json" },
    },
    (err, res1, data) => {
    if (err) {
        console.log("Error:", err);
    } else {
        res.json(data["results"]);
      }
       },
     );
   });

app.get("/logement/:data", (req, res) => {
  let Jtrie = JSON.parse(req.params.data);

  let trie =lien_rech(Jtrie.trie, types,"type","infos");
  let url =
       "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr_crous_logement_france_entiere/records?"
       +
       trie
       +"&limit=10";

  console.log(url);
  request.get({
      url: url,
      json: true,
      headers: { "User-Agent": "request", "Content-Type": "application/json" },
  },
  (err, res1, data) => {
      if (err) {
        console.log("Error:", err);
      } else {
          res.json(data["results"]);
        }
      },
    );
});



app.get("/logement/:latHG/:lonHG/:latBD/:lonBD", (req, res) => {
    let latHG=parseFloat(req.params.latHG);
    let lonHG=parseFloat(req.params.lonHG);
    let latBD=parseFloat(req.params.latBD);
    let lonBD=parseFloat(req.params.lonBD);
    let coord=encodeURIComponent("POLYGON (("+lonBD+" "+ latHG+"," +lonBD+" "+ latBD+","+lonHG+" "+ latHG+","+lonHG+" "+ latBD+","+lonBD+" "+ latHG+"))")

    console.log(coord);
    let tmp="intersects(geocalisation%2C%20geom%27"+coord+"%27)" ;
    let url="https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr_crous_logement_france_entiere/records?where="+tmp+"&limit=100";
    request.get({url: url,json :true ,headers:{"User-Agent" :"request","Content-Type" :"application/json"}},(err,res1,data)=>{
        if(err){
            console.log("Error:",err);
        }else {
            res.json(
                data["results"]
            )
        }
    })
})

app.get("/restaurant/:latHG/:lonHG/:latBD/:lonBD", (req, res) => {
    let latHG=parseFloat(req.params.latHG);
    let lonHG=parseFloat(req.params.lonHG);
    let latBD=parseFloat(req.params.latBD);
    let lonBD=parseFloat(req.params.lonBD);

    let coord=encodeURIComponent("POLYGON (("+lonBD+" "+ latHG+"," +lonBD+" "+ latBD+","+lonHG+" "+ latHG+","+lonHG+" "+ latBD+","+lonBD+" "+ latHG+"))")

    console.log(coord);
    let tmp="intersects(geolocalisation%2C%20geom%27"+coord+"%27)" ;
    let url ="https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr_crous_restauration_france_entiere/records?where="+tmp+"&limit=100";

    console.log(decodeURIComponent(url))
    request.get({url: url,json :true ,headers:{"User-Agent" :"request","Content-Type" :"application/json"}},(err,res1,data)=>{
        if(err){
            console.log("Error:",err);
        }else {
            res.json(
                data["results"]
            )
        }
    })
})


app.get("/etablissement", (req, res) => {
    let url ="https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-principaux-etablissements-enseignement-superieur/records?limit=100&refine=type_d_etablissement%3A%22Universit%C3%A9%22&refine=type_d_etablissement%3A%22Grand%20%C3%A9tablissement%22&refine=type_d_etablissement%3A%22Autre%20%C3%A9tablissement%22";

    request.get({url: url,json :true ,headers:{"User-Agent" :"request","Content-Type" :"application/json"}},(err,res1,data)=>{
        if(err){
            console.log("Error:",err);
        }else {
            res.json(
                data["results"]
            )
        }
    })
})

app.listen(port,()=>{
    console.log('Server is running on port 3080');
})
