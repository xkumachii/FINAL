const express = require("express");
const mysql   = require("mysql");
const sha256 = require("sha256");
const session = require('express-session');
const _ = require('underscore');

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js
app.use('/public', express.static('public'));
app.use(express.urlencoded()); //use to parse data sent using the POST method
app.use(session({ secret: 'any word', cookie: { maxAge: 60000 }}));

// login username is still admin / password is secret

// this is where the bought movies are stored -- populate movie objects
var CART = [];

// welcome screen
app.get("/", async function(req, res){
    
    let movieList = await getMovieList();

    var movies = [];
    
    movieList.forEach(function(movie) {
        movies.push(movie);
    });
    
    _.shuffle(movies);
    
    var movieDisplay = [];
    
    for (var i = 0; i < 5; i++) {
        movieDisplay.push(movies[i]);
    }
    
    _.shuffle(movieDisplay);
    
   res.render("index", {"movieDisplay": movieDisplay});
});

app.get("/login", function(req, res){
   res.render("login");
});
//UPDATE MOVIES
app.get("/updateMovie", async function(req, res){
  let movieInfo = await getMovieInfo(req.query.movieId); 
  console.log("Movie Info: "+ movieInfo);
  res.render("updateMovie", {"movieInfo":movieInfo});
  
});

app.post("/updateMovie", async function(req, res){
  let rows = await updateMovie(req.body);
  
  let movieInfo = req.body;
  console.log("rows" + rows);
  let message = "Movie WAS NOT updated!";
  if (rows.affectedRows > 0) {
      message= "Movie successfully updated!";
  }
  res.render("updateMovie", {"message":message, "movieInfo":movieInfo});
    
});
//UPDATEMOVIES

//UPDATE GENRES
app.get("/updateGenre", async function(req, res){
  let genreInfo = await getGenreInfo(req.query.genreId); 
  res.render("updateGenre", {"genreInfo":genreInfo});
  
});

app.post("/updateGenre", async function(req, res){
  let rows = await updateGenre(req.body);
  
  let genreInfo = req.body;
  let message = "Genre WAS NOT updated!";
  if (rows.affectedRows > 0) {
      message= "Genre successfully updated!";
  }
  res.render("updateGenre", {"message":message, "genreInfo":genreInfo});
    
});
//UPDATE GENRES

//UPDATE DIRECTORS
app.get("/updateDirector", async function(req, res){
  let directorInfo = await getDirectorInfo(req.query.directorId); 
  res.render("updateDirector", {"directorInfo":directorInfo});
  
});

app.post("/updateDirector", async function(req, res){
  let rows = await updateDirector(req.body);
  
  let directorInfo = req.body;
  let message = "Director WAS NOT updated!";
  if (rows.affectedRows > 0) {
      message= "Director successfully updated!";
  }
  res.render("updateDirector", {"message":message, "directorInfo":directorInfo});
    
});
//UPDATE DIRECTORS

//DELETE MOVIE
app.get("/deleteMovie", async function(req, res){
 let rows = await deleteMovie(req.query.movieId);
 console.log(rows);
  let message = "Movie WAS NOT deleted!";
  if (rows.affectedRows > 0) {
    message= "Movie successfully deleted!";
  }    
    
    let movieList = await getMovieList();  
    let genreList = await getGenreList();
    let directorList = await getDirectorList();
    
     var totalMovies = 0;
     var avgRating = 0;
     var avgLength = 0;
     var avgPrice = 0;
     var totalDirectors = 0;
     var totalGenres = 0;

    movieList.forEach(function(movie){ 
        totalMovies++;
        avgRating += movie.imdbRating;
        avgLength += movie.length;
        avgPrice += movie.price;
    })
    
    directorList.forEach(function(director){ 
        totalDirectors++;
    })
    genreList.forEach(function(genre){ 
        totalGenres++;
    })
    
    avgRating = avgRating / totalMovies;
    avgLength = avgLength / totalMovies;
    avgPrice = avgPrice / totalMovies;

    res.render("adminPage", {"movieList":movieList, "genreList":genreList, "directorList":directorList, "totalMovies":totalMovies, "avgLength":avgLength, "avgRating":avgRating, "avgPrice":avgPrice, "totalDirectors":totalDirectors, "totalGenres":totalGenres});  
});
//DELETE MOVIE

//DELETE Genre
app.get("/deleteGenre", async function(req, res){
 let rows = await deleteGenre(req.query.genreId);
 console.log(rows);
  let message = "Genre WAS NOT deleted!";
  if (rows.affectedRows > 0) {
    message= "Genre successfully deleted!";
  }    
    
    let movieList = await getMovieList();  
    let genreList = await getGenreList();
    let directorList = await getDirectorList();
    
     var totalMovies = 0;
     var avgRating = 0;
     var avgLength = 0;
     var avgPrice = 0;
     var totalDirectors = 0;
     var totalGenres = 0;

    movieList.forEach(function(movie){ 
        totalMovies++;
        avgRating += movie.imdbRating;
        avgLength += movie.length;
        avgPrice += movie.price;
    })
    
    directorList.forEach(function(director){ 
        totalDirectors++;
    })
    genreList.forEach(function(genre){ 
        totalGenres++;
    })
    
    avgRating = avgRating / totalMovies;
    avgLength = avgLength / totalMovies;
    avgPrice = avgPrice / totalMovies;

    res.render("adminPage", {"movieList":movieList, "genreList":genreList, "directorList":directorList, "totalMovies":totalMovies, "avgLength":avgLength, "avgRating":avgRating, "avgPrice":avgPrice, "totalDirectors":totalDirectors, "totalGenres":totalGenres});  
});
//DELETE genre

//DELETE Director
app.get("/deleteDirector", async function(req, res){
 let rows = await deleteDirector(req.query.directorId);
 console.log(rows);
  let message = "Director WAS NOT deleted!";
  if (rows.affectedRows > 0) {
    message= "Director successfully deleted!";
  }    
    
    let movieList = await getMovieList();  
    let genreList = await getGenreList();
    let directorList = await getDirectorList();
    
     var totalMovies = 0;
     var avgRating = 0;
     var avgLength = 0;
     var avgPrice = 0;
     var totalDirectors = 0;
     var totalGenres = 0;

    movieList.forEach(function(movie){ 
        totalMovies++;
        avgRating += movie.imdbRating;
        avgLength += movie.length;
        avgPrice += movie.price;
    })
    
    directorList.forEach(function(director){ 
        totalDirectors++;
    })
    genreList.forEach(function(genre){ 
        totalGenres++;
    })
    
    avgRating = avgRating / totalMovies;
    avgLength = avgLength / totalMovies;
    avgPrice = avgPrice / totalMovies;

    res.render("adminPage", {"movieList":movieList, "genreList":genreList, "directorList":directorList, "totalMovies":totalMovies, "avgLength":avgLength, "avgRating":avgRating, "avgPrice":avgPrice, "totalDirectors":totalDirectors, "totalGenres":totalGenres});  
});
//DELETE Director

//adding new movies
app.get("/newMovie", function(req, res){
   res.render("newMovie");
});
app.post("/newMovie", async function(req, res){
  let rows = await insertMovie(req.body);
  console.log(rows);
  let message = "Movie WAS NOT added to the database!";
  if (rows.affectedRows > 0) {
      message= "Movie successfully added!";
  }
  res.render("newMovie", {"message":message});
    
});
//adding new movies

//adding new Directors
app.get("/newDirector", function(req, res){
   res.render("newDirector");
});
app.post("/newDirector", async function(req, res){
  let rows = await insertDirector(req.body);
  console.log(rows);
  let message = "Director WAS NOT added to the database!";
  if (rows.affectedRows > 0) {
      message= "Director successfully added!";
  }
  res.render("newDirector", {"message":message});
    
});
//adding new Directors

//adding new Genre
app.get("/newGenre", function(req, res){
   res.render("newGenre");
});

app.post("/newGenre", async function(req, res){
  let rows = await insertGenre(req.body);
  console.log(rows);
  let message = "Genre WAS NOT added to the database!";
  if (rows.affectedRows > 0) {
      message= "Genre successfully added!";
  }
  res.render("newGenre", {"message":message});
    
});
//adding new Genre

app.post("/loginProcess", function(req, res) {
    
    if ( req.body.username == "admin" && sha256(req.body.password) == "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b") {
       req.session.authenticated = true;
       res.send({"loginSuccess":true});
    } else {
       res.send(false);
    }
});

app.get("/cart", async function(req, res){
    
   res.render("cart", {"cart": CART});
});
    
app.get("/about", function(req, res){
   res.send("buy movies and stuff");
});

app.get("/catalog", async function(req, res){
    let movieList = await getMovieList();  
    let genreList = await getGenreList();
    let directorList = await getDirectorList();
    
    
    
    
    
    res.render("catalog", {"cart": CART, "movieList": movieList, "genreList": genreList, "directorList": directorList});
});

app.get("/results", async function(req, res){
    
    
    let movieList = await getMovieList();  
    let genreList = await getGenreList();
    let directorList = await getDirectorList();
    
    
    let results = await getMovieResults(req.query);

    res.render("catalog", {"cart": CART, "results": results});
});
    

app.get("/admin", async function(req, res){
//   console.log("authenticated: ", req.session.authenticated);    
   if (req.session.authenticated) { //if user hasn't authenticated, sending them to login screen
     let movieList = await getMovieList();  
     let genreList = await getGenreList();
     let directorList = await getDirectorList();
     
     var totalMovies = 0;
     var avgRating = 0;
     var avgLength = 0;
     var avgPrice = 0;
     var totalDirectors = 0;
     var totalGenres = 0;

    movieList.forEach(function(movie){ 
        totalMovies++;
        avgRating += movie.imdbRating;
        avgLength += movie.length;
        avgPrice += movie.price;
    })
    
    directorList.forEach(function(director){ 
        totalDirectors++;
    })
    genreList.forEach(function(genre){ 
        totalGenres++;
    })
    
    avgRating = avgRating / totalMovies;
    avgLength = avgLength / totalMovies;
    avgPrice = avgPrice / totalMovies;

       //console.log(authorList);
       res.render("adminPage", {"movieList":movieList, "genreList":genreList, "directorList":directorList, "totalMovies":totalMovies, "avgLength":avgLength, "avgRating":avgRating, "avgPrice":avgPrice, "totalDirectors":totalDirectors, "totalGenres":totalGenres});  
   }  else { 
       res.render("login"); 
   }
});
app.get("/everything", async function(req, res){
    let movieList = await getMovieList();
    
    res.render("everything", {"movieList":movieList, cart: CART});  

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
//UPDATE MOVIES
function getMovieInfo(movieId){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("getMovieInfo!");
        
           let sql = `SELECT *
                      FROM p_movie
                      WHERE movieId = ?`;
         
           conn.query(sql, [movieId], function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows[0]); //Query returns only ONE record
           });
        
        });//connect
    });//promise 
}

function updateMovie(body){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `UPDATE p_movie 
                      SET movieName = ?, 
                             price  = ?, 
                             length = ?,
                         imdbRating = ?,
                        description = ?,
                               year = ?,
                              image = ?
                     WHERE movieId = ?`;
        
           let params = [body.movieName, body.price, body.length, body.imdbRating, body.description, body.year, body.image, body.movieId];
        
           console.log(sql);
           
           conn.query(sql, params, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}
//UPDATE MOVIES

//UPDATE GENRES
function getGenreInfo(genreId){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;

           let sql = `SELECT *
                      FROM p_genre
                      WHERE genreId = ?`;
         
           conn.query(sql, [genreId], function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows[0]); //Query returns only ONE record
           });
        
        });//connect
    });//promise 
}

function updateGenre(body){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `UPDATE p_genre
                      SET genreName = ?, 
                  genreDescription  = ?
                     WHERE genreId = ?`;
        
           let params = [body.genreName, body.genreDescription, body.genreId];
        
           console.log(sql);
           
           conn.query(sql, params, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}
//UPDATE Genre

//UPDATE DIRECTOR
function getDirectorInfo(directorId){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;

           let sql = `SELECT *
                      FROM p_director
                      WHERE directorId = ?`;
         
           conn.query(sql, [directorId], function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows[0]); //Query returns only ONE record
           });
        
        });//connect
    });//promise 
}

function updateDirector(body){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `UPDATE p_director
                      SET firstName = ?, 
                          lastName  = ?
                     WHERE directorId = ?`;
        
           let params = [body.firstName, body.lastName, body.directorId];
        
           console.log(sql);
           
           conn.query(sql, params, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}
//UPDATE Genre

//DELETE Movie
function deleteMovie(movieId){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `DELETE FROM p_movie
                      WHERE movieId = ?`;
        
           conn.query(sql, [movieId], function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}
//DELETE MOVIE

//DELETE Genre
function deleteGenre(genreId){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `DELETE FROM p_genre
                      WHERE genreId = ?`;
        
           conn.query(sql, [genreId], function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}
//DELETE director

//DELETE director
function deleteDirector(directorId){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `DELETE FROM p_director
                      WHERE directorId = ?`;
        
           conn.query(sql, [directorId], function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}
//DELETE director

//ADDMOVIE
function insertMovie(body){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `INSERT INTO p_movie
                        (movieName, price, length, imdbRating, description, year, image)
                         VALUES (?,?,?,?,?,?,?)`;
        
           let params = [body.movieName, body.price, body.length, body.imdbRating, body.description, body.year, body.image];
        
           conn.query(sql, params, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}
//ADDMOVIE
//ADD Director
function insertDirector(body){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `INSERT INTO p_director
                        (firstName, lastName)
                         VALUES (?,?)`;
        
           let params = [body.firstName, body.lastName];
        
           conn.query(sql, params, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}
//ADD Director
//ADD Genre
function insertGenre(body){
   
   let conn = dbConnection();
    
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
        
           let sql = `INSERT INTO p_genre
                        (genreName, genreDescription)
                         VALUES (?,?)`;
        
           let params = [body.genreName, body.genreDescription];
        
           conn.query(sql, params, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
           });
        
        });//connect
    });//promise 
}
//ADD Genre

//MOVIELIST
function getMovieList(){
   let conn = dbConnection();
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
           if (err) throw err;
           console.log("Connected!");
      let sql = `SELECT movieName, description, price, length, imdbRating, year, image, movieId
                FROM p_movie
                ORDER BY movieId`;
                
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
        
      let sql = `SELECT genreName, genreDescription, genreId
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
        
      let sql = `SELECT firstName, lastName, directorId
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

// function getMovies(){
   
//   let conn = dbConnection();
    
//     return new Promise(function(resolve, reject){
//         conn.connect(function(err) {
//           if (err) throw err;
//           console.log("Connected!");
        
//       let sql = `SELECT firstName, lastName
//                 FROM p_director 
//                 ORDER BY directorId `;
                
//           conn.query(sql, function (err, rows, fields) {
//               if (err) throw err;
//               //res.send(rows);
//               conn.end();
//               resolve(rows);
//           });
        
//         });//connect
//     });//promise 
// }


function getMovieResults(query) {
    let title = query.title;
    console.log("Title " + query.title)
    
    let director = query.director;
    
    let ageRating = query.ageRating;
    
    let genre = query.genre;
    
    let order = query.order;
    
  let conn = dbConnection();
    return new Promise(function(resolve, reject){
        conn.connect(function(err) {
          if (err) throw err;
          console.log("Connected!");
           
                //  let sql = `SELECT movieName, description, price, length, imdbRating, year, image, movieId
                // FROM p_movie
                // ORDER BY movieId`;
                
              let params = [];
                
              let sql = `SELECT movieName, description, price, length, imdbRating, year, image, movieId
                        FROM p_movie  
                        WHERE
                        movieName LIKE '%${title}%'`;
                
        //           if (query.genre) { //user selected a category
        //       sql += ` AND genre = '${category}'`;
        //   }
        //   params.push(query.category);    
           
        //   if (query.sex) {
        //       sql += ` AND sex = '${sex}'`; 
        //   }
        //   params.push(query.sex);      
           
        //   if (query.author) {
        //       sql += ` AND firstName = '${author[0]}'`;
        //       sql += ` AND lastName = '${author[1]}'`;
        //   }
        //   params.push(query.author); 
        
        //   if (query.ageRating) {
        //       sql += ` AND ratedId = '${ageRating}'`;
        //   }
        //   params.push(query.ageRating);
          
          if (query.order) {
              switch(query.order) {
                  case "price_asc":
                      sql += ` AND ORDER BY price`;
                      break;
                  case "price_desc":
                      sql += ` AND ORDER BY price DESC`;
                      break;
                  case "imdb_asc":
                      sql += ` AND ORDER BY imdbRating`;
                      break;
                  case "imdb_desc":
                      sql += ` AND ORDER BY imdbRating DESC`;
                      break;
                  default:
                      break;
                
              }
          }
          params.push(query.order);  
                
          conn.query(sql, function (err, rows, fields) {
              if (err) throw err;
              //res.send(rows);
              conn.end();
              resolve(rows);
          });
        
        });//connect
    });//promise 
}




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