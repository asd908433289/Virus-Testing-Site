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
app.get("/poolMapping",(req,res)=>{writePoolMapping(req,res);});
app.get("/wellTesting",(req,res)=>{writeWellTesting(req,res);});



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

    let html = `<!DOCTYPE html>
    <html lang = "en">
    <head>Lab Employee Home Page </head>
    <br></br>
    <body>
        <form method="get">
             <button type="submit" formaction="/poolMapping">Pool Mapping </button>
            <br></br>
            <button type="submit" formaction="/wellTesting"> Well Testing</button><form>
       
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

function writeTestCollection(req, res){
    let query = url.parse(req.url,true).query;

    let sql = `SELECT * FROM labemployee
                WHERE email= "`+ query.email +`"
                AND password= "`+query.password+`"`;

    

    let html = ``;

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
            res.write( html);
            res.end();
        }
        else{
            let sql2 = `SELECT * FROM employeetest`;
            html = `<!DOCTYPE html>
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
            
                    </tr>`;
            con.query(sql2,function(err,result2){
                for(let item of result2){
                    html += `<tr>
                    <td><input type="checkbox" name="name of current employeeid"></input>`+item.employeeID+`</td>
                    <td>`+item.testBarcode+`</td>
                </tr>`;
                }

                html += `</table>
                <form action="/delete" method="get"><button type="submit" name="delete" >Delete</button></form>
            </body>
            </html>`;
            res.write( html);
            res.end();
            });
          
        }
        
    });

}

function writePoolMapping(req, res){
    let query = url.parse(req.url,true).query;

    let html =`<!DOCTYPE html>
    <html>
    
    <head>
        <p>Pool Mapping</p>
        <style type="text/css">
            label {
                display: inline-block;
                width: 140px;
                text-align: middle;
            }
        </style>
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
        <form method="get" action="/Map">
    
            <label>Pool barcode:</label>
            <input name="pool" type="text"></input>
            <br>
    
            <label>test barcodes:</label>
            
            <input name="test1" type="text"></input>
        
           
            <button type="button" onclick="Delete()">Delete</button>
        
            
            <br>
    
            <button type="button" onclick="Add()">Add more rows</button>
    
            <br>
            <input type="submit" value="Submit pool" id="login">
    
    
            <table>
                <tr>
                    <th></th>
                    <th>Test Barcodes</th>
                </tr>
                <tr>
                    <td>
                        <input type="checkbox" name ="name">
                    </td>
                    <td></td>
                </tr>
            </table>
            <script>
                function Add(){
                
                }
                
                
            </script>
    
    
    
    
    
    
        </form>
    
    
    </body>
    
    </html>`;
    res.write(html);
    res.end();

}

function writeWellTesting(req,res){
    let query = url.parse(req.url,true).query;

    let html = `<!DOCTYPE html>
    <html lang = "en">
    <head>Lab Employee Well Testing </head>
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
    
        <p>Well Bar Code:     <input type="text" name="wellBarCode" value="" > </input> </p>
        <p>Poll Bar Code: <input type="text" name="pollBarCode" value=""> </input> </p>
        <p>Result:  <select name="result">
            <option value="inProgress">In Progress</option>
            <option value="negative">Negative</option>
            <option value="positive">Positive</option>
           
        </select></p>
        <form action="/wellTesting" method="get" ><button type="submit" name="wellTesting"  >Add</button></form>
        <br></br>
        <table>
            <tr>
                <th>Well Bar Code</th>
                <th>Poll Bar Code</th>
                <th>Result</th>
    
            </tr>
            <tr>
                <td><input type="checkbox" name="current well and poll bar code"></input></td>
                <td></td>
                <td></td>
            </tr>
        </table>
        <form action="/edit" method="get"><button type="submit" name="edit" >Edit</button></form>
        <form action="/delete" method="get"><button type="submit" name="delete" >Delete</button></form>
    </body>
    </html>`;

    res.write(html);
    res.end();
}