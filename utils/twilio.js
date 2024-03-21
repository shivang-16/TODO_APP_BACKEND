import { client } from "../server.js";

const sendCall = async(user, phone) =>{
        client.calls.create({
            twiml: `<Response><Say>Hello ${user}, you have a task that is overdue. Please check your tasks.</Say></Response>`,
            to: phone,
            from: process.env.TWILIO_PHONE
          })
}

export default sendCall