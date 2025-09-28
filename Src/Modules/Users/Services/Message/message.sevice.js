import User from "../../../../db/Models/user.model.js";
import Messages from "../../../../db/Models/messages.model.js";


export const sendMessagesService = async(req,res)=>{
    const {content} = req.body;
    const{receiverId} = req.params

    const user = await User.findById(receiverId)
    if (!user){
        return res.status(404).json({message:"User not found"})
    }
    
    const message = new Messages({
        content,
        receiver:receiverId
    })
    await message.save()
    
    res.status(200).json({message:"Message sent successfully",messageContent:message.content})    
}