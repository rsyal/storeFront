var mysql = require("mysql");
var inquirer = require("inquirer");


var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon",
 
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the buyProduct function after the connection is made to prompt the user
    buyProduct();
  });

  // function to buy product

function buyProduct() {
  connection.query('SELECT * FROM products', function(err, res){
  

    // display products and price to user
    for (var i = 0; i < res.length; i++) {
        console.log('Item: ' + res[i].name + ' | Price: ' + res[i].price);
    }

  inquirer.prompt([

    // Here we give the user a list to choose from.
    {
      name: "choice",
      type: "rawlist",
      message: "What do you want to buy?",
      choices: function(value) {
        var choiceArray = [];
        for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].name);
        }
        return choiceArray;
      }
    },

    {
      name: "howMany",
      type: "input",
      message: "How many units do you want to buy?",
      choices: ["1", "2", "3", "4", "5"]
    }
  ])

  .then(function(answer) {
    // grabs the entire object for the product the user chose
    for (var i = 0; i < res.length; i++) {
        if (res[i].name == answer.choice) {
          var item = res[i];
        }
    }
        //  console.log (item);
        
         
        //  Update stock

         var updateStock = parseInt(item.quantity) - parseInt(answer.howMany);
    //     //  Calculate if enough in stock
    if (parseInt (item.quantity) < parseInt (answer.howMany)) {
      console.log ("Insufficient quantity!");
    } else {
      connection.query("UPDATE products SET ? WHERE ?", 
      [{quantity: updateStock}, {id: item.id}], function(err, res) {
        console.log("Purchase successful!");
      });
    }

}); 
                 
}); 

} 

