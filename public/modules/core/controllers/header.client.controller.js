'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$http', 'Authentication', 'Menus', 'Products',
	function($scope, $http, Authentication, Menus, Products) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		//Find a product's review
		// $scope.searchProduct = function () {
		// 	var url = 'products/find';
		// 	var config = {
		// 		params: {}
		// 	};

		// 	console.log('blah')

		// 	if ($scope.findProduct === undefined) {
		// 		$scope.invalidSearch = 'Please enter a valid search';
		// 		$scope.noProduct = '';
		// 	} else {
		// 		$scope.invalidSearch = '';
		// 		config.params.tit = $scope.findProduct;
		// 		config.params.cat = $scope.findProduct;
		// 		$http.get(url, config).success(function(response){
		// 			$scope.invalidSearch = '';
		// 			if(response.length === 0){
		// 				$scope.noProduct = 'This Product hasn\'nt been reviewed yet';
		// 				$scopefindProduct = '';
		// 			} else {
		// 				$scope.noProduct = '';
		// 				$scope.foundProduct = response;
		// 			}

		// 			$location.path('results').search(response)

		// 		});
		// 	}
		// };
	}
]);