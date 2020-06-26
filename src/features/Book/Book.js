import React from 'react';
import './Book.scss';
import { format, parse, fromUnixTime } from 'date-fns';
import { exists } from '../../utils/booleanUtils';
import Header from '../../components/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Comments from './Comments/Comments';
import { useSelector } from 'react-redux';

export default ({ book, setShowBookDetails, editBook, deleteBook }) => {

  const {
    id,
    cover,
    title,
    author,
    creationDate,
    category,
    description,
    comments
  } = book;

  const createCommentLoading = useSelector(state => state.createCommentLoading);
  const updateCommentLoading = useSelector(state => state.updateCommentLoading);
  const deleteCommentLoading = useSelector(state => state.deleteCommentLoading);

  const isCommentLoading = createCommentLoading || updateCommentLoading || deleteCommentLoading;

  function formatDate(date) {
    if (exists(date)) {
      const newDate = fromUnixTime(date);
      return format(newDate, "do 'of' MMMM yyyy");
    }
    return null
  }

  function safeNull(value) {
    if (exists(value) && typeof value === "string" && value.trim() !== '') return value;
    return <div className='no-data-field'>No data</div>
  }

  return (
    <>
      <Header
        title={
          <div onClick={() => setShowBookDetails(false)} className='go-back-arrow'>
            <FontAwesomeIcon
              className='arrow-icon'
              icon={['fas', 'arrow-left']}
            />
            <div>Go back</div>
          </div>
        }
        extra={title}
      />
      <div className='book-details-container'>
        <div className='book-details-card'>

          <div className='book-details-cover'>
            <img src={cover} alt='book-cover' />
          </div>

          <div className='details-column'>
            <h2 className='book-details-title'>{safeNull(title)}</h2>
            <div className='book-details-author'>by {safeNull(author)}</div>
            <div className='book-details-date'>Created at {formatDate(creationDate)}</div>
            <div className='book-details-category'>{safeNull(category?.label)}</div>
          </div>

          <div className='book-details-description'>
            {safeNull(description)}
          </div>
          <div className='book-details-comments'>
            <Comments
              commentsList={comments}
              parentId={id}
            />
          </div>
        </div >
      </div>
      {!isCommentLoading &&
        <div className='book-actions'>
          <div onClick={editBook} className='edit-button'>
            <FontAwesomeIcon icon={['fas', 'edit']} />
          </div>
          <div onClick={deleteBook} className='delete-button'>
            <FontAwesomeIcon icon={['fas', 'trash']} />
          </div>
        </div>
      }
    </>
  );
};