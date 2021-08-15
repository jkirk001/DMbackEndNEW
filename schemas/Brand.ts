import { list } from '@keystone-next/keystone/schema';
import { relationship, text, integer, virtual } from '@keystone-next/fields';
import { schema } from '@keystone-next/types';

export const Brand = list({
  fields: {
    name: text(),
    posts: relationship({
      ref: 'Post.brand',
      many: true,
    }),
    totalRating: integer({ defaultValue: 0 }),
    totalPosts: integer({ defaultValue: 0 }),
    //! virtual field to resolve avg
    avgRating: virtual({
      field: schema.field({
        type: schema.Float,
        async resolve(item) {
          return item.totalRating / item.totalPosts;
        },
      }),
    }),
  },
});
