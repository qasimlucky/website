const express = require('express')
const app = express()
app.use(express.json());
app.use(express.urlencoded());
var mysql = require('mysql');
bodyParser=require("body-parser");
const multer  = require('multer');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
var async=require("async");


const port = 3000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// Paths
const path = require('path')
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'frontend')));
app.use('/static', express.static(path.join(__dirname, 'routes')));
app.use('/static', express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Session
var session;
const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:false,
    cookie: { maxAge: oneDay },
    resave: false 
}));

// DATABASE CONNECTION

var con = require('./database');
const { Console } = require('console');



// Routes

app.get('/', (req, res) => {
  con.query('SELECT * FROM Persons', (err,rows) => {
    if(err) throw err;
   //console.log(typeof req.next);
    var tagline = "Data from database";

    res.render('index', {
      rows: rows,
      tagline : tagline
    });
    
  });
})

//


app.get('/about', function(req, res) {
  console.log(req.session.start)
  if (req.session.saveUninitialized==true){
    res.render('about', {
    });
  }else{
    res.render('error', {
      message : "Please login"
    });
  }
  
});

app.get('/error', function(req, res) {
  res.render('error', {
  });
});

app.get('/post', function(req, res) {
  
  console.log(req.session)
  res.render('post', {
  });
});

app.get('/login', function(req, res) {
  res.render('login', {
  }); 
});

app.get('/wishlist', function (req, res) {
 var  data = [];
 if (req.session.saveUninitialized==true){
   var email = req.session.userid;
    const queryString = `SELECT itemId FROM wishlist WHERE userName = '${email}';`
    con.query(queryString,  function (err, rowss) {
     for(const e of rowss) {
       var itemId = e.itemId;
       var i = 0;
       const queryString = `SELECT * FROM persons
        WHERE Personid = '${itemId}';`
        con.query(queryString, function (err, rows) {
         data.push(rows[0]);
         i++;
        //console.log(rows[0])
        if(err){console.log("An error occurred." + err);}
       if(i==rowss.length){
        res.render('wishlist', {
        rows : data 
        });
        } if(rowss.length==0){
          res.render('error', {
            message : "No Data"
          });
        
          

        }

        })   
      };  
   })
 }else{
  res.render('error', {
    message : "Please login First"
  });

 }

});


app.post('/Register', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  console.log(req.body.email + "hhhhhhhhhhhhhhhhhhhhhh")

  const queryString = `SELECT * FROM login
  WHERE userName = '${email}';`

  con.query(queryString, function (err, result) {
    if (err) {
        // Throw your error output here.
        console.log("An error occurred." + err);
    } 

    if(result.length>=1){
     // res.send("Welcome User <a href=\'/logout'>click to logout</a>");

      res.render('error', {
        message : "ALready have user with same name"
      });
      
    }else {
        // Throw a success message here.

        const queryString = `INSERT INTO login (userName, password) VALUES ('${email}', '${password}')`;
        con.query(queryString, function (err, result) {
          if (err) {
              // Throw your error output here.
              console.log("An error occurred." + err);
          } else {
              // Throw a success message here.
              console.log("1 record successfully inserted into db");
              res.render('error', {
                message : "successfully Register"
              });
          }
        });
    } 
  });
});

app.post('/loginUser', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  

  const queryString = `SELECT * FROM login
  WHERE userName = '${email}' AND  password = '${password}';`

  con.query(queryString, function (err, result) {
    console.log(result);
    if (err) {
        // Throw your error output here.
        console.log("An error occurred." + err);
    } 

    if(result.length>=1){
        session=req.session;
        session.userid=req.body.email;
       session.saveUninitialized=true,
        session.start=true;
        console.log(req.session)
        res.render('error', {
          message : " Login successfully "
        });
      
    }else {
        // Throw a success message here.
        res.render('error', {
          message : " invalid user name or password"
        });
        
    } 
  });
});
 // Destroy session
 app.get('/logout', function(req, res) {
  if (req.session.saveUninitialized==true){
    res.render('logout', {
    });
  }else{
    res.render('error', {
      message : "Please login First"
    });
  }
  
});

app.post('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});


app.post('/newad',upload.single('uploaded_image'), function(req, res) {
  image = req.file.buffer.toString('base64');
  imagev2 = req.body.uploaded_image
var fname= req.body.fname;
var lname=req.body.lname;
var city=req.body.city;
var email= req.body.email;
var state=req.body.state;
//console.log(image);
//var r = typeof(req.body.uploaded_image);

/*
if (!req.files.uploaded_image){
  console.log("nooooooooooooooo")
}else{console.log("yessssssssssssss")}
*/

const queryString = `INSERT INTO Persons (FirstName, LastName, City, Email, State, ImageData) VALUES ('${fname}', '${lname}', '${city}', '${email}', '${state}', '${image}')`;

con.query(queryString, function (err, result) {
  if (err) {
      // Throw your error output here.
      console.log("An error occurred." + err);
  } else {
      // Throw a success message here.
      console.log("1 record successfully inserted into db");
  }
});
 res.render('post', {
});

});

app.post('/wishlist',(req,res) => {
  console.log(req.body)
  if (req.session.saveUninitialized==true){
    var email = req.session.userid;
    var itemId = req.body.itemId;
  const queryString = `INSERT INTO wishlist(userName, itemId) VALUES ('${email}','${itemId}');`
  con.query(queryString, function (err, result) {
    if (err) {
        // Throw your error output here.
        console.log("An error occurred." + err);
    } else {
        // Throw a success message here.
        console.log("1 record successfully inserted into db");
        res.redirect('/');
    }
  

  })
 }else{
  res.redirect('/');
 }
});


app.post('/removeWishItem',(req,res) => {
  var email = req.session.userid;
  var itemId = req.body.itemId;
  const queryString = `DELETE FROM  wishlist WHERE userName = '${email}' AND  itemId= '${itemId}';`
  con.query(queryString, function (err, result) {
    if (err) {
        // Throw your error output here.
        console.log("An error occurred." + err);
    } else {
        // Throw a success message here.
        console.log("1 record successfully deleted into db");
        res.redirect('/wishlist');
    }
  

  })

});