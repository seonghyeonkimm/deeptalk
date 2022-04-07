import { EyeIcon, ThumbUpIcon, AnnotationIcon } from "@heroicons/react/solid";

type Props = {
  title: string;
  body: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  isNew?: boolean;
};

const TopicCard = ({
  title,
  isNew,
  body,
  likeCount,
  viewCount,
  commentCount,
}: Props) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl btn h-auto p-0 text-left items-start">
      <div className="card-body">
        <h2 className="card-title">
          {title}
          {isNew && <div className="badge badge-secondary">NEW</div>}
        </h2>
        <p className="line-clamp-2">{body}</p>
        <div className="card-actions justify-end mt-2">
          <div className="badge badge-outline">
            <ThumbUpIcon className="w-4 mr-1" />
            <span>
              좋아요 {likeCount.toLocaleString()}
            </span>
          </div>
          <div className="badge badge-outline">
            <AnnotationIcon className="w-4 mr-1" />
            <span>
              댓글 {commentCount.toLocaleString()}
            </span>
          </div>
          <div className="badge badge-outline">
            <EyeIcon className="w-4 mr-1" />
            <span>
              조회 {viewCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicCard;
