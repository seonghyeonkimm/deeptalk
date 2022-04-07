import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useCatch, useLoaderData, useSubmit, useTransition } from "@remix-run/react";
import invariant from "tiny-invariant";
import { EyeIcon, ThumbUpIcon, AnnotationIcon, ClockIcon } from "@heroicons/react/solid";
import { ThumbUpIcon as OutlineThumbUpIcon } from "@heroicons/react/outline";
import dayjs from 'dayjs';
import cx from 'clsx';
import React from "react";

import {
  createTopicComment,
  getTopic,
  updateTopicCommentLikeCount,
  updateTopicLikeCount,
  updateTopicViewCount,
} from "~/models/topic.server";
import Modal from "~/components/Modal";

type LoaderData = {
  topic: NonNullable<Awaited<ReturnType<typeof getTopic>>>;
};

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.topicId, "noteId not found");

  const topic = await getTopic({ id: params.topicId });
  if (!topic) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ topic });
};

type ActionData = {
  errors?: {
    comment?: string;
    like?: string;
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.topicId, "topicId not found");

  const formData = await request.formData();
  const action = formData.get('action');

  switch (action) {
    case 'update-topic-view': {
      const result = await updateTopicViewCount({ id: params.topicId });
      return result;
    }

    case 'create-comment': {
      const body = formData.get("comment");

      if (typeof body !== "string" || body.length === 0) {
        return json<ActionData>(
          { errors: { comment: "댓글 내용을 입력해주세요." } },
          { status: 400 }
        );
      }

      const result = await createTopicComment({
        body,
        topicId: params.topicId,
      });

      return result;
    }

    case 'like-topic': {
      const result = await updateTopicLikeCount({
        id: params.topicId,
      });
      return result;
    }

    case 'like-comment': {
      const commentId = formData.get("commentId");
      invariant(commentId, "commentId not found");

      if (typeof commentId === 'string') {
        const result = await updateTopicCommentLikeCount({
          id: commentId,
        });
  
        return result;
      }

      return json<ActionData>(
        { errors: { like: "오류가 발생했습니다." } },
        { status: 400 }
      );
    }
  }
};

export default function TopicDetailsPage() {
  const submit = useSubmit();
  const { topic } = useLoaderData() as LoaderData;
  const transition = useTransition();
  const actionData = useActionData() as ActionData;
  const [likeHistory, setLikeHistory] = React.useState({ comments: {} as Record<string, number>, like: 0 });
  const [showLikeError, setShowLikeError] = React.useState(false);
  const commentFormRef = React.useRef<HTMLFormElement>(null);
  const isCommentAdding = transition.state === 'submitting'
    && transition.submission.formData.get('action') === 'create-comment';

  const handleClickTopicLike: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (likeHistory.like < 10) {
      setLikeHistory(prev => ({ ...prev, like: prev.like + 1 }))
      const formData = new FormData();
      formData.append('action', event.currentTarget.value);
      submit(formData, { replace: true, method: 'patch' });
      return;
    }

    setShowLikeError(true);
  }

  const handleClickCommentLike = (commentId: string): React.MouseEventHandler<HTMLButtonElement> => (event) => {
    if (!likeHistory.comments[commentId] || likeHistory.comments[commentId] < 10) {
      setLikeHistory(prev => ({
        ...prev,
        comments: {
          ...prev.comments,
          [commentId]: (prev.comments[commentId] ? prev.comments[commentId] + 1 : 1) 
        },
      }));

      const formData = new FormData();
      formData.append('action', event.currentTarget.value);
      formData.append('commentId', commentId);

      submit(formData, { replace: true, method: 'patch' })
      return;
    }

    setShowLikeError(true);
  }

  React.useEffect(() => {
    if (!isCommentAdding) {
      commentFormRef.current?.reset();
    }
  }, [isCommentAdding])

  React.useEffect(() => {
    const formData = new FormData();
    formData.append('action', 'update-topic-view');
    submit(formData, { method: 'patch', replace: true });
  }, [submit])

  return (
    <div className="prose max-w-none">
      <h2>{topic.title}</h2>
      <div className="flex flex-wrap gap-2">
        <div className="badge badge-outline">
          <ClockIcon className="mr-1 w-4" />
          <span>{dayjs(topic.createdAt).format("YYYY. MM. DD")}</span>
        </div>
        <div className="badge badge-outline">
          <ThumbUpIcon className="mr-1 w-4" />
          <span>좋아요 {topic.likeCount.toLocaleString()}</span>
        </div>
        <div className="badge badge-outline">
          <AnnotationIcon className="mr-1 w-4" />
          <span>댓글 {topic.comments.length.toLocaleString()}</span>
        </div>
        <div className="badge badge-outline">
          <EyeIcon className="mr-1 w-4" />
          <span>조회 {topic.viewCount.toLocaleString()}</span>
        </div>
      </div>
      <hr />
      <p>{topic.body}</p>
      <div>
        <button
          className="btn gap-2"
          name="action"
          value="like-topic"
          onClick={handleClickTopicLike}
        >
          <OutlineThumbUpIcon className="mr-1 w-4" />
          좋아요
        </button>
      </div>
      <hr />
      <Form method="post" ref={commentFormRef}>
        <div className="form-control relative w-full">
          <textarea
            name="comment"
            className={cx("textarea textarea-bordered h-24", {
              "textarea-error": Boolean(actionData?.errors?.comment),
            })}
            placeholder="댓글 내용을 작성해주세요."
          />
          <div className="absolute right-2 bottom-2">
            <button
              type="submit"
              className="btn btn-sm"
              name="action"
              value="create-comment"
            >
              작성하기
            </button>
          </div>
        </div>
      </Form>
      <div className="my-3 prose-hr:my-2">
        <h3>댓글 리스트</h3>
        {topic.comments.length === 0 && <p>아직 작성된 댓글이 없습니다.</p>}
        {topic.comments.map((comment, index) => {
          return (
            <div key={comment.id}>
              <p>{comment.body}</p>
              <button
                name="action"
                value="like-comment"
                className="btn btn-sm"
                onClick={handleClickCommentLike(comment.id)}
              >
                <OutlineThumbUpIcon className="mr-1 w-4" />
                댓글 좋아요
              </button>
              <div className="my-3 flex gap-2">
                <div className="badge badge-outline">
                  <ClockIcon className="mr-1 w-4" />
                  <span>
                    {dayjs(comment.createdAt).format("YYYY. MM. DD hh:mm:ss")}
                  </span>
                </div>
                <div className="badge badge-outline">
                  <ThumbUpIcon className="mr-1 w-4" />
                  <span>좋아요 {comment.likeCount.toLocaleString()}</span>
                </div>
              </div>
              {topic.comments.length - 1 > index && <hr />}
            </div>
          );
        })}
      </div>
      <Modal
        open={showLikeError}
        title="오류 발생"
        description="좋아요는 최대 10번까지 가능합니다."
        onClose={() => setShowLikeError(false)}
      />
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
