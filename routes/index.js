
/*
 * GET home page.
 */

// exports.index = function(req, res){
//   res.render('index', { title: 'Express' });
// };

var Product = require('../models/product.js');

module.exports = function(app){
	app.get('/', function (req, res) {
		Product.get(null, function (err, products) {
			if (err) {
				products = [];
			}
			res.render('index', {
				title: '商品查询',
				products: products,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});

	app.get('/new', function (req, res) {
		res.render('form', {
			title: '商品新增',
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/new', function (req, res) {
		var product = new Product(req.body.name, req.body.price, req.body.details);
		product.save(function(err) {
			if (err) {
				console.info('>>>>>>>>>>>>>>> '+err+' <<<<<<<<<<<<<<<<<<');
				req.flash('error', err);
				return res.redirect('/new');
			}
			req.flash('success', '新增成功');
			res.redirect('/product/'+product.name);
		});
	});

	app.get('/product/:name', function (req, res) {
		Product.getOne(req.params.name, function (err, product) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('product', {
				title: product.name,
				product: product,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});

	app.get('/delete/:name', function (req, res) {
		Product.remove(req.params.name, function (err, product) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', '删除成功');
			res.redirect('/');
		});
	});

	app.get('/edit/:name', function (req, res) {
		Product.getOne(req.params.name, function (err, product) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/edit/'+req.body.name);
			}
			res.render('form', {
				title: '编辑' + product.name,
				product: product,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});

	app.post('/edit/:name', function (req, res) {
		Product.update(req.params.name, req.body, function (err, product) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/edit/'+req.body.name);
			}
			req.flash('success', '修改成功');
			res.redirect('/product/'+req.body.name);
		});
	});
};