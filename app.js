const express = require("express");
const mysql = require("mysql");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));










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