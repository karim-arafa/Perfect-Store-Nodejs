var db = require("./DBlibrary");
var passport = require('passport');
var multer = require('multer');
var flash = require('connect-flash');
const fs = require('fs');
var name = [];
var names = '';

var storage = multer.diskStorage({
    destination: function(req, file, callback) {

        callback(null, './public/images/uploads');
    },
    filename: function(req, file, callback) {
        // 
        names = file.fieldname + '-' + Date.now() + file.originalname
        name.push(names)
        callback(null, names);
    }
});
var upload = multer({ storage: storage }).array('userPhoto', 5);

exports.controler = {

    register: function(req, res) {
        db.checkUser(req.body.email, (afterCheck) => {
            console.log("wwwwwwwwwwwwwwwwwwwww");
            if (afterCheck == 0) {
                db.insert("user", req.body, function(finalResult) {

                    res.render("public/login", { errormessage: "" });
                });
            } else {
                res.render("public/register", { errormessage: afterCheck });
            }
        })

    },
    registerView: function(req, res) {
        if (req.isAuthenticated()) return res.redirect('/home.html');
        res.render("public/register", { errormessage: "" });
    },
    registerImg: function(req, res) {
        console.log("55555555555555555555555555");
        var data = req.body.imgBase64;
        data = data.replace('data:image/png;base64,', '');
        let buff = new Buffer(data, 'base64');
        fs.writeFileSync('./public/images/profile_pictures/.png', buff);
        console.log('Base64 image data converted to file: stack-abuse-logo-out.png');

    },
    loginView: function(req, res) {
        if (req.isAuthenticated()) return res.redirect('/home.html');

        res.render('public/login', {
            errormessage: req.flash('error'),
        });
    },
    home: function(req, res) {
        db.homeProducts((afterSelect) => {
            res.render("public/home", { items: afterSelect });
        })

    },
    product: function(req, res) {
        db.findProduct(req.body.id, function(itemsFromDb) {
            db.getImages(req.body.id, function(ImagesFromDb) {
                res.render("public/product", { item: itemsFromDb, images: ImagesFromDb, errormessage: "" })
            })

        });
    },
    shop: function(req, res) {
        db.selectAll("products", function(itemsFromDb) {

            res.render("public/shop", { items: itemsFromDb, errormessage: "" })
        });

    },
    edit: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        res.render("public/edit")
    },

    editProductUpdate: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        db.editProduct(req.body, (afterUpdate) => {
            if (afterUpdate != 0) {
                res.redirect("http://localhost:8080/addproduct.html")
            }
        })
    },

    editPost: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        upload(req, res, function(err) {

            if (err) {
                return res.end("Error uploading file.");
            }

            db.insertProduct(req.body, function(afterInsert) {
                db.insetImages(req.files, afterInsert, function(afterAddImagesInDb) {
                    db.selectAllProMaxS("products", function(itemsFromDb) {
                        res.render("public/add_product", { items: itemsFromDb, errormessage: "" })
                    });
                })

            });
        });

    },
    add_product: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        db.selectAllProMaxS("products", function(itemsFromDb) {
            res.render("public/add_product", { items: itemsFromDb, errormessage: "" })
        });
    },

    addProductEdit: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        db.findProduct(req.body.id, function(itemsFromDb) {
            db.getImages(req.body.id, function(ImagesFromDb) {
                res.render("public/edit_product", { item: itemsFromDb, images: ImagesFromDb, errormessage: "" })
            })

        });

    },
    addProductDelete: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        db.DeleteProduct(req.body.id, (afterDelete) => {
            if (afterDelete != 0) {
                res.redirect("http://localhost:8080/addproduct.html")
            }
        })
    },
    account: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        res.render("public/account", { user: req.user, msg: "" });
    },

    accountPost: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        db.findUser(req.body, (afterFind) => {
            if (afterFind) {
                if (req.body.password === afterFind.password) {
                    db.updateUserData(req.body, function(afterUpdate) {
                        if (afterUpdate != "error") {
                            res.render("public/login", { errormessage: "" });
                        }
                    });
                } else {
                    res.render("public/account", { user: afterFind, msg: "old password is not correct ! " });
                }
            }
        })
    },
    cart: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        db.getUserCart(req.user.user_id, (data) => {
            var total = 0
            if (data.length != 0) {

                data.forEach((e) => {
                    total += e.price
                })
                res.render("public/cart", { data: data, errormessage: "", total: total });
            } else
                res.render("public/cart", { data: data, errormessage: "no Data", total: total });
        })
    },
    addToCart: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        db.getUserCartState(req.user.user_id, (data) => {
            if (data == 0) {
                db.insertIntoCart(req.user.user_id, (afterInsert) => {
                    if (afterInsert != 0)
                        db.findProduct(req.body.itemID, function(itemsFromDb) {
                            db.insertIntoCartProducts(afterInsert, itemsFromDb, (afterInsertCartPriduct) => {
                                res.redirect("http://localhost:8080/shop.html")
                            })
                        })
                })
            } else {
                db.findProduct(req.body.itemID, function(itemsFromDb) {
                    db.insertIntoCartProducts(data[0].cart_id, itemsFromDb, (afterInsertCartPriduct) => {
                        res.redirect("http://localhost:8080/shop.html")
                    })
                })
            }
        })

    },
    EditCart: (req, res) => {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        db.updateCart(req.body, (afterUpdate) => {
            if (afterUpdate != 0) {
                res.redirect("http://localhost:8080/cart.html")
            }
        })
    },
    deleteFromCart: (req, res) => {

        if (!req.isAuthenticated()) return res.redirect('/register.html');
        db.deleteFromCart(req.body.id, (afterDelete) => {
            if (afterDelete != 0) {
                res.redirect("http://localhost:8080/cart.html")
            }
        })

    },
    checkout: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        console.log(req.user)
        db.getUserCart(req.user.user_id, (data) => {
            var total = 0
            if (data.length != 0) {

                data.forEach((e) => {
                    total += e.price
                })
                res.render("public/checkout", { data: data, user: req.user, errormessage: "", total: total });
            }
            // else
            // res.render("public/cart",{data:data,errormessage:"no Data",total:total});
        })
    },
    orders: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        res.render("public/orders");
    },
    manage_users: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        db.selectAll("user", function(itemsFromDb) {
            res.render("public/manage_users", { users: itemsFromDb, errormessage: "" })
        });
    },
    manage_orders: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        db.getAllUsersCart((data) => {
            res.render("public/manage_orders", { cart: data });
        })
    },
    checkUpdate: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        db.updateAdminState(req.body, (afterUpdate) => {
            if (afterUpdate != 0) {
                // res.redirect("http://localhost:8080/manage_orders.html");
            }
        })
    },
    getCheckData: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        console.log(req.user)
        db.getUserCart(req.user.user_id, (data) => {
            var total = 0
            if (data.length != 0) {

                data.forEach((e) => {
                    total += e.price
                })
                res.render("public/checkout", { data: data, user: req.user, errormessage: "", total: total });
            }
            // else
            // res.render("public/cart",{data:data,errormessage:"no Data",total:total});
        })
    },
    checkOutOrder: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('/register.html');
        db.getUserCartState(req.user.user_id, (data) => {
            db.updateState(data, function(itemsFromDb) {
                res.redirect("http://localhost:8080/shop.html")
            })
        })
    },
    approve: function(req, res) {
        if (!req.isAuthenticated()) return res.redirect('public/register');
        db.approve(req.body, (afterUpdate) => {
            db.getAllUsersCart((data) => {
                res.render("public/manage_orders", { cart: data });
            })
        })
    }
}