import { list } from '@keystone-next/keystone/schema';
import { relationship, text } from '@keystone-next/fields';

export const Strain = list({
  fields: {
    name: text(),
    posts: relationship({
      ref: 'Post.strain',
      many: true,
    }),
  },
});
