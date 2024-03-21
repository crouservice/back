const express = require('express');
const cors =require('cors');

const app= express(),
    port = 3080;

app.use(cors());

var request =require("request");

app.get("/logement/:lat/:lon", (req, res) => {
    var lat=parseInt(req.params.lat);
    var lon=parseInt(req.params.lon);
    let coord=encodeURIComponent("POLYGON (("+(lon-1)+" "+ (lat+5)+"," +(lon-1)+" "+ (lat-5)+","+(lon+1)+" "+ (lat+5)+","+(lon+1)+" "+ (lat-5)+","+(lon-1)+" "+ (lat+5)+"))")

    console.log(coord);
    var tmp="intersects(geocalisation%2C%20geom%27"+coord+"%27)" ;
    var url="https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr_crous_logement_france_entiere/records?where="+tmp+"&limit=20";
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

app.get("/restaurant/:lat/:lon", (req, res) => {
    var lat=parseInt(req.params.lat);
    var lon=parseInt(req.params.lon);
    let coord=encodeURIComponent("POLYGON (("+(lon-1)+" "+ (lat+5)+"," +(lon-1)+" "+ (lat-5)+","+(lon+1)+" "+ (lat+5)+","+(lon+1)+" "+ (lat-5)+","+(lon-1)+" "+ (lat+5)+"))")

    console.log(coord);
    var tmp="intersects(geolocalisation%2C%20geom%27"+coord+"%27)" ;
    var url ="https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr_crous_restauration_france_entiere/records?where="+tmp+"&limit=20";

    console.log(decodeURIComponent(url))
    request.get({url: url,json :true ,headers:{"User-Agent" :"request","Content-Type" :"application/json"}},(err,res1,data)=>{
        if(err){
            console.log("Error:",err);
        }else {
            res.json(
                data["results"]
            )
        }
        console.log(data)
    })
})

app.get("/etablissement", (req, res) => {
    var url ="https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr-esr-principaux-etablissements-enseignement-superieur/records?limit=100&refine=type_d_etablissement%3A%22Universit%C3%A9%22&refine=type_d_etablissement%3A%22Grand%20%C3%A9tablissement%22&refine=type_d_etablissement%3A%22Autre%20%C3%A9tablissement%22";

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
