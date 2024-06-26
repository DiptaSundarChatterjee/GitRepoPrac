const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function initDB() {
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
      profilePicture: "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg",
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
      imageUrl: "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg",
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
    
  } catch (error) {
    console.error(error);
  }
}

initDB();

app.get('/user-profile', async (req, res) => {
  try {
    const database = client.db('social_media');
    const usersCollection = database.collection('users');
    const postsCollection = database.collection('posts');
    const commentsCollection = database.collection('comments');

    const userProfile = await usersCollection.findOne({ username: "john_doe" });
    const userPosts = await postsCollection.find({ userId: userProfile._id }).sort({ createdAt: -1 }).toArray();
    const postComments = await commentsCollection.find({ postId: userPosts[0]._id }).sort({ createdAt: -1 }).toArray();

    // Construct HTML for profile picture (if exists)
    const profilePictureHtml = userProfile.profilePicture ? `<img src="${userProfile.profilePicture}" alt="Profile Picture">` : '';

    res.send(`
      <h1>User Profile</h1>
      <p>Username: ${userProfile.username}</p>
      <p>Email: ${userProfile.email}</p>
      <p>Bio: ${userProfile.bio}</p>
      ${profilePictureHtml}
      <h2>Posts</h2>
      <ul>
        ${userPosts.map(post => `
          <li>
            <p>${post.content}</p>
            ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Post Image">` : ''}
          </li>`).join('')}
      </ul>
      <h2>Comments on First Post</h2>
      <ul>
        ${postComments.map(comment => `<li>${comment.content}</li>`).join('')}
      </ul>
    `);
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
