'use strict';

angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products', 'Reviews', 'Comments',
	function($scope, $stateParams, $location, Authentication, Products, Reviews, Comments) {
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
				$scope.reviews = '';
				$scope.category = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//create a review
		$scope.createReview = function() {
			var review = new Reviews ({
				productId: $stateParams.productId,
				content: this.content,
				comments: []
			});

			review.$save(function(response) {
				$scope.content = '';
				$scope.product = response;
				$location.path('products/' + $stateParams.productId);

			}, function(errorResponse) {
          	$scope.error = errorResponse.data.message;
      		});
		};

		//create a comment
		$scope.createComment = function (index) {
			var comment = new Comments ({
				reviewId: $stateParams.reviewId,
				comment: ''
			});

			comment.$save(function(response){
				$scope.comment = '';
				$scope.review = response;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

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

		$scope.reviewClicked = function(index, review) {
			console.log(review);
			var product = $scope.product;
			$scope.comments = review.comments;
			console.log(review.comments)

			$scope.displayOverlay = true;
			$scope.reviewContent = product.reviews[index].content;
		};

		$scope.hideReview = function(){
			$scope.displayOverlay = false;
		};
	}
]);