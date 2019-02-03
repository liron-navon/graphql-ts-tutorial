# Graphql-ts-tutorial

### Getting started

- Run in development mode with hot reloading `npm run dev`

- Build `npm run build`


- Test and watch `nps test.watch`

- Generate types and schemas `nps generateDefs`. do this after changes to the api to keep the types in sync.

### Project structure:
       .graphqlconfig - configuration for the graphql cli tool
       package-scripts.js - this is where all the nps scripts are
       
       test/ 
       src/ - |
             | - index.ts
             | - mocks.ts: mock data, replace it with a database layer for most production apps
             | - __typedefs/ - containes type definitions and graphql schema
             | - graphql/ - |
                            | - enums/: different enums should go here
                            | - scalarTypes/: used for validation and mutating input/output
                            | - schemaShards/: your resolvers and typeDefs should go here
                            | - helpers/: includes helper functions for manipulating and merging schemas 
                            | - schema.ts: this file merges all the different graphql parts and export an executable schema

### Api
The graphql api is self documented, you can access the documentations through the prisma playground after running the server, or by going through the typescript or full graphql schema in src/__typedefs.


### Example queries

```graphql
subscription{
  postCreated{
    id
    text
  }
}

mutation createPost($input: InputCreatePost!){
  createPost(input:$input){
    id
    text
    user{
      name
    }
  }
}

mutation createUser($input: InputCreateUser!){
  createUser(input: $input){
    id
    name
    email
    token
  }
}
```

After creating a new user, or querying `getPrivateUser` you will get a JWT token, with which you can use to authenticate, 
and you can post a new Post only if the user is authenticated.
