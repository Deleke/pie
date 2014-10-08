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

	app.route('/products/:productId')
		.get(products.read)
		.put(products.update)
		.delete(products.delete);

	// Reviews route
	app.route('/products/:productId/reviews')
		.get(reviews.list)
		.post(reviews.addReview);

	app.route('/products/:productId/reviews/:reviewId')
		.get(reviews.read)
		.put(reviews.update)
		.delete(reviews.deleteReview);

	// Comments route
	app.route('/products/:productId/reviews/:reviewId/comments')
		.get(comments.showComments)
		.post(comments.addComment);

	app.route('/products/:productId/reviews/:reviewId/comments/:commentId')
		.put(comments.editComment)
		.delete(comments.deleteComment);

	// Finish by binding the product middleware
	app.param('productId', products.productByID);

	//Finish by binding the review middleware
	app.param('reviewId', reviews.reviewbyID);

	//finish by binding the comment middleware
	app.param('commentId', comments.commentbyID);
};