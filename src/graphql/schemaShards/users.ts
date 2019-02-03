import { getPublicUser, getUserByPasswordAndEmail, registerUser } from 'src/db';
import { gql } from 'apollo-server';

const typeDefs = gql`
    extend type Query {
        " login as a user "
        loginUser(input: InputLogin!): User
        " get a user's public data"
        getUser(id: ID!): PublicUser
    }

    extend type Mutation {
        " register a new user "
        registerUser(input: InputRegisterUser!): User
    }

    " used for logging in "
    input InputLogin {
        email: String!
        password: String!
    }

    " used for creating a new user "
    input InputRegisterUser {
        name: String!
        email: String!
        password: String!
    }

    " a type defining a user's public data "
    type PublicUser {
        id: ID
        name: String
        email: String
    }

    " a type defining a user  "
    type User {
        id: ID
        name: String
        email: String
        token: String
    }
`;

export default {
  resolvers: {
    Query: {
      // login
      loginUser: (root, { input }: GQL.QueryToLoginUserArgs) => getUserByPasswordAndEmail(input),
      // get a user
      getUser: (root, { id }:  GQL.QueryToGetUserArgs) => getPublicUser(id),
    },
    Mutation: {
      // register
      registerUser:  (root, { input }: GQL.MutationToRegisterUserArgs) => registerUser(input),
    },
  },
  typeDefs: [typeDefs],
};
