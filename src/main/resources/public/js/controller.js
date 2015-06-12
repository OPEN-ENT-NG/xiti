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

	$scope.conf.get()
}
