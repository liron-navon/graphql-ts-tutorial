import { createPost, getPosts, getPublicUser } from 'src/db';
import { gql } from 'apollo-server';
import { pubsub } from 'src/graphql/subscriptionManager';
import {authenticateContext} from 'src/auth';

const typeDefs = gql`
    extend type Query {
        " get all posts "
        getPosts: [Post]
    }

    extend type Mutation {
        " create a new post "
        createPost(input: InputCreatePost!): Post
    }

    extend type Subscription {
        " called when a new post is created "
        postCreated: Post
    }

    " input to create a new post "
    input InputCreatePost {
        text: String
    }

    type Post {
        id: ID
        userId: ID
        text: String
        user: PublicUser
        timestamp: String
    }
`;

export default {
  resolvers: {
    Query: {
      // get a user
      getPosts: () => getPosts(),
    },
    Mutation: {
      // create a post
      createPost:  async (root, { input }: GQL.MutationToCreatePostArgs, context) => {
        // get the user from the context
        const user = await authenticateContext(context);
        // create a new post in the database
        const post = await createPost(input, user.id);
        // publish the post to the subscribers
        pubsub.publish('postCreated', {
          postCreated: post,
        });
        return post;
      },
    },
    Subscription: {
      postCreated: {
        subscribe: (root, args, context) => {
          return pubsub.asyncIterator('postCreated');
        },
      },
    },
    Post: {
      user: (post: Partial<GQL.Post>) => getPublicUser(post.userId),
    },
  },
  typeDefs: [typeDefs],
};
