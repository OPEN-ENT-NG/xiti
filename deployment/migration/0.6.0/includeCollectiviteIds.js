var plateforme = db.Xiti.findOne({"ID_COLLECTIVITE":{$exists:true}});
if(plateforme != null){
    var structureMaptmp = plateforme.structureMap;
    var setMap = {};
	var id;
    for(s in structureMaptmp){
		id  = structureMaptmp[s];
        setMap[s] =
            {
                "id" : NumberInt(id),
                "collectiviteId" : NumberInt(plateforme.ID_COLLECTIVITE)
            }
    }
    db.Xiti.update({}, {"$set": {"structureMap" : setMap}})
}