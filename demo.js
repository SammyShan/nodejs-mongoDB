/**
 * demo
 */
const fs = require('fs');


fs.readFile("demo.txt", "utf8", function(err, contents) {
    if(err) {
        errorHandler();
    }
    console.log(contents);
});

