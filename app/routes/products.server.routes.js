'use strict';

/**
 * Module dependencies.
 */

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var products = require('../../app/controllers/products');
	var reviews = require('../../app/controllers/reviews');
	var comments = require('../../app/controllers/comments');

	// Products Routes
	app.route('/products')
		.get(products.list)
		.post(products.create);

	//Search route
	// app.route('/products/find')
	// 	.get(products.searchProducts);

	app.route('/products/:productId')
		.get(products.read)
		.put(users.requiresLogin, products.hasAuthorization, products.update)
		.delete(users.requiresLogin, products.hasAuthorization, products.delete);

	// Reviews route
	app.route('/products/:productId/reviews')
		.get(reviews.list)
		.post(users.requiresLogin, reviews.addReview);

	app.route('/products/:productId/reviews/:reviewId')
		.get(reviews.read)
		.put(users.requiresLogin, reviews.update)
		.delete(users.requiresLogin, reviews.deleteReview);

	// Comments route
	app.route('/products/:productId/reviews/:reviewId/comments')
		.get(comments.showComments)
		.post(users.requiresLogin, comments.addComment);

	app.route('/products/:productId/reviews/:reviewId/comments/:commentId')
		.put(users.requiresLogin, comments.editComment)
		.delete(users.requiresLogin, comments.deleteComment);

	// Finish by binding the product middleware
	app.param('productId', products.productByID);

	//Finish by binding the review middleware
	app.param('reviewId', reviews.reviewbyID);

	//finish by binding the comment middleware
	app.param('commentId', comments.commentbyID);
};