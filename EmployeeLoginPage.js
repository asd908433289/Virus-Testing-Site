var mysql = require("mysql");

const express = require("express");
const app = express();
const url = require("url");

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "FYPEX123456",
	database: "virusTest",
	port:3306


});
app.get("/", (req, res) => {
	writeLogin(req,res);
});
app.get("/employeeHome", (req, res) => {
	writeHome(req,res);
});


port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log("server started!");
});

function writeLogin(req,res){
	res.writeHead(200,{"Content-Type":"text/html"});
    let query =url.parse(req.url,true).query;
    query.email = "";
    query.password = "";
    let html=`<!DOCTYPE html>
    
    <html>
    
    <head>
        <style type="text/css">
            label {
                display: inline-block;
                width: 140px;
                text-align: middle;
            }
    
    
        </style>
    
    
    </head>
    
    <body>
        <p>Employee Login Page for Results</p>
        <form method="get"action="/">
    
            <label >Email:</label>
            <input name="email" type="text"></input>
            <br>
            <label >Password:</label>
            <input name="password" type="text"></input>
            <br>
         
            
    
       
       
            <button type="submit" id="login" formaction="employeeHome">login</button>
        </form>
    
    
    </body>
    
    </html>`
    res.write(html);
    res.end();
}
function writeHome(req,res){
    let query=url.parse(req.url,true).query;
    let sql = `SELECT * FROM employee
                WHERE email= "`+query.email+`"
                AND password= "`+query.password+`"`;
    let html=`<!DOCTYPE html>
    <html>
    
    <head>
        <p>Employee Home</p>
        <style>
            table,th,td{
                border: 1px solid black;
            }
            table{
                border-collapse:collapse;
            }
        
            </style>
       
    
    </head>
    
    <body>
        <table>
            <tr>
                <th >Collection Date</th>
                <th > Result</th>
                
            </tr>
            <tr>
                <td>Collection date</td>
                <td>Result</td>
                
            </tr>    
        </table>
    
    
    
    
    </body>
    
    </html>`
   

    con.query(sql,function(err,result){
        if (err) throw err;
        
        if(result.length<=0){
            html = `<!DOCTYPE html>
            <html lang = "en">
            <head>Error Page </head>
            <br></br>
            <body>
                <p> The account: `+query.email+` or password: `+query.password+` is incorrect. </p>
                
                <br>
                <form action="/" method="get"><button type="submit"> Try Again</button></form>
            </body>
            </html>`;
        }
        res.write( html);
        res.end();
        
    });

}
    