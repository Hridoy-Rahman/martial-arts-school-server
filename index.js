const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
                const userCollection = client.db("martialArts").collection("users")



                app.get('/users', async (req, res) => {
                    const result = await userCollection.find().toArray()
                    res.send(result)
                })


                app.post('/users', async (req, res) => {
                    const user = req.body;
                    const query = { email: user.email }
                    const existingUser = await userCollection.findOne(query);
                    if (existingUser) {
                        return
                    }
                    const result = await userCollection.insertOne(user);
                    res.send(result);

                })

                app.patch('/users/admin/:id', async (req, res) => {
                    const id = req.params.id;
                    const filter = { _id: new ObjectId(id) };
                    const updateUser = {
                        $set: {
                            role: 'admin'
                        }
                    }

                    const result = await userCollection.updateOne(filter, updateUser);
                    res.send(result)
                })
                app.patch('/users/instructor/:id', async (req, res) => {
                    const id = req.params.id;
                    const filter = { _id: new ObjectId(id) };
                    const updateUser = {
                        $set: {
                            role: 'instructor'
                        }
                    }

                    const result = await userCollection.updateOne(filter, updateUser);
                    res.send(result)
                })

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

                app.get('/selectedClasses', async (req, res) => {
                    const user_email = req.query.user_email; // Get the user email from the query parameter

                    try {
                        const result = await selectedCollection.find({ user_email: user_email }).toArray();
                        res.send(result);
                    } catch (error) {
                        console.error(error);
                        res.status(500).send('Internal Server Error');
                    }
                });

                app.post('/selectedClasses', async (req, res) => {
                    const selectedClass = req.body;
                    const result = await selectedCollection.insertOne(selectedClass);
                    res.json(result);

                });

                app.delete('/selectedClasses/:_id', async (req, res) => {
                    const id = req.params._id;
                    const query = { _id: new ObjectId(id) }
                    const result = await selectedCollection.deleteOne(query);

                    res.send(result);

                });

                app.get('/users/:email', async (req, res) => {
                    const email = req.params.email;
                    const query = { email: email }
                    const user = await userCollection.findOne(query);
                    const result = { admin: user?.role === 'admin' }
                    res.send(result);
                })






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