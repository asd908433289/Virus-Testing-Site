var mysql = require("mysql");
var con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "aa41717,.",
    database: "virustest"
});

const express = require("express");
const app = express();
const url = require("url");
const { Console } = require("console");


app.get("/employee", (req, res) => {
    writeLogin(req, res);
});
app.get("/employeeHome", (req, res) => {
    writeHome(req, res);
});
app.get("/labtech", (req, res) => { writeLabLogin(req, res) });

app.get("/labHome", (req, res) => { writeLabHome(req, res); });

app.get("/testCollection", (req, res) => { writeTestCollection(req, res); });



app.get("/poolMapping", (req, res) => { writePoolMapping(req, res); });
app.get("/wellTesting", (req, res) => { writeWellTesting(req, res); });



port = process.env.PORT || 3000;

app.listen(port, () => { console.log("server started!"); });

function writeLabLogin(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    let query = url.parse(req.url, true).query;
    query.email = "";
    query.password = "";


    let html = `<!DOCTYPE html>
    <html lang = "en">
    <head>Lab Employee Login Page </head>
    <br></br>
    <body>
       
        <form  method="get">
        <p >Email:     <input type="text" name="email" value="" > </input> </p>
        <p>Password: <input type="text" name="password" value=""> </input> </p>
        <button type="submit" name="loginCollector" formaction="/testCollection"  >Login Collector </button>
        <br></br>
        <button type="submit" name="labLogin" formaction="/labHome" > Lab Login</button></form>
    </body>
    </html>`;
    res.write(html);
    res.end();
}

function writeLabHome(req, res) {
    let query = url.parse(req.url, true).query;

    let sql = `SELECT * FROM labemployee
                WHERE email= "`+ query.email + `"
                AND password= "`+ query.password + `"`;

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

    con.query(sql, function (err, result) {
        if (err) throw err;

        if (result.length <= 0) {
            html = `<!DOCTYPE html>
            <html lang = "en">
            <head>Error Page </head>
            <br></br>
            <body>
                <p> The account you just entered is not found. Please click back button to go back to the login page. </p>
                
                <br></br>
                <form action="/labtech" method="get"><button type="submit"> Back</button></form>
            </body>
            </html>`;
        }
        res.write(html);
        res.end();
    });




}





function writeTestCollection(req, res) {
    let query = url.parse(req.url, true).query;

    let currentEmail = query.email ? query.email : "";
    let currentPassword = query.password ? query.password : "";

    let employeeID = query.employeeID ? query.employeeID : "";
    let testBarCode = query.testBarCode ? query.testBarCode : "";

    if (employeeID.length > 0 && testBarCode.length > 0) {

        var currentDate = new Date();
        var currentTime = currentDate.getFullYear() + "-" + currentDate.getMonth() + "-" + currentDate.getDate() + " " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
        let currentLabID = query.loginCollector;

        let addSQL = `INSERT INTO employeetest (testBarcode, employeeID, collectionTime, collectedBy) VALUES ('` + testBarCode + `','` + employeeID + `','` + currentTime + `', '` + currentLabID + `')`;

        con.query(addSQL, function (err, result) {
            if (err) throw err;
        });

    }








    let sql = `SELECT * FROM labemployee
                WHERE email= "`+ currentEmail + `"
                AND password= "`+ currentPassword + `"`;







    let html = ``;

    con.query(sql, function (err, result) {
        if (err) throw err;

        if (result.length <= 0) {
            html = `<!DOCTYPE html>
            <html lang = "en">
            <head>Error Page </head>
            <br></br>
            <body>
                <p> The account you just entered is not found. Please click back button to go back to the login page. </p>
                
                <br></br>
                <form action="/labtech" method="get"><button type="submit"> Back</button></form>
            </body>
            </html>`;
            res.write(html);
            res.end();
        }
        else {

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
            <form action="/testCollection" method="get" >
                <input type="hidden" name="email" value="`+ currentEmail + `" ></input>
                <input type="hidden" name="password" value="`+ currentPassword + `" ></input>
                <input type="hidden" name="loginCollector" value="`+ result[0].labID + `"></input>
                <p >Employee ID:     <input type="text" name="employeeID" value="" > </input> </p>
                <p >Test Bar Code: <input type="text" name="testBarCode" value=""> </input> </p>
                <button type="submit"  >Add</button></form>
                <br></br>
                <form action="/testCollection" method="get">
                <input type="hidden" name="email" value="`+ currentEmail + `" ></input>
                <input type="hidden" name="password" value="`+ currentPassword + `" ></input>
                <input type="hidden" name="loginCollector" value="`+ result[0].labID + `"></input>
                <table>
                    <tr>
                        <th>Employee ID</th>
                        <th>Test Bar Code</th>
            
                    </tr>`;
            con.query(sql2, function (err, result2) {
                if (err) throw err;
                for (let item of result2) {


                    if (query[item.testBarcode] != null) {

                        let tempsql = `DELETE FROM employeetest WHERE testBarcode="` + item.testBarcode + `"`;
                        con.query(tempsql, function () { });
                    }
                    else {
                        html += `<tr>
                    <td><input  type="checkbox" name="`+ item.testBarcode + `"></input>` + item.employeeID + `</td>
                    <td>`+ item.testBarcode + `</td>
                </tr>`;
                    }

                }

                html += `</table>
                <button type="submit" name="delete" >Delete</button></form>
            </body>
            </html>`;
                res.write(html);
                res.end();
            });

        }

    });

}

function writePoolMapping(req, res) {
    let query = url.parse(req.url, true).query;

    let html = `<!DOCTYPE html>
    <html lang = "en">
    <head>Lab Employee Pool Mapping </head>
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
    <script>
    function addRows(){
           
        var t = document.getElementById("testBarCodeTable");
        
        var newR = t.insertRow(t.rows.length);
        var cell1 = newR.insertCell(0);
        cell1.innerHTML = \`<input type="text" name="testBarCode" > </input>\`;
        var newB = document.createElement("button");
        newB.innerHTML = "Delete";
        newB.onclick = function(){deleteRows(newR)};
        cell1.append(newB);
    
    
   
    
   
    }
    function deleteRows(value){
       
        value.remove();
    }

    function saveTable(){
        var s = document.getElementById("submitPoolForm");
        var t = document.getElementById("testBarCodeTable");
        for(let row of t.rows){
            var p = row.cells.item(0);
           
            var i =  document.createElement("input");
            i.type = "hidden";
            i.name = "t";
            i.name += p.firstElementChild.value;
            s.append(i);
        }
    }

    function edit(){
        var t = document.getElementById("editTable");
        for(let i=1;i<t.rows.length;i++){
            var c = t.rows[i].cells[0].firstElementChild;
            if(c.checked==true){
               var p = document.getElementById("poolBarCode");
                p.value = t.rows[i].cells[0].innerText;
                var t2 = document.getElementById("testBarCodeTable");
               
                while(t2.rows.length>0){
                    t2.rows[0].remove();
                }
               
           
                var k = t.rows[i].cells[1].innerText.split(", ");
                for(let item of k){
                    let newR = t2.insertRow(t2.rows.length);
                    let cell1 = newR.insertCell(0);
                    cell1.innerHTML = \`<input type="text" name="testBarCode" value="\`+item+\`" >  </input>\`;
                    var newB = document.createElement("button");
                    newB.innerHTML = "Delete";
                    newB.onclick = function(){deleteRows(newR)};
                    cell1.append(newB);
                   
                }
                
                return;
            }
        }
        

    }

</script>
    <body>
    <form action="/poolMapping" method="get" id="submitPoolForm" >
        <p>Pool Bar Code:     <input type="text" name="poolBarCode" id="poolBarCode" value="" > </input> </p>
        <p>Test Bar Code: 
        <table id="testBarCodeTable" name="testBarCodeTable">
        
</table>  </p>`;





    let sql3 = `SELECT * FROM poolmap GROUP BY poolBarCode`;
    con.query(sql3, function (err, result) {
        if (err) throw err;
        for (let item of result) {

            if (query[("p" + item.poolBarCode)] != null) {

                let sql4 = `DELETE FROM poolmap WHERE poolBarCode="` + item.poolBarCode + `"`;
                con.query(sql4, function (err2, result2) {
                    if (err2) throw err2;
                });
            }
        }



        if (query.poolBarCode != null && query.poolBarCode.length > 0) {

            let sql5 = `SELECT * FROM poolmap GROUP BY poolBarCode`;
            con.query(sql5, function (err5, result5) {
                if (err5) throw err5;
                for (let item5 of result5) {
                    if (item5.poolBarCode == query.poolBarCode) {
                        let sql6 = `DELETE FROM poolmap WHERE poolBarCode="` + query.poolBarCode + `"`;
                        con.query(sql6, function () { });
                    }
                }


                let sql = `SELECT testBarcode FROM employeetest`;
                con.query(sql, function (err, result) {
                    if (err) throw err;
                    for (let item of result) {


                        if (query[("t" + item.testBarcode)] != null) {

                            let sql2 = `INSERT INTO poolmap (testBarCode, poolBarCode) VALUES ('` + item.testBarcode + `','` + query.poolBarCode + `')`;
                            con.query(sql2, function (err2, result2) {
                                if (err2) throw err2;

                            });
                        }
                    }



                    updatePoolPage();


                });

            });




        }
        else { updatePoolPage(); }

        function updatePoolPage() {
            html += `
            <button type="button" onclick="addRows()">Add rows</button>
            <button type="submit" onclick="saveTable()"  >Submit pool</button></form>
             <br></br>
            <form action="/poolMapping" method="get">
            <table id="editTable">
                <tr>
                    <th>Pool Bar Code</th>
                    <th>Test Bar Codes</th>
                   
        
                </tr>`;
            let sql = `SELECT * FROM poolmap ORDER BY poolBarCode`;
            con.query(sql, function (err, result) {
                if (err) throw err;
                let previous = result[0].poolBarCode;
                html += `<tr><td><input type="checkbox" name="p` + result[0].poolBarCode + `"></input>` + result[0].poolBarCode + `</td>`;
                html += `<td> ` + result[0].testBarCode + ``;
                for (let i = 1; i < result.length; i++) {
                    if (result[i].poolBarCode == previous) {
                        html += `, ` + result[i].testBarCode + ``;
                    }
                    else {
                        html += `  </td>`;
                        html += `  </tr>`;
                        html += `<tr><td><input type="checkbox" name="p` + result[i].poolBarCode + `"></input>` + result[i].poolBarCode + `</td>`;
                        html += `<td>`;
                        html += result[i].testBarCode;

                        previous = result[i].poolBarCode;
                    }

                }
                html += `</table>
           <button type="button"  onclick="edit()" >Edit Pool</button>
            <button type="submit" name="delete" >Delete Pool</button></form>
        </body>
        </html>`;
                res.write(html);
                res.end();
            });

        }














    });











}

function writeWellTesting(req, res) {
    let query = url.parse(req.url, true).query;
    let wellBarCode=query.wellBarCode ?query.wellBarCode:"";
    let poolBarCode=query.poolBarCode ? query.poolBarCode:"";
    let result=query.result ? query.result:"";
   

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
        <form action="/welltesting" method="get" id="submitwelltesting" >
    
        <p>Well Bar Code:     <input type="text" name="wellBarCode" id="wellBarCode" value="" > </input> </p>
        <p>Pool Bar Code: <input type="text" name="poolBarCode" id="poolBarCode" value=""> </input> </p>
        <p>Result:  <select name="result">
            <option value="in progress">in progress</option>
            <option value="negative">negative</option>
            <option value="positive">positive</option>
           
        </select></p>
        <input type="submit" value="Add">
        <br></br>
        <br></br>
        </form>
        `;
        if(wellBarCode!=""&&poolBarCode!=""){
        
            let sql1=` UPDATE welltesting SET result = '`+result+`' WHERE (poolBarCode = '`+poolBarCode+`' and wellBarCode='`+wellBarCode+`');  `;
            con.query(sql1, function () { });
        }
       

        html+=
        `
        <form action="/welltesting" method="get" id="submitwelltesting" >
        <table id=well>
            <tr>
                <th>Well Bar Code</th>
                <th>Pool Bar Code</th>
                <th>Result</th>
    
            </tr>     `


               
       let sql = `SELECT * FROM welltesting `
       
    con.query(sql, function (err, result) {
        for (let item of result) {

               
            

            if (query[item.wellBarCode] != null) {

                let tempsql = `DELETE FROM welltesting WHERE wellBarcode="` + item.wellBarcode + `"`;
                con.query(tempsql, function () { });
            } else {
                html += `<td><input type="checkbox" name="` + item.wellBarCode + `">` + item.wellBarCode + `</input></td>
                    <td>`+ item.poolBarCode + `</td>
                    <td>`+ item.result + `</td>
                    </tr>`




            }
        }



        html += `
            
        </table>
        <button type="button" onclick="editx()"= >Edit</button>
        <button type="submit" name="delete" >Delete</button>
        </form>


        
    
    <script>
    function editx(){
        var t = document.getElementById("well");
        for(let i=1;i<t.rows.length;i++){
            var c = t.rows[i].cells[0].firstElementChild;
            if(c.checked==true){
                document.getElementById("wellBarCode").value = t.rows[i].cells[0].innerText;
                
                document.getElementById("poolBarCode").value = t.rows[i].cells[1].innerText;
                
            }
        }

                

        

    }
    </script>

    
    
    </body>
    </html>`;

        res.write(html);
        res.end();
    })




}













function writeLogin(req, res) {
    res.writeHead(200, { "Content-Type": "text/html" });
    let query = url.parse(req.url, true).query;
    query.email = "";
    query.password = "";
    let html = `<!DOCTYPE html>
    
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
        <form method="get"action="/employee">
    
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
function writeHome(req, res) {
    let query = url.parse(req.url, true).query;
    let Email = query.email
    let sql = `SELECT * FROM employee
                WHERE email= "`+ query.email + `"
                AND password= "`+ query.password + `"`;

    let html = ``



    con.query(sql, function (err, result) {
        if (err) throw err;

        if (result.length <= 0) {
            html = `<!DOCTYPE html>
            <html lang = "en">
            <head>Error Page </head>
            <br></br>
            <body>
                <p> The account: `+ query.email + ` or password: ` + query.password + ` is incorrect. </p>
                
                <br>
                <form action="/employee" method="get"><button type="submit"> Try Again</button></form>
            </body>
            </html>`;
            res.write(html);
        res.end();

        } else {
            let sql2 = `select(SELECT T.collectionTime FROM employeetest T, employee E where E.EmployeeID=  (SELECT employeeid from employee where email="` + Email + `")and E.EmployeeID=T.employeeId)as collectionTime,(select wt.result from welltesting wt,poolmap pm where wt.poolbarcode=(select PM.poolbarcode from poolmap pm,employeetest t where pm.poolbarcode=(select t.testBarcode from employeetest T, EMPLOYEE E 
                WHERE E.employeeID=(SELECT employeeid from employee where email="` + Email + `") and E.employeeID=t.employeeid) and pm.testbarcode=t.testbarcode) and wt.poolbarcode=pm.poolbarcode)as result  `;
            
            html = `<!DOCTYPE html>
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
                    <tr>`;
            con.query(sql2, function (err, result2) {
                

                for (let item of result2) {
                   
                   let t = item.collectionTime.toISOString().substr(0,10).split("-");
                   
                  
                    html += `<td>` +   t[1]  +`/` +t[2]+ `/`+t[0]+ `</td>
                    <td>`+item.result+`</td>
                    </tr>`
                }





                html += `</table>
                
            
                      </body>
            
            </html>`;
                res.write(html);
                res.end();

            });

            
        }

    });

}