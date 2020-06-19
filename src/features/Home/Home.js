import React, { Fragment, useState, useEffect } from 'react';
import './Home.scss';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sorter from '../../components/Sorter/Sorter';
import Button from '../../components/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { getBooks } from '../../reducers/book'
import { exists } from '../../utils/booleanUtils';
import { postBook } from '../../services/book';
import ClipLoader from "react-spinners/ClipLoader";


const mockCategories = new Map([
  ['reading', 'Currently Reading'],
  ['wantToRead', 'Want to Read'],
  ['read', 'Read'],
]);

function Home() {

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
  }
  // TODO FORM SUBMIT
  function submitFile(event) {
    event.preventDefault();
  }


  // Reducer 
  const dispatch = useDispatch();
  const bookList = useSelector(state => state.bookList);
  const getBooksLoading = useSelector(state => state.getBookLoading);

  // State
  const [expandedFilters, setExpandedFilters] = useState(false);

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

  /**
   * Changes the state of the order by items container 
   */
  function handleExpandFilters() {
    const filterHeader = document.getElementById('filterHeader');
    if (filterHeader.className === 'filter-header') filterHeader.className += ' expanded-filters';
    else filterHeader.className = 'filter-header';
    setExpandedFilters(!expandedFilters);
  };

  const headerWithFilter = () => {

    const filters = [
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
      <div id='filterHeader' className='filter-header'>
        <div className='title-content'>
          <div>Books</div>
          <div className={'flex-row-end'}>
            <div className='flex-row-center'>
              <Button className='mr10' onClick={() => true}>
                <FontAwesomeIcon className='mr10' icon={['fas', 'plus']} />
                <div>Add a new book</div>
              </Button>
              <Button onClick={handleExpandFilters}>
                <FontAwesomeIcon
                  className={expandedFilters ? 'arrow-down' : 'arrow-up'}
                  icon={['fas', 'arrow-down']}
                />
                <div>Sort by</div>
              </Button>
            </div>
          </div>
        </div>
        {<Sorter
          filters={filters}
          onSort={retrieveBooks}
        />}
      </div>
    )
  };

  return (
    <Fragment>
      {headerWithFilter()}
      <div className='category-header'>
        <div>
          No category
        </div>
        <Link>
          View All
        </Link>
      </div>
      {/* TODO LOADING */}
      <div style={{textAlign: 'center'}}>
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
      {/* TODO form */}
      <form onSubmit={submitFile}>
        {/* <img src={} /> */}
        <input type='file' onChange={handleFileChange} />
        <button>Submit File</button>
      </form>
    </Fragment>
  );
};

export default Home