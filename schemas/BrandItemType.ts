import { list } from '@keystone-next/keystone/schema';
import { relationship, integer, virtual } from '@keystone-next/fields';
import { schema } from '@keystone-next/types';

export const BrandItemType = list({
  fields: {
    brand: relationship({
      ref: 'Brand',
    }),
    strain: relationship({
      ref: 'Strain',
    }),
    type: relationship({
      ref: 'Type',
    }),
    totalRating: integer({ defaultValue: 0 }),
    totalTHC: integer({ defaultValue: 0 }),
    totalTasteRating: integer({ defaultValue: 0 }),
    totalAromaRating: integer({ defaultValue: 0 }),
    totalPosts: integer({
      defaultValue: 0,
      /*hooks: {
          afterChange: async ({
            listKey,
            fieldPath,
            operation,
            originalInput,
            existingItem,
            updatedItem,
            context,
          }) => {
            console.log(context.db.lists.BrandItemType.findMany);
          },
        },*/
    }),
    posts: relationship({
      ref: 'Post.rel',
      many: true,
    }),
    avgRating: virtual({
      field: schema.field({
        type: schema.Float,
        async resolve(item, args, context, info) {
          console.log(item.totalRating);
          //! works, not sure why red underline
          return item.totalRating / item.totalPosts;
        },
      }),
    }),
  },
});
