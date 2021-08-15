import { list } from '@keystone-next/keystone/schema';
import { relationship, text } from '@keystone-next/fields';

export const AromaTag = list({
  ui: {
    isHidden: false,
  },
  fields: {
    name: text(),
    posts: relationship({
      ref: 'Post.aromaTags',
      many: true,
    }),
  },
});
