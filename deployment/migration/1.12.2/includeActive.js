var numberOfStructuresUpdated = 0;

db.Xiti.find().forEach(function(document){
    var documentAsJson = JSON.parse(JSON.stringify(document));
    if (!documentAsJson.structureMap) return;
    for(let key in documentAsJson.structureMap) {
        let value = documentAsJson.structureMap[key];
        if (value.id == null) {
            delete value.id;
            value.active = false;
            numberOfStructuresUpdated++;
        }
        if (value.id) {
            delete value.id;
            value.active = true;
            numberOfStructuresUpdated++;
        }
        value.collectiviteId = NumberInt(value.collectiviteId);
    }
    delete documentAsJson._id;
    db.Xiti.updateOne(
        { "_id": document._id },
        { "$set": documentAsJson }
    );
});

print("Number of structures updated : " + numberOfStructuresUpdated);
print("Script has ended successfully");