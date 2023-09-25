# nodejs-graphql-sqlite-app

Use:
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
