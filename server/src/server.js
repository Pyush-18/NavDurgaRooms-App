import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})
import express from "express"
import { connectDB } from "../db/index.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"
const app = express()
app.use(express.json())

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}
app.use(cors(corsOptions))
app.use(cookieParser())

const port = process.env.PORT

const __dirname = path.resolve()




import userRoute from "../routes/user.route.js"
import listingRoute from "../routes/listing.route.js"
app.use("/api/user", userRoute)
app.use("/api/listing", listingRoute)


app.use(express.static(path.join(__dirname, '/client/dist')))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'))
})



connectDB()
.then((data) => {
    console.log(data)
    app.listen(port, function(){
        console.log(`server is running on port ${port}`)
    })
})
.catch((error)=> {
    console.log(error)
})
