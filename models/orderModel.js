import mongoose, { Schema } from "mongoose";
import hotelModel from "./hotelModel.js";
import serviceModel from "./serviceModel.js";

const orderSchema = new mongoose.Schema(
  {
    hotel_id: {
      type: Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    service_id: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ['pendiente', 'en proceso', 'completado'],
    },
  },
  { timestamps: true }
);


export default mongoose.model('Order', orderSchema);