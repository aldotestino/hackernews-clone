import { Vote } from '@prisma/client';
import { ResolverFunc } from '../utils';

const link: ResolverFunc<Vote> = ({ id }, _, { prisma }) => {
  return prisma.vote.findUnique({
    where: {
      id
    }
  }).link();
};

const user: ResolverFunc<Vote> = ({ id }, _, { prisma }) => {
  return prisma.vote.findUnique({
    where: {
      id
    }
  }).user();
};

export {
  link,
  user
};