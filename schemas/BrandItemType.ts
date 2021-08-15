import { list } from '@keystone-next/keystone/schema';
import { relationship, integer } from '@keystone-next/fields';

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
  },
});
