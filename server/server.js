import cors from "cors"
import path from "path"
import "dotenv/config"
import express from "express"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/authRoute.js"
import userRoutes from "./routes/userRoute.js"
import chatRoutes from "./routes/chatRoute.js"

import { connectDB } from "./config/db.js"

const app = express()
const PORT = process.env.PORT

const __dirname = path.resolve()

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")))
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"))
  })
}

app.listen(PORT, () => (connectDB(), console.log(`Server is running on port ${PORT}`)))
