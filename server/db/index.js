import mongoose from "mongoose"

export const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/NavDurgaRooms`)
        return `Mongodb connected with DB Host !! ${connectionInstance.connection.host}`
    } catch (error) {
        return `Mongodb disconnected ${error?.message}`   
    }
}