const bodyParser = require('body-parser');
var md5 = require('md5');
const { BSONRegExp } = require('bson');
var mysql = require('mysql');
var dateFormat = require('dateformat');
var configure = require('./configure');
const fs = require('fs');

function convertDate(d) {
    var converted_date = dateFormat(d, "dd.mmm.yyyy")
    return converted_date;
}

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: configure.config.DBpassword,
    database: "e-commerce"
});

var db = {};

db.connect = function(afterConnect) {
    con.connect(function(err) {
        if (!err) {
            afterConnect("kareem");
        }
    });
}

db.createDBIfNotExists = function(databaseName) {

    con.query("CREATE DATABASE IF NOT EXISTS " + databaseName, function(err, result) {
        if (!err) {}
    });

}
db.findOne = function(user, done) {
    var sql = `select * from user where email = '${user.email}' ;`
    con.query(sql, function(req, res) {
        if (res) {
            var user;
            res.forEach(element => {
                user = element;
            });
            done(null, user);
        }
    })
}

db.findUser = function(user, afterFind) {
    var sql = `select * from user where email = '${user.email}' ;`
    con.query(sql, function(req, res) {
        if (res) {
            var user;
            res.forEach(element => {
                user = element;
            });
            afterFind(user);
        } else {
            afterFind();
        }
    })
}


db.findProduct = function(id, afterFind) {
    var product;
    var sql = `select * from products where products_id = '${id}';`
    console.log(sql)
    con.query(sql, null, function(req, res) {

        if (!req) {

            res.forEach(element => {
                product = element;
            });
            afterFind(product);
        } else afterFind(req);
    })
}
db.deleteLastChar = function(str) {
    return str.substr(0, str.length - 1);
}

db.insert = function(tableName, data, afterInsert) {
    var result = "";
    var sqlColumns = "";
    var sqlQuestionMarks = "";
    var valuesArray = []
    for (var prop in data) {
        console.log(prop);
        if (prop == "id") continue;
        if (prop == "confirm_password") continue;
        if (prop == "mobile") continue;
        if (prop == "imgBase64") {
            var data2 = data.imgBase64;
            data2 = data2.replace('data:image/png;base64,', '');
            let buff = new Buffer(data2, 'base64');
            fs.writeFileSync(`./public/images/profile_pictures/${data.email}.png`, buff);
            sqlColumns += prop + ",";
            sqlQuestionMarks += "?,";
            valuesArray.push(`${data.email}.png`);
            console.log("data[prop]");
            continue;
        }
        sqlColumns += prop + ",";
        sqlQuestionMarks += "?,";
        if (prop == "password") valuesArray.push(md5(data[prop]));
        else valuesArray.push(data[prop]);
    }
    sqlColumns = db.deleteLastChar(sqlColumns);
    sqlQuestionMarks = db.deleteLastChar(sqlQuestionMarks);
    var sqlInsert = "INSERT INTO " + tableName + " (" + sqlColumns + ") values (" + sqlQuestionMarks + ")";

    con.query(sqlInsert, valuesArray, function(error2, result) {
        if (!error2) {
            result = "data inserted";

        } else {
            result = error2;

        }
    });
    afterInsert(result)
}

db.insetImages = function(data, products_id, afterAddImagesInDb) {
    var flag = 0;
    data.forEach((image) => {
        if (flag === 0) {
            var sql2 = `update  products set primary_image = '${image.filename}' where products_id = ${products_id} `
            con.query(sql2, null, (err, res) => {
                if (!err) {

                }
            })
            flag = 1;
        } else {

            var sql = `insert into images (products_id,image_url)values('${products_id}','${image.filename}')`

            con.query(sql, null, function(req, res) {
                if (res) {
                    afterAddImagesInDb("added to DB")
                }
            })
        }
    })

}
db.getImages = function(id, imagesFromDb) {
    var sql = `select * from images where products_id = ${id}`
    console.log(sql)
    con.query(sql, null, function(req, res) {

        if (res) {
            imagesFromDb(res)
        } else imagesFromDb([])
    })
}
db.insertProduct = function(product, afterInsert) {
    var sql2 = "insert into products   (`name`,`state`,`price`,`quantity`,`desc`,`date`) values ('" + product.name + "','" + product.state + "','" + product.price + "','" + product.quantity + "','" + product.desc + "','" + convertDate(product.date) + "');"
    con.query(sql2, null, function(req, res) {
        if (res) {

            afterInsert(res.insertId);
        } else afterInsert(0);
    });
}
db.login = function(user, done) {

    var sql = `select * from user where email = '${user.email}' and password = '${md5(user.password)}';`
    con.query(sql, function(err, user_from_data_base) {
        var final_user_data = {};
        user_from_data_base.forEach(element => {
            final_user_data = element;
        });

        if (Object.keys(final_user_data).length <= 0) {
            return done(null, false, { message: 'Incorrect email.' });
        }
        if (final_user_data.password != md5(user.password)) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        /* if everything is correct, let's pass our user object to the passport.serializeUser */
        return done(null, final_user_data);
    });
}
db.updateUserData = function(user, afterUpdate) {
    var sql = `update user set first_name = '${user.first_name}' ,last_name= '${user.last_name}',password= '${user.confirm_password}',address='${user.Address}' where user_id = ${user.user_id}`;

    con.query(sql, function(req, res) {
        if (res) {
            afterUpdate("updated")
        } else {
            afterUpdate("error")
        }
    })
}

db.selectAll = function(tableName, afterselect) {
    con.query("SELECT * FROM `e-commerce`." + tableName + "", null, function(err, result) {
        if (!err) {

            afterselect(result);
        } else {
            afterselect([]);
        }
    });
}

db.selectAllProMaxS = function(tableName, afterselect) {
    con.query("SELECT * FROM `e-commerce`." + tableName + " order by products_id desc ", null, function(err, result) {
        if (!err) {

            afterselect(result);
        } else {
            afterselect([]);
        }
    });
}

db.insertIntoCart = (user, afterInsert) => {
    var sql = `insert into cart (user_id) value ('${user}')`
    con.query(sql, null, (req, res) => {
        if (res) {
            afterInsert(res.insertId);
        } else {
            afterInsert(0);
        }
    })
}
db.insertIntoCartProducts = (id, product, afterInsertCartPriduct) => {
    var sql = `insert into cart_products (cart_id,product_id,quantity,total_price_per_product,total,date) values ('${id}','${product.products_id}','1','${product.price}','${product.price}',NULL)`
        //  var sql = "INSERT INTO `e-commerce`.`cart_products` (`cart_id`, `product_id`, `quantity`, `total_price_per_product`, `date`, `total`) VALUES ('"+id+"', '"+product.products_id+"', '1', '"+product.products_id+"', '2021-02-19', '1');"
    console.log(sql)
    con.query(sql, null, (req, res) => {
        if (res) {
            afterInsertCartPriduct("inserted");
        } else {
            afterInsertCartPriduct(0)
        }
    })
}
db.updateCart = (product, afterUpdate) => {
    var sql = `update cart_products set quantity = '${product.quantity}',total=${product.quantity*product.price} where cart_products_id = ${product.id}`
    con.query(sql, null, (req, res) => {
        if (res) {
            afterUpdate("updated")
        } else {
            afterUpdate(0)
        }
    })
}
db.deleteFromCart = (product_id, afterDelete) => {
    var sql = `delete from cart_products where cart_products_id = ${product_id} ;`


    con.query(sql, null, (req, res) => {
        if (res) {
            afterDelete("deleted")
        } else {
            afterDelete(0)
        }
    })
}
db.DeleteProduct = (product_id, afterDelete) => {
    var sql = `delete from products where products_id = ${product_id} ;`
    con.query(sql, null, (req, res) => {
        if (!req) {
            afterDelete("deleted")
        } else {
            afterDelete(0)
        }
    })
}
db.editProduct = (product, afterUpdate) => {
    console.log(product)

    var sql = "update products set name = '" + product.name + "' , price = '" + product.price + "' , `desc` = '" + product.desc + "' where products_id = '" + product.itemID + "' "
    console.log(sql)
    con.query(sql, null, (err, res) => {
        if (!err) {
            afterUpdate("updated");
        } else {
            console.log(err)
            afterUpdate(0);
        }
    })
}

db.getUserCart = (userID, data) => {
    var sql = "select `cart_products_id`,`cart_id`,`product_id`,`cart_products`.`quantity`,`total_price_per_product`,`cart_products`.`date`,`total`,`price`,`desc`,`name`,`state` from  cart_products,products where cart_id in (select cart_id from cart where user_id = '" + userID + "' and state ='open') and products_id = product_id  "
    console.log(sql)
    con.query(sql, null, (req, res) => {
        if (res) {
            data(res)
        } else(
            data([])
        )
    })
}
db.getAllUsersCart = (data) => {
    var sql = "select sum(total) total,cart.state,cart_products.cart_id ,first_name,last_name from user,cart_products,cart where user.user_id = cart.user_id and cart.cart_id=cart_products.cart_id and  cart_products.cart_id in (select cart_id from cart where state != 'open') group by cart_products.cart_id ;"
        // console.log(sql)
    con.query(sql, null, (req, res) => {
        if (res) {
            console.log(res)
            data(res)
        } else(
            data([])
        )
    })
}

db.getUserCartState = (userID, data) => {
    var sql = "select * from  cart where user_id = '" + userID + "' and state != 'orderd' and state != 'approved'"
    console.log(sql)
    con.query(sql, null, (err, res) => {

        if (!err) {
            console.log(res.length);
            if (res.length <= 0)
                data(0)
            else
                data(res)
        } else {
            //data(err)
        }
    })
}

db.updateAdminState = (user, afterUpdate) => {
    var sql = `update user set isAdmin = '${user.value}' where user_id='${user.id}'`
    console.log(sql)
    con.query(sql, null, (err, res) => {
        if (!err) {
            afterUpdate("updated")
        } else {
            afterUpdate(0)
        }
    })

}
db.updateCartState = (user, notes, afterInsert) => {
    var sql = `insert into orders (user_id,notes) value ('${user}','${notes}')`
    con.query(sql, null, (req, res) => {
        if (!req) {
            afterInsert(res.insertId);
        } else {
            afterInsert(0);
        }
    })
}
db.updateState = (data, afterUpdate) => {
    var sql = `update cart set notes = '${data[0].notes}' , state = 'orderd' where cart_id = '${data[0].cart_id}';`
    console.log(sql)
    con.query(sql, null, (err, res) => {
        if (!err) {
            afterUpdate("updated")
        }
    })
}
db.approve = (data, afterUpdate) => {
    var sql = `update cart set state = 'approved' where cart_id = ${data.cart_id}`
    var sql2 = `update products set quantity = quantity-1 where products_id in (select product_id from cart_products where cart_id = '${data.cart_id}')`
    con.query(sql2, null, (err, res) => {
        if (!err) {
            con.query(sql, null, (err, res) => {
                if (!err) {
                    afterUpdate(1)
                }
                afterUpdate(0)
            })
        }
    })
}
db.homeProducts = (afterSelect) => {
    var sql = ` select * from products limit 3 ;`
    con.query(sql, null, (err, res) => {
        if (!err)
            afterSelect(res)
    })
}
db.checkUser = (email, afterCheck) => {
    var sql = `select email from user where email = '${email}'`
    con.query(sql, null, (err, res) => {
        if (!err) {
            if (res.length == 0) {
                afterCheck(0)

            } else {
                afterCheck("user already exist")
            }
        } else {
            afterCheck(err.message)
        }
    })

}


module.exports = db;