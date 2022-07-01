const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    // api to get all incomplete task
    app.get("/todo", async (req, res) => {
      const query = { complete: false };
      const cursor = taskCollection.find(query);
      const tasks = await cursor.toArray();
      const reverse = tasks.reverse();
      res.send(reverse);
    });

    // api to get all complete task
    app.get("/done", async (req, res) => {
      const query = { complete: true };
      const cursor = taskCollection.find(query);
      const tasks = await cursor.toArray();
      const reverse = tasks.reverse();
      res.send(reverse);
    });

    //  add task api
    app.post("/todo", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      return res.send({ success: true, result });
    });

    // complete task api
    app.put("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: { complete: true },
      };
      const result = await taskCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete task api
    app.delete("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });

    // update task api
    app.put("/update/:id", async (req, res) => {
        const id = req.params.id;
        const task = req.body 
        const filter = { _id: ObjectId(id) };
        const updateDoc = {
          $set: task,
        };
        const result = await taskCollection.updateOne(filter, updateDoc);
        res.send(result);
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
