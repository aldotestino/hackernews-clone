import { Link, User } from '@prisma/client';
import { ResolverFunc } from '../utils';

type Sort = 'asc' | 'desc';

interface Args<T> {
  filter?: string
  skip?: number
  take?: number
  orderBy?: T
}

const info = (): string => {
  return 'Hackernews clone graphql api!';
};

interface LinkOrderByInput {
  description?: Sort
  url?: Sort
  createdAt?: Sort
}

const feed: ResolverFunc<Args<LinkOrderByInput>> = async (_, { filter, skip, take, orderBy }, { prisma }) => {
  const where = filter ? {
    OR: [
      { description: { contains: filter } },
      { url: { contains: filter } }
    ]
  } : {};

  const links = await prisma.link.findMany({
    where,
    skip,
    take,
    orderBy
  });

  const count = await prisma.link.count({ where });

  return {
    links,
    count
  };
};

const link: ResolverFunc<Link> = (_, { id }, { prisma }) => {
  return prisma.link.findUnique({
    where: {
      id: Number(id)
    }
  });
};

interface UserOrderByInput {
  name?: Sort
  email?: Sort
}

const users: ResolverFunc<Args<UserOrderByInput>> = async (_, { filter, skip, take, orderBy }, { prisma }) => {
  const where = filter ? {
    OR: [
      { email: { contains: filter } },
      { name: { contains: filter } }
    ]
  } : {};

  const users = await prisma.user.findMany({
    where,
    skip,
    take,
    orderBy
  });

  const count = await prisma.user.count({ where });

  return {
    users,
    count
  };
};

const user: ResolverFunc<User> = (_, { id }, { prisma }) => {
  return prisma.user.findUnique({
    where: {
      id: Number(id)
    }
  });
};

export {
  info,
  feed,
  link,
  users,
  user
};
