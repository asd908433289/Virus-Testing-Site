var mysql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user:"root",
    password:"aa41717,.",
    database:"virustest"
});

const express = require("express");
const app = express();
const url = require("url");
const { Console } = require("console");

app.get("/",(req,res)=>{writeLabLogin(req,res)});

app.get("/labHome",(req,res)=>{writeLabHome(req,res);});

app.get("/testCollection",(req,res)=>{writeTestCollection(req,res);});



port = process.env.PORT || 3000;

app.listen(port, ()=> {console.log("server started!");});

function writeLabLogin(req, res){
    res.writeHead(200,{"Content-Type": "text/html"});
    let query = url.parse(req.url,true).query;
    query.email = "";
    query.password = "";


    let html = `<!DOCTYPE html>
    <html lang = "en">
    <head>Lab Employee Login Page </head>
    <br></br>
    <body>
       
        <form  method="get">
        <p>Email:     <input type="text" name="email" value="" > </input> </p>
        <p>Password: <input type="text" name="password" value=""> </input> </p>
        <button type="submit" name="loginCollector" formaction="/testCollection"  >Login Collector </button>
        <br></br>
        <button type="submit" name="labLogin" formaction="/labHome" > Lab Login</button></form>
    </body>
    </html>`;
    res.write( html);
    res.end();
}

function writeLabHome(req, res){
    let query = url.parse(req.url,true).query;

    let sql = `SELECT * FROM labemployee
                WHERE email= "`+ query.email +`"
                AND password= "`+query.password+`"`;

    let html = "<!DOCTYPE html>\
                <html lang = \"en\">\
                <head>Lab Employee Home Page </head>\
                <br></br>\
                <body>\
                    \
                    <button>Pool Mapping </button>\
                    <br></br>\
                    <button> Well Testing</button>\
                </body>\
                </html>";
    
    con.query(sql,function(err,result){
        if (err) throw err;
        
        if(result.length<=0){
            html = `<!DOCTYPE html>
            <html lang = "en">
            <head>Error Page </head>
            <br></br>
            <body>
                <p> The account you just entered is not found. Please click back button to go back to the login page. </p>
                
                <br></br>
                <form action="/" method="get"><button type="submit"> Back</button></form>
            </body>
            </html>`;
        }
        res.write( html);
        res.end();
    });

    

   
}

function writeTestCollection(req, res){
    let query = url.parse(req.url,true).query;

    let sql = `SELECT * FROM labemployee
                WHERE email= "`+ query.email +`"
                AND password= "`+query.password+`"`;

    

    let html = `<!DOCTYPE html>
    <html lang = "en">
    <head>Lab Employee Test Collection </head>
    <br></br>
    <style>
         td, th {
                border: 1px solid black;
         }
         table {
                border-collapse: collapse;
                width: 100%
            }
    </style>
    <body>
    
        <p>Employee ID:     <input type="text" name="employeeID" value="" > </input> </p>
        <p>Test Bar Code: <input type="text" name="testBarCode" value=""> </input> </p>
        <form action="/testCollection" method="get" ><button type="submit" name="loginCollector"  >Add</button></form>
        <br></br>
        <table>
            <tr>
                <th>Employee ID</th>
                <th>Test Bar Code</th>
    
            </tr>
            <tr>
                <td><input type="checkbox" name="name of current employeeid"></input></td>
                <td></td>
            </tr>
        </table>
        <form action="/delete" method="get"><button type="submit" name="delete" >Delete</button></form>
    </body>
    </html>`;

    con.query(sql,function(err,result){
        if (err) throw err;
        
        if(result.length<=0){
            html = `<!DOCTYPE html>
            <html lang = "en">
            <head>Error Page </head>
            <br></br>
            <body>
                <p> The account you just entered is not found. Please click back button to go back to the login page. </p>
                
                <br></br>
                <form action="/" method="get"><button type="submit"> Back</button></form>
            </body>
            </html>`;
        }
        res.write( html);
        res.end();
    });

}