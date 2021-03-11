import { User, Link, Vote } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { APP_SECRET, ResolverFunc } from '../utils';

const signup: ResolverFunc<User> = async (_, args, { prisma }) => {
  const password = await bcrypt.hash(args.password, 10);
  const user = await prisma.user.create({
    data: {
      ...args,
      password
    }
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user
  };
};

const login: ResolverFunc<User> = async (_, args, { prisma }) => {
  const user = await prisma.user.findUnique({
    where: {
      email: args.email
    }
  });

  if (!user) {
    throw new Error('No such user found');
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    token,
    user
  };
};

const changeName: ResolverFunc<User> = (_, { name }, { prisma, userId }) => {
  if(!userId) {
    throw new Error('You have to be logged in to update your name');
  }

  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      name
    }
  });
};

const post: ResolverFunc<Link> = async (_, { url, description }, { prisma, pubsub, userId }) => {
  if(!userId) { 
    throw new Error('You have to be logged in to post a link');
  }

  const newLink = await prisma.link.create({
    data: {
      url,
      description,
      postedBy: {
        connect: {
          id: userId
        }
      }
    }
  });

  pubsub.publish('NEW_LINK', newLink);
  return newLink;
};

const deleteLink: ResolverFunc<Link> = async (_, { id }, { prisma, userId }) => {
  if(!userId) {
    throw new Error('You have to be logged in to delete a link');
  }

  const userIdOfLink = await prisma.link.findUnique({
    where: {
      id: Number(id)
    }
  }).postedBy().then(u => u?.id);

  if(userIdOfLink !== userId) {
    throw new Error('You have to be the owner of the link to delete it');
  }

  return prisma.link.delete({
    where: {
      id: Number(id)
    }
  });
};

const vote: ResolverFunc<Vote> = async (_, { linkId }, { userId, prisma, pubsub }) => {
  if(!userId) {
    throw new Error('You have to be logged in to vote');
  }

  const userIdOfLink = await prisma.link.findUnique({
    where: {
      id: Number(linkId)
    }
  }).postedBy().then(u => u?.id);

  if(userIdOfLink === userId) {
    throw new Error('You can\'t vote your own link');
  }

  const vote = await prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(linkId),
        userId: userId
      }
    }
  });

  if(vote) {
    throw new Error(`You already voted for link ${linkId}`);
  }

  const newVote = await prisma.vote.create({
    data: {
      user: {
        connect: {
          id: userId
        }
      },
      link: {
        connect: {
          id: Number(linkId)
        }
      }
    }
  });

  pubsub.publish('NEW_VOTE', newVote);
  return newVote;
};

export {
  signup,
  login,
  changeName,
  post,
  deleteLink,
  vote
};
