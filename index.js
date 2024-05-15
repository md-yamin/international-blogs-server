const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log(process.env.DB_PASS);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.brerg1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.brerg1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });


    const itemCollection = client.db('internationalBlogs').collection('blog');
    const commentCollection = client.db('internationalBlogs').collection('comments');
    const wishlistCollection = client.db('internationalBlogs').collection('wishlist');

    app.get('/blogs', async (req, res) => {
      const cursor = itemCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/blogs', async (req, res) => {
      const newBlog = req.body;
      const result = await itemCollection.insertOne(newBlog);
      res.send(result)
    })



    app.get('/comments', async (req, res) => {
      const cursor = commentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/comments', async (req, res) => {
      const newComment = req.body;
      const result = await commentCollection.insertOne(newComment);
      res.send(result)
    })

    app.get('/comments/:id', async (req, res) => {
      const id = req.params.id;
      const query = { blogId: id }
      const result = await commentCollection.find(query).toArray();
      res.send(result)
    })


    app.get('/wishlist', async (req, res) => {
      const cursor = wishlistCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/wishlist', async (req, res) => {
      const newWishlist = req.body;
      const result = await wishlistCollection.insertOne(newWishlist);
      res.send(result)
    })

    app.get('/wishlist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: id }
      const result = await wishlistCollection.findOne(query);
      res.send(result)
    })
    app.get('/wishlist/:email', async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { wishReq: email }
      console.log(query);
      const result = await wishlistCollection.find(query).toArray();
      res.send(result)
    })

  

    app.get('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await itemCollection.findOne(query);
      res.send(result)
    })
    app.delete('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await itemCollection.deleteOne(query);
      res.send(result)
    })
    app.patch('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedBlog = req.body;
      const updateDoc = {
        $set: {
          name: updatedBlog.name,
          title: updatedBlog.title,
          image: updatedBlog.image,
          email: updatedBlog.email,
          short_description: updatedBlog.short_description,
          detailed_description: updatedBlog.detailed_description,
          category: updatedBlog.category,
          userEmail: updatedBlog.userEmail,
          userImg: updatedBlog.userImg,
        }
      }
      const result = await itemCollection.updateOne(filter, updateDoc)
      res.send(result)
    })


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('server is running')
})

app.listen(port, () => {
  console.log(`International blogs running on port ${port}`);
})