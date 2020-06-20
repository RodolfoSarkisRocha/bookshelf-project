// React
import React, { Fragment, useState, useEffect } from 'react';

// Styles
import './Home.scss';

// Components
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sorter from '../../components/Sorter/Sorter';
import { exists } from '../../utils/booleanUtils';
import ClipLoader from "react-spinners/ClipLoader";
import Header from '../../components/Header/Header';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { postBook } from '../../services/book';
import { getBooks } from '../../reducers/book'


const mockCategories = new Map([
  ['reading', 'Currently Reading'],
  ['wantToRead', 'Want to Read'],
  ['read', 'Read'],
]);

function Home() {

  // Reducer 
  const dispatch = useDispatch();
  const bookList = useSelector(state => state.bookList);
  const getBooksLoading = useSelector(state => state.getBookLoading);

  // State
  const [expandedFilters, setExpandedFilters] = useState(false);

  // TODO FORM SUBMIT
  async function handleFileChange(event) {
    const a = { file: event.target.files[0] }
    try {
      await postBook(a).then(response =>
        console.log(response)
      )
    }
    catch (err) {
      console.log(err)
    }
  };

  useEffect(() => {
    retrieveBooks()
  }, [])

  /**
  * Retrieve books
  * @param {object} orderByParams params that are passed as payload to retrieve books function
  */
  function retrieveBooks(orderByParams) {
    const payload = {};
    if (exists(orderByParams)) {
      payload.sorterDirection = orderByParams.sorterDirection;
      payload.dataIndex = orderByParams.dataIndex;
    };
    dispatch(getBooks(payload));
  };

  const sorters = [
    {
      name: 'Creation Date',
      dataIndex: 'creationDate',
      icon: <FontAwesomeIcon icon={['fas', 'calendar']} />
    },
    {
      name: 'Title',
      dataIndex: 'title',
      icon: <FontAwesomeIcon icon={['fas', 'book']} />
    },
    {
      name: 'Author',
      dataIndex: 'author',
      icon: <FontAwesomeIcon icon={['fas', 'user']} />
    },
  ];

  return (
    <Fragment>
      <Header
        title='Books'
        extra={(<FontAwesomeIcon icon={['fas', 'filter']} />)}
      >
        {<Sorter
          sorters={sorters}
          onSort={retrieveBooks}
        />}
      </Header>
      <div className='category-header'>
        <div>
          No category
        </div>
        <Link>
          View All
        </Link>
      </div>
      {/* TODO LOADING */}
      <div style={{ textAlign: 'center' }}>
        <ClipLoader
          loading={getBooksLoading}
          size={300}
        />
      </div>
      <div className='category-section'>
        {bookList.map(book => (
          <div key={book.id} className='book-item'>
            <img alt='book cover' src={book.cover} style={{ width: 200, height: 300 }} />
            <div className='book-title'>{book.title}</div>
          </div>
        )
        )}
      </div>
    </Fragment>
  );
};

export default Home