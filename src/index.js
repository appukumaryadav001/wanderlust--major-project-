import "dotenv/config";

import {app} from "./app.js";
import {connectDB} from "./db/config.db.js";

const port = process.env.PORT || 3000;

connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`Server Started at PORT ${port}`);
    })
}).catch((err)=>{
    console.log("MOONGO DB Connection failed !! ",err);
    
})