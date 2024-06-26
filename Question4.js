const { MongoClient, ObjectId } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('social_media');
    
    const usersCollection = database.collection('users');
    const postsCollection = database.collection('posts');
    const commentsCollection = database.collection('comments');
    const feedCollection = database.collection('feed');

    await usersCollection.createIndex({ username: 1 }, { unique: true });
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await usersCollection.createIndex({ followers: 1 });
    await usersCollection.createIndex({ following: 1 });
    await postsCollection.createIndex({ userId: 1 });
    await postsCollection.createIndex({ createdAt: -1 });
    await commentsCollection.createIndex({ postId: 1 });
    await commentsCollection.createIndex({ userId: 1 });
    await feedCollection.createIndex({ userId: 1 });

    const userId = new ObjectId();
    const postId = new ObjectId();

    await usersCollection.insertOne({
      _id: userId,
      username: "john_doe",
      email: "john@example.com",
      password: "hashed_password",
      profilePicture: "http://example.com/profile.jpg",
      bio: "Software Developer",
      followers: [],
      following: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await postsCollection.insertOne({
      _id: postId,
      userId: userId,
      content: "This is my first post!",
      imageUrl: "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await commentsCollection.insertOne({
      postId: postId,
      userId: userId,
      content: "Great post!",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const followedUserId = new ObjectId(); 
    await usersCollection.updateOne(
      { _id: userId },
      { $push: { following: followedUserId } }
    );
    await usersCollection.updateOne(
      { _id: followedUserId },
      { $push: { followers: userId } }
    );

    const userProfile = await usersCollection.findOne({ username: "john_doe" });
    console.log("User Profile:", userProfile);
    const userPosts = await postsCollection.find({ userId: userId }).sort({ createdAt: -1 }).toArray();
    console.log("User Posts:", userPosts);
    const postComments = await commentsCollection.find({ postId: postId }).sort({ createdAt: -1 }).toArray();
    console.log("Post Comments:", postComments);

    await postsCollection.updateOne(
      { _id: postId },
      { $push: { likes: userId } }
    );

    const userFeed = await feedCollection.find({ userId: userId }).sort({ "activities.createdAt": -1 }).toArray();
    console.log("User Feed:", userFeed);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
