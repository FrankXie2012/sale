var mongodb = require('mongodb').Db;
var settings = require('../settings');

function Product(name, price, details) {
	this.name = name;
	this.price = price;
	this.details = details;
}

module.exports = Product;

Product.prototype.save = function(callback) {
	var product = {
		name: this.name,
		price: this.price,
		details: this.details
	};
	mongodb.connect(settings.url, function (err, db){
		if (err) {
			return callback(err);
		}
		db.collection('products', function (err, collection){
			if (err) {
				db.close();
				return callback(err);
			}
			collection.insert(product, {
				safe: true
			}, function (err, product) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null, product[0]);
			});
		});
	});
};

Product.get = function(name, callback) {
	mongodb.connect(settings.url, function (err, db){
		if (err) {
			return callback(err);
		}
		db.collection('products', function (err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			var query = {};
			if (name) {
				query.name = name;
			}
			collection.find(query).sort({
				time: -1
			}).toArray(function (err, product) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null, product);
			});
		});
	});
};

Product.getOne = function(name, callback) {
	mongodb.connect(settings.url, function (err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('products', function (err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			collection.findOne({
				"name": name
			}, function (err, product) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null, product);
			});
        });
	});
};

Product.update = function(name, product, callback) {
	mongodb.connect(settings.url, function (err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('products', function (err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			collection.update({
				'name': name
			}, {
				$set: {
					price: product.price,
					details: product.details
				}
			}, function (err) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};

Product.remove = function(name, callback) {
	mongodb.connect(settings.url, function (err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('products', function (err, collection) {
			if (err) {
				db.close();
				return callback(err);
			}
			collection.remove({
				"name": name
			}, {
				w: 1
			}, function (err) {
				db.close();
				if (err) {
					return callback(err);
				}
				callback(null);
			});
		});
	});
};