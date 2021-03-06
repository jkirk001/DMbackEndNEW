import { list } from '@keystone-next/keystone/schema';
import { relationship, text } from '@keystone-next/fields';

export const Pheno = list({
  fields: {
    name: text(),
    posts: relationship({
      ref: 'Post.pheno',
      many: true,
    }),
  },
});
