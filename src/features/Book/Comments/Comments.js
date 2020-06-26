import React, { useState, useEffect } from 'react';
import './Comments.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../../components/Button/Button';
import { formatDistanceToNow, fromUnixTime, getUnixTime } from 'date-fns';
import { exists } from '../../../utils/booleanUtils';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createComment, dltComment, updateComment } from '../../../reducers/book';

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

  useEffect(() => {
    const defaultEditingComment = commentsList.map(() => (false));
    setShowInputs(defaultEditingComment);
  }, [commentsList]);

  const [commentBody, setCommentBody] = useState(defaultCommentBody);
  const [showInputs, setShowInputs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updateCommentBody, setUpdateCommentBody] = useState({ body: '', author: '' });

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
  };

  function validateComment(fields) {
    const { body, author } = fields;

    const bodyTrimmed = body?.trim();
    const authorTrimmed = author?.trim();
    if (exists(bodyTrimmed) &&
      exists(authorTrimmed) &&
      bodyTrimmed !== '' &&
      authorTrimmed !== '') return true;
    else {
      toast.error('Your username and the comment are required!');
      return false;
    };

  };

  function handlePostComment() {
    if (validateComment(commentBody)) {
      const { body, author } = commentBody;

      const bodyTrimmed = body?.trim();
      const authorTrimmed = author?.trim();
      const creationDate = getUnixTime(new Date());

      const payloadMapped = {
        ...commentBody,
        author: authorTrimmed,
        body: bodyTrimmed,
        parentId,
        creationDate
      };

      dispatch(createComment(payloadMapped, clearFields));
    }
  };

  function handleDate(value) {
    const parsedDate = fromUnixTime(value);
    const formattedDate = formatDistanceToNow(parsedDate);
    return formattedDate;
  };

  function handleDeleteComment(comment) {
    const payloadMapped = {
      ...comment,
      deleted: true
    };
    const targetId = payloadMapped.id;
    delete (payloadMapped.id);
    dispatch(dltComment(payloadMapped, targetId, parentId));
  };

  function handleShowInputs(index, currentComment) {
    const editingCommentCopy = JSON.parse(JSON.stringify(showInputs));
    editingCommentCopy[index] = true;
    setUpdateCommentBody(currentComment);
    setShowInputs(editingCommentCopy);
    setIsEditing(true);
  }

  function handleCancelEdit(index) {
    const editingCommentCopy = JSON.parse(JSON.stringify(showInputs));
    editingCommentCopy[index] = false;
    setShowInputs(editingCommentCopy);
    setIsEditing(false);
  }

  function onEditCommentInputChange(event) {
    const target = event?.target;
    const name = target?.name;
    const value = target?.value;

    setUpdateCommentBody({
      ...updateCommentBody,
      [name]: value
    })
  }

  function handleUpdateComment() {
    if (validateComment(updateCommentBody)) {
      const { body, author } = updateCommentBody;

      const bodyTrimmed = body?.trim();
      const authorTrimmed = author?.trim();
      // Setting creation date again to display "edited 'x' time ago"
      const creationDate = getUnixTime(new Date());

      const payloadMapped = {
        ...updateCommentBody,
        author: authorTrimmed,
        body: bodyTrimmed,
        edited: true,
        creationDate,
      };

      dispatch(updateComment(payloadMapped, handleCancelEdit));
    }
  }

  return (
    <div className='comments-card'>
      <div className='comments-title'>{isEditing ? 'Edit your comment' : 'Comments'}</div>
      {commentsList.map((currentComment, currentCommentIndex) => {
        if (currentComment.deleted === false) {
          const isEditingComment = showInputs[currentCommentIndex] === true;
          return (
            <div className='comments-item'>
              <div className='avatar'>
                <FontAwesomeIcon icon={['fas', 'user']} />
              </div>
              <div className='comments-main'>
                <div className='comments-main-user-area'>
                  <div className='comments-user-date'>
                    <div className='comments-username'>
                      {
                        isEditingComment ?
                          <input
                            placeholder='Enter your username'
                            name='author'
                            value={updateCommentBody.author}
                            onChange={onEditCommentInputChange}
                            className='comments-author-input'
                          /> :
                          currentComment.author
                      }
                    </div>
                    <div className='comments-creation-date'>
                      {currentComment.edited ?
                        `edited ${handleDate(currentComment.creationDate)} ago` :
                        handleDate(currentComment.creationDate)
                      }
                    </div>
                  </div>
                  <div className='comments-options'>
                    {isEditingComment &&
                      <div className='comments-cancel'>
                        <FontAwesomeIcon
                          onClick={() => handleCancelEdit(currentCommentIndex)}
                          icon={['fas', 'window-close']}
                        />
                      </div>
                    }
                    {isEditingComment ?
                      <div className='comments-confirm-edit'>
                        <FontAwesomeIcon
                          onClick={() => handleUpdateComment(currentComment.id)}
                          icon={['fas', 'check']}
                        />
                      </div> :
                      <div className='comments-edit'>
                        <FontAwesomeIcon
                          onClick={() => handleShowInputs(currentCommentIndex, currentComment)}
                          icon={['fas', 'edit']}
                        />
                      </div>
                    }
                    {!isEditingComment &&
                      <div className='comments-delete'>
                        <FontAwesomeIcon
                          onClick={() => handleDeleteComment(currentComment)}
                          icon={['fas', 'trash']}
                        />
                      </div>
                    }
                  </div>
                </div>
                <div className='comments-text'>
                  {
                    isEditingComment ?
                      <textarea
                        value={updateCommentBody.body}
                        name='body'
                        placeholder='Leave a comment about this book'
                        className='comments-textarea'
                        onChange={onEditCommentInputChange}
                      /> :
                      currentComment.body
                  }
                </div>
              </div>
            </div>
          )
        }
        return null
      })}
      {!isEditing &&
        <>
          < div className='comments-author'>
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
        </>
      }

    </div >
  );
};