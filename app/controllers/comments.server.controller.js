'use strict';

//Mongoose dependencies
var mongoose = require('mongoose');
var	Product = mongoose.model('Product');
var Comment = mongoose.model('Comment'),
	errorHandler = require('./errors'),
	_ = require('lodash');
var products = require('../../app/controllers/products');
var reviews = require('../../app/controllers/reviews');


//add comment
exports.addComment = function(req, res) {
	var product = req.product;
	var review = req.review;
	var comment = req.body;
	comment.commenter = req.user;
	console.log(review.comments);
	review.comments.unshift(comment);

	product.save(function(err) {
		if (err) {
            return res.send(400, {
                message: errorHandler.getErrorMessage(err)
            });
        }   
        else {
            res.jsonp(product);
        }
	});
};

//middleware
exports.commentbyID = function(req, res, next, id) {
	console.log('comment middleware inside');
	req.comment = req.review.comments.id(id);
	console.log(req.comment);
	next();
};

//Edit comment
exports.editComment = function(req, res) {
	var product = req.product;
	var review = req.review;
	var comment = req.comment;
	comment = _.extend(comment, req.body);

	product.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(review.comments);
		}
	});
};

//delete comment
exports.deleteComment = function(req, res) {
	var product = req.product;
	var review = req.review;

	review.comments.id(req.params.commentId).remove();
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

//read reviews thread
exports.showComments = function(req, res) {
	res.jsonp(req.review.comments);
};

//get comment by id
exports.read = function(req, res)	{
	res.jsonp(req.comment)
}

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
