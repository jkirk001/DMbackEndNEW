import { createSchema } from '@keystone-next/keystone/schema';

import { User } from './schemas/User';
import { Post } from './schemas/Post';
import { Pheno } from './schemas/Pheno';

export const lists = createSchema({
  User,
  Post,
  TasteTag,
  AromaTag,
  BrandItemType,
  Brand,
  Strain,
  Pheno,
  Type,
});
