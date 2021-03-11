import { Link, Vote } from '@prisma/client';
import { ResolverFunc } from '../utils';

const newLinkSubscriber: ResolverFunc<any> = (_, __, { pubsub, userId }) => {
  if(!userId) {
    throw new Error('You have to be logged in to receive live updated');
  }
  return pubsub.asyncIterator('NEW_LINK');
};

const newLink = {
  subscribe: newLinkSubscriber,
  resolve: (payload: Link): Link => payload
};

const newVoteSubscriber: ResolverFunc<any> = (_, __, { pubsub, userId }) => {
  if(!userId) {
    throw new Error('You have to be logged in to receive live updated');
  }
  return pubsub.asyncIterator('NEW_VOTE');
};

const newVote = {
  subscribe: newVoteSubscriber,
  resolve: (payload: Vote): Vote => payload
};

export {
  newLink,
  newVote
};
