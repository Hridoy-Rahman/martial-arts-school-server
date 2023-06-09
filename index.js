const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRETE_KEY}@cluster0.ey6jdyf.mongodb.net/?retryWrites=true&w=majority`;

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
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error

        const { MongoClient, ServerApiVersion } = require('mongodb');
        const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRETE_KEY}@cluster0.ey6jdyf.mongodb.net/?retryWrites=true&w=majority`;

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

                await client.connect();

                const classesCollection = client.db("martialArts").collection("classes")
                const instructorsCollection = client.db("martialArts").collection("instructors")
                const reviewsCollection = client.db("martialArts").collection("reviews")
                const selectedCollection = client.db("martialArts").collection("selectedClasses")

                app.get("/instructors", async (req, res) => {
                    const result = await instructorsCollection.find().toArray();
                    res.send(result);
                })


                app.get("/classes", async (req, res) => {
                    const result = await classesCollection.find().toArray();
                    res.send(result);
                })


                app.get("/reviews", async (req, res) => {
                    const result = await reviewsCollection.find().toArray();
                    res.send(result);
                })

                app.post('/selectedClasses', async(req, res) => {
                        const selectedClass = req.body;
                        const result = await selectedCollection.insertOne(selectedClass);
                        res.json(result);
                    
                });


                await client.db("admin").command({ ping: 1 });
                console.log("Pinged your deployment. You successfully connected to MongoDB!");
            } finally {

            }
        }
        run().catch(console.dir);

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server is running')
})
app.listen(port, () => {
    console.log(`Martial Arts server is running on port ${port}`)
})