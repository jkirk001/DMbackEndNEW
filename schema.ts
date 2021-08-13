import { createSchema, list } from '@keystone-next/keystone/schema';
import {
  text,
  relationship,
  password,
  timestamp,
  select,
  integer,
  virtual,
} from '@keystone-next/fields';
import { document } from '@keystone-next/fields-document';
import { schema } from '@keystone-next/types';

export const lists = createSchema({
  User: list({
    ui: {
      listView: {
        initialColumns: ['name', 'posts'],
      },
    },
    fields: {
      name: text({ isRequired: true }),
      email: text({ isRequired: true, isUnique: true }),
      password: password({ isRequired: true }),
      posts: relationship({ ref: 'Post.author', many: true }),
    },
  }),
  Post: list({
    hooks: {
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

        const singleBrandItemType =
          await context.db.lists.BrandItemType.findMany({
            where: {
              brand: { id: updatedItem.brandId },
              strain: { id: updatedItem.strainId },
              type: { id: updatedItem.typeId },
            },
          });
        //?! got the numbers updating below, need to inject postID
        console.log(singleBrandItemType);

        const updateSBIT = await context.db.lists.BrandItemType.updateOne({
          id: singleBrandItemType[0].id,
          data: {
            totalRating:
              singleBrandItemType[0].totalRating + updatedItem.rating,
            totalPosts: singleBrandItemType[0].totalPosts + 1,
            //! posts: ..posts, newPost
          },
        });
        console.log(updateSBIT);
      },
    },
    fields: {
      brand: relationship({ ref: 'Brand.posts' }),
      strain: relationship({ ref: 'Strain.posts' }),
      type: relationship({ ref: 'Type.posts' }),
      pheno: relationship({ ref: 'Pheno.posts' }),
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
  }),

  AromaTag: list({
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
  }),
  TasteTag: list({
    ui: {
      isHidden: false,
    },
    fields: {
      name: text(),
      posts: relationship({
        ref: 'Post.tasteTags',
        many: true,
      }),
    },
  }),
  Brand: list({
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
  }),
  BrandItemType: list({
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
      totalPosts: integer({ defaultValue: 0 }),
      posts: relationship({
        ref: 'Post',
        many: true,
      }),
    },
  }),
  Strain: list({
    fields: {
      name: text(),
      posts: relationship({
        ref: 'Post.strain',
        many: true,
      }),
    },
  }),
  Type: list({
    fields: {
      name: text(),
      posts: relationship({
        ref: 'Post.type',
      }),
    },
  }),
  Pheno: list({
    fields: {
      name: text(),
      posts: relationship({
        ref: 'Post.pheno',
      }),
    },
  }),
});
