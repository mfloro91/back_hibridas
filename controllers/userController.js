import userModel from "../models/userModel.js";
import hotelModel from "../models/hotelModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();
const secretKey = process.env.JWT_SECRET;

// Funcion para crear nuevo usuario
export async function createUser(req, res) {
    try {
        const { hotel_id, name, userName, email, password } = req.body;

        if (!name || !userName || !email || !password) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        // Verificar si el hotel existe
        const hotel = await hotelModel.findById(hotel_id);
        if (!hotel) {
            return res.status(400).json({ error: "Hotel no encontrado" });
        }

        // Verificar si el email ya está registrado
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "El correo ya está registrado" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            hotel_id,
            name,
            userName,
            email,
            role: "user",
            password: hashedPassword
        });

        const newUser = await user.save();

        const { password: _, ...userWithoutPassword } = newUser.toObject();
        res.status(201).json(userWithoutPassword);

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Funcion para hacer login de usuarios

export async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email }).populate("hotel_id", "name");


        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" })
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            return res.status(401).json({ message: "Password incorrecto" })
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                hotel_id: user.hotel_id
            },
            secretKey,
            { expiresIn: '30min' }
        )

        res.status(200).json({
            token,
            id: user.id,
            role: user.role,
            hotel_id: user.hotel_id._id,
            hotelName: user.hotel_id.name,
            name: user.name
        });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Funcion para obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select('-password').populate('hotel_id', 'name country city');
        res.json(users)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// Funcion para que superadmin edite los roles

export const editRole = async (req, res) => {
    const { role } = req.body;

    if (!role || !["user", "admin", "superadmin", "staff"].includes(role)) {
        return res.status(400).send("El rol es obligatorio y debe ser uno de los siguientes: user, admin, superadmin, staff");
    }

    try {
        const userUpdated = await userModel.findByIdAndUpdate(req.params.id, { role }, { new: true });
        res.json(userUpdated)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

