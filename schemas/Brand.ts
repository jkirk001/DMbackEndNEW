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
    avgRating: virtual({
      field: schema.field({
        type: schema.Float,
        async resolve(item, args, context, info) {
          const total = await context.lists.Brand.findOne({
            where: { id: item.id },
            query: 'totalRating, totalPosts',
          });
          return total.totalRating / total.totalPosts;
        },
      }),
    }),
  },
});
