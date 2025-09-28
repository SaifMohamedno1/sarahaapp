import mongoose from "mongoose";



 
const dbconnection = async()=>{
    try {
        await mongoose.connect('mongodb://localhost:27017/saraAAAhaapp')
        console.log('Db connected');
        
    } catch (error) {
        console.log('connection faild',error.message);
        
        
    }
}
export default dbconnection;