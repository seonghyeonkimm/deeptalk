import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getTopic, Topic, updateTopicViewCount } from "~/models/topic.server";

type LoaderData = {
  topic: Topic;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.topicId, "noteId not found");

  await updateTopicViewCount({ id: params.topicId });
  const topic = await getTopic({ id: params.topicId });
  if (!topic) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ topic });
};

export default function TopicDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.topic.title}</h3>
      <p className="py-6">{data.topic.body}</p>
      <hr className="my-4" />
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
