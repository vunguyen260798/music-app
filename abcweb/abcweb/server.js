let express = require("express");
let app = express()

app.use(express.static(__dirname+"/"))
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})
app.listen(3000, () => {
    console.log("app is running on 3000...")
})
