const express = require("express");
const mysql   = require("mysql");
const sha256 = require("sha256");
const session = require('express-session');


const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js
app.use('/public', express.static('public'));
app.use(express.urlencoded()); //use to parse data sent using the POST method
app.use(session({ secret: 'any word', cookie: { maxAge: 60000 }}))

// login username is still admin / password is secret

// this is where the movies are stored -- populate movie ids
var CART = [];

app.get("/", function(req, res){
   res.render("index");
});

app.get("/login", function(req, res){
   res.render("login");
});

app.post("/loginProcess", function(req, res) {
    
    if ( req.body.username == "admin" && sha256(req.body.password) == "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b") {
       req.session.authenticated = true;
       res.send({"loginSuccess":true});
    } else {
       res.send(false);
    }
})

app.get("/cart", function(req, res){
   res.send("penis");
});
    
app.get("/about", function(req, res){
   res.send("buy movies and stuff");
});
    

app.get("/admin", async function(req, res){
   console.log("authenticated: ", req.session.authenticated);    
   if (req.session.authenticated) { //if user hasn't authenticated, sending them to login screen
     let movieList = await getMovieList();  
     let genreList = await getGenreList();
     let directorList = await getDirectorList();
     
       //console.log(authorList);
       res.render("adminPage", {"movieList":movieList, "genreList":genreList, "directorList":directorList});  
   }  else { 
       res.render("login"); 
   }
});
//==========================================================
//============ TEST CONNECTION TO DATABASE =================
//==========================================================
// Test connection is able to pull info from each table in the database
// Movie Table (p_movie)
// Director Table (p_director)
// Genre Table (p_genre)
// Rated Table (p_rated)

app.get("/dbTest", function(req, res){

    let conn = dbConnection();
    
    conn.connect(function(err) {
       if (err) throw err;
       console.log("Connected!");
    
       //let sql = "SELECT * FROM q_author WHERE sex = 'F'";
       let sql = "SELECT movieName, firstName, lastName, genreName, ratedName FROM p_movie a, p_director b, p_genre c, p_rated d WHERE a.directorId = b.directorId and a.genreId = c.genreId and a.ratedId = d.ratedId";
    
       conn.query(sql, function (err, rows, fields) {
          if (err) throw err;
          res.send(rows);
       });
    
    });

});//dbTest



//Functions


//MOVIELIST
function getMovieList(){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
      let sql = `SELECT movieName, description, firstName, lastName, genreName, ratedName, image
                FROM p_movie a, p_director b, p_genre c, p_rated d 
                WHERE a.directorId = b.directorId and a.genreId = c.genreId and a.ratedId = d.ratedId`;


                        
        
           conn.query(sql, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}
//MOVIELIST
//genreLIST
function getGenreList(){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
      let sql = `SELECT genreName, genreDescription
                FROM p_genre  
                ORDER BY genreId `;
                
           conn.query(sql, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}
//GENRELIST
//DIRECTORLIST
function getDirectorList(){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
      let sql = `SELECT firstName, lastName
                FROM p_director 
                ORDER BY directorId `;
                
           conn.query(sql, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}
//DIRECTORLIST




function dbConnection(){

   let conn = mysql.createConnection({
                 host: "cst336db.space",
                 user: "cst336_dbUser20",
             password: "bgwggt",
             database:"cst336_db20"
             
       }); //createConnection

return conn;

}//dbConnection



//starting server
app.listen(process.env.PORT, process.env.IP, function(){
console.log("Express server is running...");
});