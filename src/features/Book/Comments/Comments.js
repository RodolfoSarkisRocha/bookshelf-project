import React, { useState } from 'react';
import './Comments.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/Button/Button';
import { formatDistanceToNow, fromUnixTime, getUnixTime } from 'date-fns';
import { exists } from '../../../utils/booleanUtils';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createComment, dltComment } from '../../../reducers/book';

export default ({ commentsList = [], parentId }) => {

  const dispatch = useDispatch();

  // Initializing constants
  const defaultCommentBody = {
    parentId,
    creationDate: undefined,
    body: '',
    author: '',
    deleted: false,
  }

  const [commentBody, setCommentBody] = useState(defaultCommentBody);

  function handleInputsChange(event) {
    const target = event?.target;
    const name = target?.name;
    const value = target?.value;

    setCommentBody({
      ...commentBody,
      [name]: value
    });
  };

  function clearFields() {
    setCommentBody(defaultCommentBody);
  }

  function handlePostComment() {
    const { body, author } = commentBody;
    const bodyTrimmed = body?.trim();
    const authorTrimmed = author?.trim();
    if (exists(bodyTrimmed) &&
      exists(authorTrimmed) &&
      bodyTrimmed !== '' &&
      authorTrimmed !== '') {

      const creationDate = getUnixTime(new Date());

      const payloadMapped = {
        ...commentBody,
        author: authorTrimmed,
        body: bodyTrimmed,
        parentId,
        creationDate
      }      

      dispatch(createComment(payloadMapped, clearFields));
    }
    else toast.error('Your username and the comment are required!')
  }

  function handleDate(value) {
    const parsedDate = fromUnixTime(value);
    const formattedDate = formatDistanceToNow(parsedDate);
    return formattedDate;
  }

  function handleDeleteComment(comment) {
    const payloadMapped = {
      ...comment,
      deleted: true
    }
    const targetId = payloadMapped.id
    delete (payloadMapped.id)
    dispatch(dltComment(payloadMapped, targetId, parentId))
  }

  return (
    <div className='comments-card'>

      {commentsList.map(currentComment => {
        if (currentComment.deleted === false) {
          return (
            <div className='comments-item'>
              <div className='avatar'>
                <FontAwesomeIcon icon={['fas', 'user']} />
              </div>
              <div className='comments-main'>
                <div className='comments-main-user-area'>
                  <div className='flex-row-center'>
                    <div className='comments-username'>{currentComment.author}</div>
                    <div className='comments-creation-date'>{handleDate(currentComment.creationDate)}</div>
                  </div>
                  <div className='comments-options'>
                    <div className='comments-edit'>
                      <FontAwesomeIcon icon={['fas', 'edit']} />
                    </div>
                    <div className='comments-delete'>
                      <FontAwesomeIcon onClick={() => handleDeleteComment(currentComment)} icon={['fas', 'trash']} />
                    </div>
                  </div>
                </div>
                <div className='comments-text'>{currentComment.body}</div>
              </div>
            </div>
          )
        }
        return null
      })}

      <div className='comments-author'>
        <input
          className='comments-author-input'
          placeholder='Enter your username'
          name='author'
          value={commentBody.author}
          onChange={handleInputsChange}
        />
      </div>

      <div className='comments-input'>
        <textarea
          value={commentBody.body}
          className='comments-textarea'
          name='body'
          onChange={handleInputsChange}
          placeholder='Leave a comment about this book'
        />
      </div>

      <div className='comments-submit'>
        <Button onClick={handlePostComment}>Comment</Button>
      </div>
    </div>
  );
};