const express = require("express"); 
const http = require("http");
const fs = require("fs");
const path = require("path");
const app = express(); 
const PORT = 8001; 

// Middleware to parse JSON data
app.use(express.json()); 


// Middleware to serve static files (CSS, images, etc.)
app.use(express.static("public"));

// Home route - Serve index.html
app.get("/", (req, res) => {
    const filePath = path.join(__dirname, "first_page.html");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Internal Server Error");
            return;
        }
        res.send(data);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
