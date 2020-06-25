import React, { useState } from 'react';
import './Comments.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/Button/Button';
import { formatDistanceToNow } from 'date-fns';
import { exists } from '../../../utils/booleanUtils';
import { toast } from 'react-toastify';

export default ({ commentsList = [], parentId }) => {

  const defaultCommentBody = {
    parentId: null,
    creationDate: null,
    body: null,
    author: null,
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

  function handlePostComment() {
    const { body, author } = commentBody;
    const bodyTrimmed = body?.trim();
    const authorTrimmed = author?.trim();
    if (exists(bodyTrimmed) && exists(authorTrimmed)) {
      const creationDate = new Date();
    }
    else toast.error('Your username and the comment are required!')
  }

  function handleDate(value) {
    const parsedDate = new Date(value);
    const formattedDate = formatDistanceToNow(parsedDate);
    return formattedDate;
  }

  return (
    <div className='comments-card'>
      <div className='comments-content'>

        {commentsList.map(currentComment => (
          <div className='comments-item'>
            <div className='avatar'>
              <FontAwesomeIcon icon={['fas', 'user']} />
            </div>
            <div className='comments-main'>
              <div className='comments-main-user-area'>
                <div className='comments-username'>{currentComment.author}</div>
                <div className='comments-creation-date'>{handleDate(currentComment.creationDate)}</div>
                <div className='comments-options'>
                  <div className='comments-edit'>
                    <FontAwesomeIcon icon={['fas', 'edit']} />
                  </div>
                  <div className='comments-delete'>
                    <FontAwesomeIcon icon={['fas', 'trash']} />
                  </div>
                </div>
              </div>
              <div className='comments-text'>{currentComment.body}</div>
            </div>
          </div>
        ))}

      </div>

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