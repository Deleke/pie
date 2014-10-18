'use strict';


//Mongoose dependencies
var mongoose = require('mongoose');
var	Product = mongoose.model('Product'),
Review = mongoose.model('Review'),
errorHandler = require('./errors'),
	_ = require('lodash');
var products = require('../../app/controllers/products');


	//Get the error message from the error object
	var getErrorMessage = function(err) {
		var message = '';

		if (err.code) {
	        switch (err.code) {
	            case 11000:
	            case 11001:
	                message = 'already exists';
	                break;
	            default:
	                message = 'Something went wrong';
	        }
	    } else {
	        for (var errName in err.errors) {
	            if (err.errors[errName].message) message = err.errors[errName].message;
	        }
    }

    return message;
};

//Add review
exports.addReview = function(req, res) {
	//console.log(req.body);
	var product = req.product;
	var review = new Review(req.body);

	review.ruser = req.user;
	product.reviews.push(review);

	product.save(function(err) {
		if (err) {
			console.log('oh shit');
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }   
        else {
        	console.log('oh good');
            res.jsonp(product);
            
        }
	});
};

exports.update = function(req, res) {
	var product = req.product;
	var review = req.review;

	review = _.extend(review, req.body);

	product.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(product.reviews);
		}
	});
};

//review middleware
exports.reviewbyID = function(req, res, next, id) {
	req.review = req.product.reviews.id(id);
	next();
};

//read reviews thread
exports.list = function(req, res) {
	res.jsonp(req.product.reviews);
};
//Read review thread
exports.read = function(req, res) {
	res.jsonp(req.review);
};

//Delete review
exports.deleteReview = function(req, res) {
	var product = req.product;

	product.reviews.id(req.params.reviewId).remove();
	product.save(function(err) {
		if (err) {
			return res.send(400, {
				message: 'Delete failed'
			});
		} else {
			res.jsonp(product);
		}
	});
};

//authorization middleware
exports.hasAuthorization = function(req, res, next) {
    console.log('requires login');
    if (req.review.reviewer.toString() !== req.user.id) {
        return res.send(403, {
            itemMessage: 'You are not authorized'
        });
    }
    next();
};




