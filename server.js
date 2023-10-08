import { app } from "./app.js";
import connectToDB from "./data/database.js";

const port = process.env.PORT;

connectToDB();
app.listen(port, () => {
  console.log(`server is running on ${port} port`);
});
