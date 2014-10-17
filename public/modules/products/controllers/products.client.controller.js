'use strict';

angular.module('products').controller('ProductsController', ['$scope', '$sce' ,'$stateParams', '$location', 'Authentication', 'Products', 'Reviews', 'Comments',
	function($scope, $sce, $stateParams, $location, Authentication, Products, Reviews, Comments) {
		$scope.authentication = Authentication;

		$scope.scePermit = function(path){
			return $sce.trustAsResourceUrl(path);
		};

		$scope.create = function() {
			var product = new Products({
				title: this.title,
				// reviews: [{content: $scope.review}],
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

		$scope.getExtension = function(filename) {
		    var parts = filename.split('.');
		    return parts[parts.length - 1];
		};

		$scope.isVideo = function(filetype) {
			if(filetype.indexOf('video') >= 0) {
				return true;
			} else {
				return false;
			}
		    // var ext = getExtension(filename);
		    // switch (ext.toLowerCase()) {
		    // case 'm4v':
		    // case 'avi':
		    // case 'mpg':
		    // case 'mp4':
		    //     // etc
		    //     return true;
		    // }
		    // return false;
		};

		 $scope.onFileSelect = function ($files) {
           
            $scope.files = $files;
            $scope.stringFiles = [];

            if ($scope.files && $scope.files[0]) {
	           if ($scope.isVideo($scope.files[0].type)) {

	           		var reader  = new FileReader();

	           		reader.onloadend = function (e) {
					   
					    $scope.stringFiles.push({path: e.target.result});
					};

					reader.readAsDataURL($scope.files[0]);
	          	  	$scope.correctFormat = true; 
	        	} else {
                   $scope.correctFormat = false; 
              	}
              	
          	}
        };

		//create a review
		$scope.createReview = function() {
			var review = new Reviews ({
				productId: $stateParams.productId,
				comments: []
			});
			console.log($scope.stringFiles);
			review.content = $scope.stringFiles[0].path;

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

		$scope.removeReview = function(review) {
   			var review = new Reviews({
   				productId: $scope.product._id,
   				_id: review._id,
   				reviewPoster: review.ruser
   			});

   			review.$remove(function(response) {
   				$scope.product = response
   			});

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

		$scope.reviewClicked = function(review) {
			// console.log(index);
			console.log(review);
			var product = $scope.product;
			$scope.comments = review.comments;
			console.log('access permitted') 
			$scope.displayOverlay = true;
		};

		$scope.hideReview = function(){
			$scope.displayOverlay = false;
		};
	}
]);