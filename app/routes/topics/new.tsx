import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import * as React from "react";
import cx from 'clsx';

import { createTopic } from "~/models/topic.server";

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>(
      { errors: { title: "제목을 입력해주세요." } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json<ActionData>(
      { errors: { body: "본문을 입력해주세요." } },
      { status: 400 }
    );
  }

  const topicId = await createTopic({ title, body });

  return redirect(`/topics/${topicId.id}`);
};

export default function NewTopicPage() {
  const actionData = useActionData() as ActionData;
  const titleRef = React.useRef<HTMLInputElement>(null);
  const bodyRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.title) {
      titleRef.current?.focus();
    } else if (actionData?.errors?.body) {
      bodyRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form method="post" className="w-full flex flex-col">
      <div className="prose mb-4">
        <h2>토픽 생성</h2>
      </div>
      <div className="form-control w-full">
        <label className="label" htmlFor="title">
          <span className="label-text">제목</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          ref={titleRef}
          className={cx("input input-bordered w-full", {
            "input-error": Boolean(actionData?.errors?.title),
          })}
        />
        <label className="label min-h-8">
          <span className="label-text-alt text-error">
            {actionData?.errors?.title}
          </span>
        </label>
      </div>

      <div className="form-control">
        <label className="label" htmlFor="body">
          <span className="label-text">내용</span>
        </label>
        <textarea
          id="body"
          name="body"
          className={cx("textarea textarea-bordered h-24", {
            'textarea-error': Boolean(actionData?.errors?.body)
          })}
        />
        <label className="label min-h-8">
          <span className="label-text-alt text-error">
            {actionData?.errors?.body}
          </span>
        </label>
      </div>

      <div className="text-right">
        <button type="submit" className="btn">
          생성하기
        </button>
      </div>
    </Form>
  );
}
