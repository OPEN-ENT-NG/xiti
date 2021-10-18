import { model } from 'entcore';
import http from "axios";

export let Xiti = {

	XitiConf: function(){
        this.get = async function() {
            let response = await http.get('/xiti/config');
            this.updateData(response.data);
            this.structureMap = {};
        }
    
        this.upsertPlatform = async function() {
            let copyCat = JSON.parse(JSON.stringify(this));
            delete(copyCat.structureMap)
            delete(copyCat._id);
            await http.put('/xiti/platform', copyCat);
        }
    
        this.upsertStructure = async function(structureId) {
            if(structureId) {
                await http.put(`/xiti/structure/${structureId}`, this.structureMap[structureId]);
            }
        }
    
        this.upsertStructureByUAI = async function(data) {
            let copyCat = JSON.parse(JSON.stringify(data));
            await http.put('/xiti/structuresByUAI', copyCat);
        }
    },
    
	Tenant: function(){

        this.getAll = async function() {
            let response = await http.get('/directory/tenant/all');
            this.updateData(response.data);
        }
    
        this.isStructureAttachedToTenant = function(structureId) {
            return this.data.some(function(tenant){
                return tenant.structures.some(function(structure){
                    return structure.id === structureId;
                })
            })
        }
    
        this.getTenantById = function(tenantId) {
            return this.data.find(function(tenant){
                return tenant.id === tenantId;
            })
        }
    },
    
    Structure: function(){},
    
};

///////////////////////
///   MODEL.BUILD   ///

export const build = function() {
    model.makeModels(Xiti)
	this.conf = new Xiti.XitiConf();
	this.tenants = new Xiti.Tenant();
	this.collection(Xiti.Structure, {
        sync: async function() {
            let response = await http.get('/directory/structure/admin/list');
            this.load(response.data);
        }
    });
}

///////////////////////
