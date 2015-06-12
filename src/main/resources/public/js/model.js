function XitiConf(){}
XitiConf.prototype.get = function(){
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
	if(!this.structureMap[structureId])
		this.structureMap[structureId] = "0"
	http().put('/xiti/structure/'+structureId+'/'+this.structureMap[structureId]).done(function(){
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
