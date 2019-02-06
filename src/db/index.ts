import * as lowdb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import * as jsonwebtoken from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { v4 as createUUID } from 'uuid';

// some salt for hashing the password
const hashSalt = '$2a$10$7h/0SQ4FXRG5eX3602o3/.aO.RYkxKuhGkzvIXHLUiMJlFt1P.6Pe';
// a secret for signing with jwt
const jwtSecret = 'oCDSF$#%$#%dfsvdgfd#@$3f';

// our database
const adapter = new FileSync('db.json');
const db = lowdb(adapter);

db.defaults({
  posts: [],
  users: [],
}).write();

// get a user's public data by it's id.
export async function getPublicUser(id: string): Promise<GQL.PublicUser> {
  const user = db.get('users')
        .find({ id })
        .value();
  return user;
}

// gets a user by it's password and email.
export async function getUserByPasswordAndEmail(input: GQL.InputLogin): Promise<GQL.User> {
  const { password, email } = input;
  const hash = bcrypt.hashSync(password, hashSalt);
  const user = db.get('users')
        .find({ email, password: hash })
        .value();
  return user;
}

// get a user by it's token
export async function getUserByToken(token: string): Promise<GQL.User> {
  const user = db.get('users')
        .find({ token })
        .value();
  return user;
}

export async function registerUser(userInput: GQL.InputLogin) {
  const { email, password } = userInput;
  const existingUser = db
        .get('users')
        .find({ email })
        .value();

  if (existingUser) {
    throw new Error('user already exist');
  }

  const id = createUUID();
  const hash = bcrypt.hashSync(password, hashSalt);
  const token = jsonwebtoken.sign(
        { id },
        jwtSecret,
    );

  const user = {
    ...userInput,
    id,
    token,
    password: hash,
  };

  db.get('users')
        .push(user)
        .write();
  return user;
}

// get all the posts of a user
export async function getPosts(): Promise<GQL.Post[]> {
  return db.get('posts')
        .value();
}

// create a new post
export async function createPost(
    postInput: GQL.InputCreatePost,
    userId: string,
): Promise<Partial<GQL.Post>> {
  const post = {
    userId,
    ...postInput,
    id: createUUID(),
    timestamp: new Date().toUTCString(),
  };
  db.get('posts')
        .push(post)
        .write();
  return post;
}
