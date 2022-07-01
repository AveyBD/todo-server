const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@endgame.0inm8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// main function
async function run() {
  try {
    await client.connect();
    console.log("connected to mongodb atlas successful");
    const taskCollection = client.db("ToDo").collection("tasks");

    // api
    app.get("/todo", async (req, res) => {
      const query = {};
      const cursor = taskCollection.find(query);
      const tasks = await cursor.toArray();
      res.send(tasks);
    });
  } finally {
  }
}

run().catch(console.dir);

// Root API
app.get("/", (req, res) => {
  res.send("I am working! No Disturb Please");
});

app.listen(port, () => {
  console.log(`Todo app server listening on port ${port}`);
});
