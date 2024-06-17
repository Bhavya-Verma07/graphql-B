const express = require("express"); //helps to create http reqs  ,acts as middlewares
const { ApolloServer } = require("@apollo/server"); //framework for running graphQL
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const { default: axios } = require("axios"); //to make api calls

async function StartgQL() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
     type Users {
        id: ID!
        name: String!
        username: String!
        email: String!
        phone : String!
    }
    type ToDo {
        id: ID!
        title : String!
        completed: Boolean
        users : Users
    }

    type Query{
      getTodos :  [ToDo]
      getAllUser : [Users]
      getAllUserById(id:ID!) : Users
  } 
    `,

    //   type Query{
    //     getTodos :  [ToDo]
    //     getAllUser : [Users]

    // }

    resolvers: {
      ToDo: {
        users: async (todo) =>
          (
            await axios.get(
              `https://jsonplaceholder.typicode.com/users/${todo.id}`
            )
          ).data,
      },

      Query: {
        getTodos: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/todos")).data,
        getAllUser: async () =>
          (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
        getAllUserById: async (parent, { id }) =>
          (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`))
            .data,
      },
    },
  });

  app.use(bodyParser.json());
  app.use(cors());

  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.listen(8000, () => console.log("Server is running at PORT 8000"));
}

StartgQL();
