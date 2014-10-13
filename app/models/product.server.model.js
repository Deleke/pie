'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;


//A comment schema declaring the attribute of a comment
var CommentSchema = new Schema ({
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	comment: {
		type: String,
		default: ''
	}
});



//A review schema that stores details about the review
var ReviewSchema = new Schema ({
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	content: {
		type: String,
		default: ''
	},
	posted: {
		type: Date,
		default: Date.now
	},
	comments: [CommentSchema]
});




//A product schema that stores attributes of a ptoduct
var ProductSchema = new Schema ({
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	category: {
		type: String,
		default: '',
		required: 'please select the category for the product being reviewed',
		trim: true
	},
	title: {
		required: 'The product being reviewed should have a name, don\'t you think',
		type: String,
		default: ''
	},
	added: {
		type: Date,
		default: Date.now
	},
	reviews: [ReviewSchema]
});

mongoose.model('Product', ProductSchema);
mongoose.model('Review', ReviewSchema);
mongoose.model('Comment', CommentSchema);