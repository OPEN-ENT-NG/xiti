/**
	Wrapper controller
	------------------
	Main controller.
**/
function XitiController($scope, $rootScope, model, template, route, date, lang){
	$scope.conf = model.conf
	$scope.structures = model.structures
	$scope.tenants = model.tenants

	$scope.performChange = function(form, action){
		if(form.$valid)
			action()
	}

	$scope.putcollectiviteIdByUAI = function(uaiPrefix, collectiviteId){
		$scope.structures.all.forEach((structure) => {
            var structures = [];
			if(structure.UAI && structure.UAI.startsWith(uaiPrefix)){
                $scope.conf.structureMap[structure.id].collectiviteId = collectiviteId;
                structures.push({
                	"structureId" : structure.id,
					"id" : $scope.conf.structureMap[structure.id].id,
					"collectiviteId" : $scope.conf.structureMap[structure.id].collectiviteId,
					"projetId": $scope.conf.structureMap[structure.id].projetId,
					"plateformeId": $scope.conf.structureMap[structure.id].plateformeId
				})
			}
			if(structures.length > 0){
				$scope.conf.upsertStructureByUAI(structures);
			}
		})
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
					"id": $scope.conf.structureMap[structure.id].id,
					"collectiviteId" : $scope.conf.structureMap[structure.id].collectiviteId,
					"projetId": projetId,
					"plateformeId": plateformeId
				};
			}));
		}
	}

	$scope.initNewStructures = function () {
		$scope.structures.forEach((structure) => {
			if(!$scope.conf.structureMap[structure.id])
                $scope.conf.structureMap[structure.id] = {};
		})
    }

	$scope.conf.get();
	$scope.tenants.getAll();
}
