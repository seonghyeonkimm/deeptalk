import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import dayjs from 'dayjs';

import TopicCard from "~/components/TopicCard";
import { getTopicListItems } from "~/models/topic.server";

type LoaderData = {
  topicListItems: Awaited<ReturnType<typeof getTopicListItems>>;
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({ topicListItems: await getTopicListItems() });
};

export default function TopicIndexPage() {
  const { topicListItems } = useLoaderData() as LoaderData;

  return (
    <div>
      <div className="hero py-5 bg-base-200 mb-4">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">환영합니다.</h1>
            <p className="py-6">
              로그인하지 마세요. 딥톡하세요.
            </p>
            <Link to="/topics/new" className="btn btn-primary">토픽 생성하기</Link>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-8">
        {topicListItems.map((item) => {
          return (
            <Link to={`/topics/${item.id}`} key={item.id}>
              <TopicCard
                title={item.title}
                body={item.body}
                likeCount={item.likeCount}
                viewCount={item.viewCount}
                commentCount={item._count.comments}
                isNew={dayjs(item.createdAt).isBefore(dayjs().endOf("date"))}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
