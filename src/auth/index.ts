import { getUserByToken } from 'src/db';
import { Request, Response } from 'express';

// our context interface
export interface IContext {
  token?: string;
}

// handle all of the token magic here
function createContext(token: string): Promise<IContext> | IContext {
  return {
    token,
  };
}

// create context for requests
export function handleGraphQLContext(ctx: {connection?: any, req?: Request, res?: Response}) {
  const { req, connection } = ctx;
    // we already connected with a subscription
  if (connection) {
    return connection.context;
  }
  // check the request for the token
  const token = req.headers && req.headers.token;
  return createContext(token as string);
}

// handle authentication for socket connections
export function handleGraphQLSubscriptionContext(
    connectionParams: {authToken: string},
    webSocket: WebSocket,
) {
  const token = connectionParams.authToken;
  return createContext(token);
}

// check if the user is logged in or whatever you want to do to authenticate the user
export async function authenticateContext(context: IContext): Promise<GQL.User> {
  if (!context.token) {
        // too bad 👎
    throw new Error('user is not logged in');
  }
  const user = await getUserByToken(context.token);
  if (!user) {
        // too bad 👎
    throw new Error('invalid token');
  }
    // yay 👍
  return user;
}
