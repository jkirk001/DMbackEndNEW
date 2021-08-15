import { createSchema } from '@keystone-next/keystone/schema';
import { User } from './schemas/User';
import { Post } from './schemas/Post';
import { Pheno } from './schemas/Pheno';
import { Type } from './schemas/Type';
import { Strain } from './schemas/Strain';
import { Brand } from './schemas/Brand';
import { BrandItemType } from './schemas/BrandItemType';
import { AromaTag } from './schemas/AromaTag';
import { TasteTag } from './schemas/TasteTag';

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
