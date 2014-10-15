'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Product = mongoose.model('Product'),
	_ = require('lodash');




//A function that allows the creation of a product
exports.create = function(req, res) {
	var product = new Product(req.body);
	product.user = req.user;

	product.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product);
		}
	});
};




//A function to show current products
exports.read = function(req, res) {
	res.jsonp(req.product);
};



//An update function on a product
exports.update = function(req, res) {
	var product = req.product;

	product = _.extend(product, req.body);

	product.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product);
		}
	});
};


//A delete function on the product
exports.delete = function(req, res) {
	var product = req.product;

	product.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product);
		}
	});
};



//A function that lists products
exports.list = function(req, res) {
	Product.find().sort('-created').populate('user', 'displayName').populate('reviews.user','displayName').exec(function(err, products) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(products);
		}
	});
};

//find product
// exports.searchProducts = function(req, res) {
// 	var $or = {
// 		 $or: []
// 	};

// 	var validateQuery = function() {
// 		if (req.query.tit && req.query.tit.length > 0) {
// 			$or.$or.push ({
// 				category: new RegExp(req.query.tit, 'i')
// 			});
// 		}

// 		if (req.query.cat && req.query.cat.length > 0) {
// 			$or.$or.push ({
// 				category: new RegExp(req.query.cat, 'i')
// 			});
// 		}

// 	}

// 	validateQuery();

// 	Products.find($or).exec(function(err, product) {
// 		if (err) {
// 			return res.status(400).send({
// 				message: 'No reviews exist for this product'
// 			});
// 		} else {
// 			res.jsonp(product);
// 		}
// 	});
// };

/**
 * Product middleware
 */
exports.productByID = function(req, res, next, id) {
	Product.findById(id).populate('user', 'displayName').populate('reviews.user','displayName').exec(function(err, product) {
		if (err) return next(err);
		if (!product) return next(new Error('Failed to load item ' + id));
		req.product = product;
		next();
	});
};

/**
 * Product authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.product.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};