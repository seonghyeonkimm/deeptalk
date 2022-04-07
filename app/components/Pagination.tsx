import { FC } from 'react';
import cx from 'clsx';

type Props = {
  onPrevClick: (prevPage: number) => void;
  onNextClick: (nextPage: number) => void;
  page: number;
  totalPage: number;
};

const Pagination: FC<Props> = ({ page, totalPage, onPrevClick, onNextClick }) => {
  return (
    <div className="btn-group">
      <button
        className={cx("btn", { 'btn-disabled': page === 1})}
        onClick={() => onPrevClick(page - 1)}
      >
        «
      </button>
      <button className="btn">페이지 {page}</button>
      <button
        onClick={() => onNextClick(page + 1)}
        className={cx('btn', { 'btn-disabled': page === totalPage })}
      >
        »
      </button>
    </div>
  );
};

export default Pagination;
