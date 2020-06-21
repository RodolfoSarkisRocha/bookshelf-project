// React
import React, { Fragment, useState, useEffect } from 'react';

// Styles
import './Home.scss';

// Components
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sorter from '../../components/Sorter/Sorter';
import { exists } from '../../utils/booleanUtils';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { postBook } from '../../services/book';
import { getBooks, getCategories } from '../../reducers/book'
import Empty from '../../components/Empty/Empty';
import Spin from '../../components/Spin/Spin';

function Home() {

  // Reducer 
  const dispatch = useDispatch();
  const bookList = useSelector(state => state.bookList);
  const categoriesList = useSelector(state => state.categoriesList);
  const getBooksLoading = useSelector(state => state.getBookLoading);

  // TODO FORM SUBMIT
  // async function handleFileChange(event) {
  //   const a = { file: event.target.files[0] }
  //   try {
  //     await postBook(a).then(response =>
  //       console.log(response)
  //     )
  //   }
  //   catch (err) {
  //     console.log(err)
  //   }
  // };

  useEffect(() => {
    retrieveBooks()
  }, [])

  /**
  * Retrieve books
  * @param {object} orderByParams params that are passed as payload to retrieve books function
  */
  async function retrieveBooks(orderByParams) {
    dispatch(getCategories());
    const payload = {};
    if (exists(orderByParams)) {
      payload.sorterDirection = orderByParams.sorterDirection;
      payload.dataIndex = orderByParams.dataIndex;
    };
    dispatch(getBooks(payload));
  };

  function renderEmptyData(category) {
    const existsData = bookList.some(currentBook => currentBook.category === category.value);
    if (!existsData) return <Empty text='No books in this category' />;
    return null
  }

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
      <div className='main-content'>
        {/* Sorting the books by categories retrived from the database */}
        {categoriesList.map(currentCategory => (
          <div className='category-container'>
            <div className='category-header'>
              <div>
                {currentCategory?.label}
              </div>
              <Button loading={false} loadingCss={{ color: '#f1f1f1', size: 16 }}>
                View All
              </Button>
            </div>
            <div className='category-section'>
              {
                getBooksLoading ? <Spin /> :
                  <>
                    {bookList.map(book => {
                      if (book.category === currentCategory?.value)
                        return (
                          <div key={book.id} className='book-item'>
                            <img className='book-cover' alt='book cover' src={book.cover} />
                            <div className='book-title'>{book.title}</div>
                          </div>
                        )
                      return null
                    })}
                    {renderEmptyData(currentCategory)}
                  </>
              }
            </div>
          </div>
        )
        )}
      </div>
    </Fragment>
  );
};

export default Home