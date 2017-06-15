var plateforme = db.Xiti.findOne({"ID_COLLECTIVITE":{$exists:true}});
if(plateforme != null){
    var structureMaptmp = plateforme.structureMap;
    var setMap = {};
    for(s in structureMaptmp){
        setMap[s] =
            {
                "id" : NumberInt(structureMaptmp[s]),
                "collectiveId" : NumberInt(plateforme.ID_COLLECTIVITE)
            }
    }
    db.Xiti.update({}, {"$set": {"structureMap" : setMap}})
}