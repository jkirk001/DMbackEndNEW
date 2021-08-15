import { list } from '@keystone-next/keystone/schema';
import {
  relationship,
  timestamp,
  select,
  integer,
} from '@keystone-next/fields';
import { document } from '@keystone-next/fields-document';

export const Post = list({
  //!hooks for Posts
  hooks: {
    //?after created
    afterChange: async ({ updatedItem, context }) => {
      const singleBrand = await context.db.lists.Brand.findOne({
        where: { id: updatedItem.brandId },
      });

      const brandUpdate = await context.db.lists.Brand.updateOne({
        id: updatedItem.brandId,
        data: {
          totalRating: singleBrand.totalRating + updatedItem.rating,
          totalPosts: singleBrand.totalPosts + 1,
        },
      });

      const singleBrandItemType = await context.db.lists.BrandItemType.findMany(
        {
          where: {
            brand: { id: updatedItem.brandId },
            strain: { id: updatedItem.strainId },
            type: { id: updatedItem.typeId },
          },
        }
      );
      //?! got the numbers updating below, need to inject postID

      const updateSBIT = await context.db.lists.BrandItemType.updateOne({
        id: singleBrandItemType[0].id,
        data: {
          totalRating: singleBrandItemType[0].totalRating + updatedItem.rating,
          totalPosts: singleBrandItemType[0].totalPosts + 1,
          //! posts: ..posts, newPost
        },
      });
    },
  },
  fields: {
    brand: relationship({ ref: 'Brand.posts' }),
    strain: relationship({ ref: 'Strain.posts' }),
    type: relationship({ ref: 'Type.posts' }),
    pheno: relationship({ ref: 'Pheno.posts' }),
    rel: relationship({
      ref: 'BrandItemType.posts',
      defaultValue: async ({ context, originalInput }) => {
        //! Find the BrandItemId data object that matches post
        const BrandItemTypeId = await context.db.lists.BrandItemType.findMany({
          where: {
            brand: { id: originalInput.brand.connect.id },
            strain: { id: originalInput.strain.connect.id },
            type: { id: originalInput.type.connect.id },
          },
        });
        //! if it exists, return BIT ID as default association
        if (BrandItemTypeId.length > 0) {
          return { connect: { id: BrandItemTypeId[0].id } };
          //! if it doesnt exist, make it, return its ID
        } else {
          const newItem = await context.db.lists.BrandItemType.createOne({
            data: {
              brand: { connect: { id: originalInput.brand.connect.id } },
              strain: { connect: { id: originalInput.strain.connect.id } },
              type: { connect: { id: originalInput.type.connect.id } },
            },
          });

          return { connect: { id: newItem.id } };
        }
      },
    }),
    rating: integer(),
    tasteRating: integer(),
    aromaRating: integer(),
    thc: integer(),
    status: select({
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      ui: {
        displayMode: 'segmented-control',
      },
    }),
    content: document({
      formatting: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
        [2, 1],
        [1, 2],
        [1, 2, 1],
      ],
      links: true,
      dividers: true,
    }),
    publishDate: timestamp(),
    author: relationship({
      ref: 'User.posts',
      ui: {
        displayMode: 'cards',
        cardFields: ['name', 'email'],
        inlineEdit: { fields: ['name', 'email'] },
        linkToItem: true,
        inlineCreate: { fields: ['name', 'email'] },
      },
    }),

    aromaTags: relationship({
      ref: 'AromaTag.posts',
      ui: {
        displayMode: 'cards',
        cardFields: ['name'],
        inlineEdit: { fields: ['name'] },
        linkToItem: true,
        inlineConnect: true,
        inlineCreate: { fields: ['name'] },
      },
      many: true,
    }),
    tasteTags: relationship({
      ref: 'TasteTag.posts',
      ui: {
        displayMode: 'cards',
        cardFields: ['name'],
        inlineEdit: { fields: ['name'] },
        linkToItem: true,
        inlineConnect: true,
        inlineCreate: { fields: ['name'] },
      },
      many: true,
    }),
  },
});
