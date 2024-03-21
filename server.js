import { app } from "./app.js";
import connectToDB from "./data/database.js";
import twilio from 'twilio'

const port = process.env.PORT;

connectToDB();

export const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
app.listen(port, () => {
  console.log(`server is running on ${port} port`);
});
