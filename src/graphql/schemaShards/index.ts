/**
 * This file merges all of the schemas that belong to different parts of the shards
 */
import users from 'src/graphql/schemaShards/users';
import posts from 'src/graphql/schemaShards/posts';
import { mergeRawSchemas } from 'src/graphql/utils/mergeRawSchemas';

export default mergeRawSchemas(
    users,
    posts,
);
