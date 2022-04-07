import type { Comment, Topic } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Topic, Comment } from "@prisma/client";

export function getTopic({
  id,
}: Pick<Topic, "id">) {
  return prisma.topic.findFirst({
    where: { id },
    include: {
      comments: {
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
      {
        createdAt: 'desc',
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
