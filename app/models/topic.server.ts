import type { Note as Topic } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Topic } from "@prisma/client";

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

export function getTopic({
  id,
}: Pick<Topic, "id">) {
  return prisma.topic.findFirst({
    where: { id },
    include: {
      comments: true,
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
