function XitiConf(){}
XitiConf.prototype.get = function(callback){
	var that = this
	http().get('/xiti/config').done(function(data){
		that.updateData(data)
		if(!that.structureMap)
			that.structureMap = {}
	})
}
XitiConf.prototype.upsertPlatform = function(){
	var copyCat = JSON.parse(JSON.stringify(this))
	delete(copyCat.structureMap)
	delete(copyCat._id)
	http().putJson('/xiti/platform', copyCat).done(function(){
		//notify?
	})
}
XitiConf.prototype.upsertStructure = function(structureId){
	if(!structureId)
		return
	http().putJson('/xiti/structure/'+structureId, this.structureMap[structureId])
		.done(function(){
		//notify?
	})
}
XitiConf.prototype.upsertStructureByUAI = function(data){
    var copyCat = JSON.parse(JSON.stringify(data))
    http().putJson('/xiti/structuresByUAI', copyCat).done(function(){
        //notify?
    })
}


function Structure(){}

///////////////////////
///   MODEL.BUILD   ///

model.build = function(){
	model.makeModels([XitiConf, Structure])

	this.conf = new XitiConf()
	this.collection(Structure, {
        sync: function(hook){
            var that = this
            http().get('/directory/structure/admin/list').done(function(data){
                that.load(data)
            })
        }
    })
}

///////////////////////
