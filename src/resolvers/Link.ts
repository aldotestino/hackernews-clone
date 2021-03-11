import { Link } from '@prisma/client';
import { ResolverFunc } from '../utils';

const postedBy: ResolverFunc<Link> = ({ id }, _, { prisma }) => {
  return prisma.link.findUnique({
    where: {
      id
    }
  }).postedBy();
};

const votes: ResolverFunc<Link> = ({ id }, _, { prisma }) => {
  return prisma.link.findUnique({
    where: {
      id
    }
  }).votes();
};

export {
  postedBy,
  votes
};
