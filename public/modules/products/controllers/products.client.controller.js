'use strict';

angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products', 'Reviews',
	function($scope, $stateParams, $location, Authentication, Products, Reviews) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var product = new Products({
				title: this.title,
				reviews: [{content: $scope.review}],
				category: this.category

			});

			console.log(product);

			product.$save(function(response) {
				$location.path('products/' + response._id);
				$scope.createReview();
				$scope.title = '';
				$scope.review = '';
				$scope.category = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//create a review
		// $scope.createReview = function() {
		// 	var review = new Reviews ({
		// 		productId: $scope.product._id,
		// 		content: this.content,
		// 		comments: []
		// 	});

		// 	review.$save(function(response) {
		// 		$scope.product = response;
		// 	}, function(errorResponse) {
  //         	$scope.error = errorResponse.data.message;
  //     		});
		// }

		$scope.remove = function(product) {
			if (product) {
				product.$remove();

				for (var i in $scope.products) {
					if ($scope.products[i] === product) {
						$scope.products.splice(i, 1);
					}
				}
			} else {
				$scope.product.$remove(function() {
					$location.path('products');
				});
			}
		};

		$scope.update = function() {
			var product = $scope.product;

			product.$update(function() {
				$location.path('products/' + product._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.products = Products.query();
		};

		$scope.findOne = function() {
			$scope.product = Products.get({
				productId: $stateParams.productId
			});
		};
	}
]);