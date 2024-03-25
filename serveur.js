const express = require('express');
const cors =require('cors');

const app= express(),
    port = 3080;

app.use(cors());

let request =require("request");

types_exclu=[""];

types_recherche_rest = ["cafétéria", "restaurant", "brasserie", "foodtruck", "kiosque", "libre-service", "coffee corner", "épicerie", "triporteur", "sandwicherie", "crous and go","cafet"];
zones_recherche_log = ["amiens", "angers", "arras", "avignon", "auxerre", "besançon", "bobigny", "bordeaux", "bourges", "brest", "caen", "cachan", "chartres", "chambéry", "clermont-ferrand", "compiegne", "creteil", "dijon", "grenoble", "guadeloupe", "hauts-de-seine", "herouville-saint-clair", "garde", "rochelle", "landes", "bourget", "havre", "cezeaux", "limoges", "lille", "lyon", "marseille", "martinique", "metz", "montpellier", "mont-saint-aignan", "mulhouse", "nancy", "nantes", "nice", "nîmes", "orléans", "pau", "perpignan", "poitiers", "reims", "rennes", "roubaix", "rouen", "saint-étienne", "sénart", "strasbourg", "talence", "toulouse", "tours", "d'oise", "paris", "valence", "vandœuvre-lès-nancy", "villeurbanne", "villeneuve", "yvelines","mans"];

commun_recherche=["pmr", "parking", "laverie", "cuisine", "douche", "kitchenette", "internet", "garage", "securite", "restauration", "travail","chambre","logement","résidence"];


app.get("/trie", (req, res) => {
    //console.log(JSON.stringify({"trie" : types_recherche_rest.concat(zones_recherche_log).concat(commun_recherche)}));
    res.json(
      ({"trie" : types_recherche_rest.concat(zones_recherche_log).concat(commun_recherche)})
    );
})

function estType(ch, types) {
  for (let i = 0; i < types.length; i++) {
    if (ch == types[i]) {
      return true;
    }
  }
  return false;
}

function lien_rech(tab, types,exclus,type,infos) {
  let res = "";
  if(tab[0]=="" && tab.length>1 ){
    tab.shift();
  }
  //console.log(tab)
  let deb=0
  for(deb ;deb<tab.length && estType(tab[deb],exclus);deb++);
  //if(estType(tab[deb], exclus))return "where="+encodeURIComponent('search('+type+',azerty)');

  if (estType(tab[deb], types)) res = res + 'search('+type+',"' + tab[deb] + '")';
  else res = res + 'search('+infos+',"' + tab[deb] + '")';

  if (tab.length > 1) {
    for (i = deb+1; i < tab.length; i++) {
      if (estType(tab[i], types))
        res = 'search('+type+',"' + tab[i] + '")'+'and '+res;
      else if (!estType(tab[i], exclus))res = res + ' and  search('+infos+',"' + tab[i] + '")';
    }
  }
  if(tab[0].length>0){
    res="where="+encodeURIComponent(res);
  }
  return res;
}



app.get("/restaurant/:data", (req, res) => {
  let Jtrie = JSON.parse(req.params.data);

  let trie = lien_rech(Jtrie.trie,zones_recherche_log,types_exclu,"zone","infos");
  //console.log("trie",trie)
  let url =
       "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr_crous_restauration_france_entiere/records?" +
       trie +
       "&limit=10";
  
  //console.log("url",url)
  request.get(
    {
    url: url,
    json: true,
    headers: { "User-Agent": "request", "Content-Type": "application/json" },
    },
    (err, res1, data) => {
    if (err) {
        //console.log("Error:", err);
    } else {
        res.json(data["results"]);
      }
       },
     );
   });

app.get("/logement/:data", (req, res) => {
  let Jtrie = JSON.parse(req.params.data);

  let trie =lien_rech(Jtrie.trie, zones_recherche_log,types_exclu,"zone","infos");
  //console.log("trie",trie)
  let url =
       "https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr_crous_logement_france_entiere/records?"
       +
       trie
       +"&limit=10";
  //console.log("url",url)
  request.get({
      url: url,
      json: true,
      headers: { "User-Agent": "request", "Content-Type": "application/json" },
  },
  (err, res1, data) => {
      if (err) {
        //console.log("Error:", err);
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

    let tmp="intersects(geocalisation%2C%20geom%27"+coord+"%27)" ;
    let url="https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr_crous_logement_france_entiere/records?where="+tmp+"&limit=100";
    request.get({url: url,json :true ,headers:{"User-Agent" :"request","Content-Type" :"application/json"}},(err,res1,data)=>{
        if(err){
            //console.log("Error:",err);
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


    let tmp="intersects(geolocalisation%2C%20geom%27"+coord+"%27)" ;
    let url ="https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr_crous_restauration_france_entiere/records?where="+tmp+"&limit=100";

    //console.log(decodeURIComponent(url))
    request.get({url: url,json :true ,headers:{"User-Agent" :"request","Content-Type" :"application/json"}},(err,res1,data)=>{
        if(err){
            //console.log("Error:",err);
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
            //console.log("Error:",err);
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