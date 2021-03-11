import { User } from '@prisma/client';
import { ResolverFunc } from '../utils';

const links: ResolverFunc<User> = ({ id }, _, { prisma }) => {
  return prisma.user.findUnique({
    where: {
      id
    }
  }).links();
};

export {
  links
};
