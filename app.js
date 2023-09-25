const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType,
} = require('graphql');
const sqlite3 = require('sqlite3').verbose();

// Create and connect to an SQLite database
const db = new sqlite3.Database('mydatabase.db');

// Create a "posts" table in the database
db.serialize(() => {
  db.run(
    'CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)'
  );
});

// Define a GraphQL type for posts
const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

// Define a GraphQL input type for creating a new post
const PostInputType = new GraphQLInputObjectType({
  name: 'PostInput',
  fields: {
    title: { type: GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLNonNull(GraphQLString) },
  },
});

// Define a GraphQL schema
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => 'Hello, World!',
      },
      posts: {
        type: new GraphQLList(PostType),
        resolve: (_, args, context) => {
          return new Promise((resolve, reject) => {
            // Retrieve all posts from the database
            db.all('SELECT * FROM posts', (err, rows) => {
              if (err) {
                reject(err);
              } else {
                resolve(rows);
              }
            });
          });
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      createPost: {
        type: PostType,
        args: {
          input: { type: GraphQLNonNull(PostInputType) },
        },
        resolve: (_, { input }, context) => {
          return new Promise((resolve, reject) => {
            // Insert the new post into the database
            db.run(
              'INSERT INTO posts (title, content) VALUES (?, ?)',
              [input.title, input.content],
              function (err) {
                if (err) {
                  reject(err);
                } else {
                  resolve({
                    id: this.lastID,
                    title: input.title,
                    content: input.content,
                  });
                }
              }
            );
          });
        },
      },
    },
  }),
});

const app = express();

// Set up a route for GraphQL using express-graphql middleware
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true, // Enable GraphiQL for easy testing in browser
  })
);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/graphql`);
});
