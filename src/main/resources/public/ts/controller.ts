import { ng, notify } from 'entcore'

export let xitiController = ng.controller('XitiController', ['$scope', '$timeout', 'model', ($scope, $timeout, model) => {
	$scope.conf = model.conf
	$scope.structures = model.structures
	$scope.tenants = model.tenants

	$scope.disableButton = false;

	$scope.performChange = function(form, action){
		if(form.$valid)
			action()
	}

	$scope.updateAllStructures = async function(){
		let structures = [];
		$scope.structures.all.forEach((structure) => {
			structures.push({
				"structureId" : structure.id,
				"collectiviteId" : $scope.conf.structureMap[structure.id].collectiviteId,
				"projetId": $scope.conf.structureMap[structure.id].projetId,
				"plateformeId": $scope.conf.structureMap[structure.id].plateformeId,
				"UAI": $scope.conf.structureMap[structure.id].UAI,
				"active": $scope.conf.structureMap[structure.id].active
			});
		});
		if(structures.length > 0){
			$scope.disableButton = true;
			let req = await $scope.conf.upsertStructureByUAI(structures);
			if (req.status != 200) {
				notify.error("xiti.structures.update.fail");
			} else {
				notify.info("xiti.structures.update.succeed");
			}
			$scope.disableButton = false;
			$scope.$apply();
		}
	}

	$scope.putcollectiviteIdByUAI = function(uaiPrefix, collectiviteId){
		let structures = [];
		$scope.structures.all.forEach((structure) => {
			if(structure.UAI && structure.UAI.startsWith(uaiPrefix)){
                $scope.conf.structureMap[structure.id].collectiviteId = collectiviteId;
                structures.push({
                	"structureId" : structure.id,
					"collectiviteId" : $scope.conf.structureMap[structure.id].collectiviteId,
					"projetId": $scope.conf.structureMap[structure.id].projetId,
					"plateformeId": $scope.conf.structureMap[structure.id].plateformeId,
					"UAI": $scope.conf.structureMap[structure.id].UAI,
					"active": $scope.conf.structureMap[structure.id].active
				});
			}
		});
		if(structures.length > 0){
			$scope.conf.upsertStructureByUAI(structures);
		}
	}

	$scope.putProjetAndPlateformeIdByTenant = function(tenantId, projetId, plateformeId){
		var structures = $scope.tenants.getTenantById(tenantId).structures;
		if (structures && structures.length > 0){
			structures.forEach(function(structure){
				$scope.conf.structureMap[structure.id].projetId = projetId;
				$scope.conf.structureMap[structure.id].plateformeId = plateformeId;
			});
			$scope.conf.upsertStructureByUAI(structures.map(function(structure){
				return {
					"structureId": structure.id,
					"collectiviteId" : $scope.conf.structureMap[structure.id].collectiviteId,
					"projetId": projetId,
					"plateformeId": plateformeId,
					"UAI": $scope.conf.structureMap[structure.id].UAI,
					"active": $scope.conf.structureMap[structure.id].active
				};
			}));
		}
	}

	$scope.initNewStructures = function () {
		$scope.structures.forEach((structure) => {
			if(!$scope.conf.structureMap[structure.id]) {
                $scope.conf.structureMap[structure.id] = {};
			}
			if (!$scope.conf.structureMap[structure.id].UAI) {
				$scope.conf.structureMap[structure.id].UAI = structure.UAI;
			}
		})
    }

	$scope.upsertStructure = function (structureId) {
		$timeout(function () {
			$scope.conf.upsertStructure(structureId);
		});
	}

	$scope.conf.get();
	$scope.tenants.getAll();
}]);
