'use strict';

//Articles service used for communicating with the articles REST endpoints
angular.module('products').factory('Comments', ['$resource',
	function($resource) {
		return $resource('products/:productId', {
			productId: '@productId', reviewId: '@reviewId', commentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);