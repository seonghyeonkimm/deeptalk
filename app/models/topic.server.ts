import type { Comment, Topic } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Topic, Comment } from "@prisma/client";

export function getTopic({
  id,
  page = 1,
  size = 10,
}: Pick<Topic, "id"> & { page?: number; size?: number; }) {
  return prisma.topic.findFirst({
    where: { id },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
      comments: {
        skip: (page - 1) * size,
        take: size,
        orderBy: {
          createdAt: 'desc',
        }
      },
    },
  });
}

export function getTopicListItems() {
  return prisma.topic.findMany({
    include: {
      _count: {
        select: {
          comments: true,
        }
      },
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        comments: {
          _count: 'desc',
        },
      },
      {
        likeCount: 'desc',
      },
      {
        viewCount: 'desc',
      },
    ]
  });
}

export function createTopic({
  body,
  title,
}: Pick<Topic, "body" | "title">) {
  return prisma.topic.create({
    data: {
      title,
      body,
      likeCount: 0,
      viewCount: 0,
    },
  });
}

export function updateTopicViewCount({
  id,
}: Pick<Topic, "id">) {
  return prisma.topic.update({
    where: {
      id,
    },
    data: {
      viewCount: {
        increment: 1,
      }
    }
  });
}

export function updateTopicLikeCount({
  id,
  count,
}: Pick<Topic, "id"> & { count?: number; }) {
  return prisma.topic.update({
    where: {
      id,
    },
    data: {
      likeCount: {
        increment: count ?? 1,
      }
    }
  });
}

export function createTopicComment({
  body,
  topicId,
}: Pick<Comment, 'body' | 'topicId'>) {
  return prisma.comment.create({
    data: {
      body,
      likeCount: 0,
      topic: {
        connect: {
          id: topicId,
        },
      }
    },
  })
}

export function getTopicComments({
  topicId,
  page = 1,
  size = 10,
}: Pick<Comment, 'topicId'> & { page?: number; size?: number }) {
  return prisma.comment.findMany({
    take: size,
    skip: size * page,
    where: {
      topicId,
    },
    orderBy: {
      createdAt: 'desc',
    }
  })
}

export function updateTopicCommentLikeCount({
  id,
  count,
}: Pick<Comment, "id"> & { count?: number; }) {
  return prisma.comment.update({
    where: {
      id,
    },
    data: {
      likeCount: {
        increment: count ?? 1,
      }
    }
  });
}
