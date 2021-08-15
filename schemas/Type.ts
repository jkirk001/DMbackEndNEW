import { list } from '@keystone-next/keystone/schema';
import { relationship, text } from '@keystone-next/fields';

export const Type = list({
  fields: {
    name: text(),
    posts: relationship({
      ref: 'Post.type',
      many: true,
    }),
  },
});
