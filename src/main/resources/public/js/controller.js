/**
	Wrapper controller
	------------------
	Main controller.
**/
function XitiController($scope, $rootScope, model, template, route, date, lang){
	$scope.conf = model.conf
	$scope.structures = model.structures

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
					"collectiviteId" : $scope.conf.structureMap[structure.id].collectiviteId
				})
			}
			if(structures.length > 0){
				$scope.conf.upsertStructureByUAI(structures);
			}
		})
	}

	$scope.initNewStructures = function () {
		$scope.structures.forEach((structure) => {
			if(!$scope.conf.structureMap[structure.id])
                $scope.conf.structureMap[structure.id] = {};
		})
    }

	$scope.conf.get();
}
