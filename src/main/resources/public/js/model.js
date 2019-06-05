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

function Tenant(){}

Tenant.prototype.getAll = function(callback){
	var that = this
	http().get('/directory/tenant/all').done(function(data){
		that.updateData(data)
	})
}

Tenant.prototype.isStructureAttachedToTenant = function(structureId){
	var res = this.data.some(function(tenant){
		return tenant.structures.some(function(structure){
			return structure.id === structureId;
		})
	})
	return res;
}

Tenant.prototype.getTenantById = function(tenantId){
	var res = this.data.find(function(tenant){
		return tenant.id === tenantId;
	})
	return res;
}

///////////////////////
///   MODEL.BUILD   ///

model.build = function(){
	model.makeModels([XitiConf, Structure, Tenant])

	this.conf = new XitiConf()
	this.tenants = new Tenant()
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
