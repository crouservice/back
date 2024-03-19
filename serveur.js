const express = require('express');
const cors =require('cors');

const app= express(),
    port = 3080;

app.use(cors());

var request =require("request");

var url ="https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr_crous_logement_france_entiere/records?limit=20"





request.get({url: url,json :true ,headers:{"User-Agent" :"request","Content-Type" :"application/json"}},(err,res,data)=>{
    if(err){
        console.log("Error:",err);
    }else {
        //console.log(data);
        donne=JSON.parse(JSON.stringify(data));
    }
})



var url2="/liste"
app.get(url2,(req,res)=>{
    res.json(
        donne["results"]
    )
})


app.get("/localisation/:lat/:lon", (req, res) => {
    var lat=parseInt(req.params.lat);
    var lon=parseInt(req.params.lon);
    let coord=encodeURIComponent("POLYGON (("+(lon-1)+" "+ (lat+5)+"," +(lon-1)+" "+ (lat-5)+","+(lon+1)+" "+ (lat+5)+","+(lon+1)+" "+ (lat-5)+","+(lon-1)+" "+ (lat+5)+"))")
    
    console.log(coord);
    var tmp="intersects(geocalisation%2C%20geom%27"+coord+"%27)" ;
    var urlFinal ="https://data.enseignementsup-recherche.gouv.fr/api/explore/v2.1/catalog/datasets/fr_crous_logement_france_entiere/records?where="+tmp+"&limit=20";
    url=urlFinal;
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





