const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xyrtm8p.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const tasksCollection = client.db('mcsTaskDB').collection('tasks');

    app.post('/tasks', async(req,res)=>{
        const task = req.body;
        const result = await tasksCollection.insertOne(task);
        res.send(result);
    })
    app.get('/tasks', async(req,res)=>{
        const result = await tasksCollection.find().toArray();
        res.send(result);
    })
    app.delete('/tasks/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    })
    app.put('/tasks/:id', async(req, res)=>{
      const id = req.params.id;
      const task = req.body;
      const filter = {_id: new ObjectId(id)}
      const updateDoc = {
        $set: {
          title: task.title,
          description: task.description,
          status: task.status
        }
      }
      const result = await tasksCollection.updateOne(filter, updateDoc);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('Server is running')
})
app.listen(port,()=>{
    console.log(`Server is running on port: ${port}`);
})