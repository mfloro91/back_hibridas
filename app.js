import express from "express"
import hotelRoutes from "./routes/hotelRoutes.js"
import serviceRoutes from "./routes/serviceRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"
import cors from "cors"

dotenv.config();
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Conexión a Mongo exitosa"))
.catch((err) => console.log("Error al conectar con Mongo", err));

const corsOptions = {
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization', 
};

const app = express();
app.use(cors(corsOptions));

const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use('/hotels', hotelRoutes)
app.use('/services', serviceRoutes)
app.use('/orders', orderRoutes)
app.use('/users', userRoutes)

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
