# nodejs-graphql-sqlite-app

Use: <br>
Docker

Run: <br>
docker build -t nodejs-graphql-sqlite-app . <br>
docker run -p 4000:4000 -d nodejs-graphql-sqlite-app <br>

Test:
```
mutation {
  createPost(input: { title: "New Post", content: "This is a new post." }) {
    id
    title
    content
  }
}
```
```
{
  posts {
    id
    title
    content
  }
}
```
