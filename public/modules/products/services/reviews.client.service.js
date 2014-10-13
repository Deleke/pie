'use strict';

//Reviews service used for communicating with the product REST endpoints
angular.module('products').factory('Reviews', ['$resource',
	function($resource) {
		return $resource('products/:productId/reviews/:reviewId', {
			productId: '@productId', reviewId: '@_id' 
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);