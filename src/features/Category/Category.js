import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getBooks } from '../../reducers/book';
import { useDispatch, useSelector } from 'react-redux';
import { exists } from '../../utils/booleanUtils';
import './Category.scss';
import { format, fromUnixTime } from 'date-fns';

// Default book cover
import defaultCover from '../../assets/book-cover.jpg'
import Header from '../../components/Header/Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../components/Button/Button';
import Select from '../../components/Select/Select';
import Empty from '../../components/Empty/Empty';
import Spin from '../../components/Spin/Spin';

export default props => {

  const categories = {
    read: "Read",
    noCategory: 'No Category',
    currentlyReading: 'Currently Reading',
    wantToRead: 'Want to Read'
  };

  // Reducer
  const dispatch = useDispatch();
  const bookList = useSelector(state => state.bookList);
  const categoriesList = useSelector(state => state.categoriesList);
  const getBooksLoading = useSelector(state => state.getBookLoading);

  // State
  const useQuery = new URLSearchParams(useLocation().search);
  const [categoryTitle, setCategoryTitle] = useState('Category');
  const [filterIconClass, setFilterIconClass] = useState('arrow-down');
  const [category, setCategory] = useState('noCategory');
  const [initialRender, setInitialRender] = useState(true);

  // Getting query value to retrieve books by category
  useEffect(() => {
    const queryParam = useQuery.get('category');
    if (exists(queryParam)) {
      const queryParamToCamelCase = queryParam.replace(/-(.)/g, (dash, nextChar) => {
        return nextChar.toUpperCase();
      });
      setCategoryTitle(categories[queryParamToCamelCase]);
      dispatch(getBooks({ fieldName: 'category', value: queryParamToCamelCase }, 'filterByField'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const isInitialRender = initialRender === true;
    if (isInitialRender) return setInitialRender(false);
    dispatch(getBooks({ fieldName: 'category', value: category }, 'filterByField'))
  }, [category])

  function formatDate(date) {
    if (exists(date)) {
      const newDate = fromUnixTime(date);
      return format(newDate, "'Created at 'do 'of' MMMM yyyy");
    }
    return
  }

  const getIconClass = () => {
    const classMapped = new Map([
      [false, 'arrow-down'],
      [true, 'arrow-up']
    ]);
    return classMapped.get(filterIconClass)
  }

  const onCategoryChange = (event) => {
    const value = event?.target?.value;

    setCategory(value);
  }

  const renderFilterContent = () => (
    <div className='flex-row-center'>
      <div className='category-select'>
        Select the category to filter:
      </div>
      <Select
        value={category}
        type='select'
        placeholder='Select a category'
        onChange={onCategoryChange}
        width='100%'
        name='category'
      >
        {categoriesList.map(category => (
          <option
            key={category.label}
            value={category.value}>
            {category.label}
          </option>
        ))}
      </Select>
    </div>
  )

  return (
    <>
      <Header
        title={categoryTitle}
        extra={
          <Button
            onClick={() => setFilterIconClass(!filterIconClass)}
            icon={<FontAwesomeIcon icon={['fas', 'arrow-down']} />}
            className={getIconClass()}
          >
            Filters
          </Button>
        }
      >
        {renderFilterContent()}
      </Header>
      {getBooksLoading ? <Spin /> :
        <div className='category-books'>
          {bookList.map(book => {
            if (book.deleted === false)
              return (
                <div key={book.id} className='category-book-item'>
                  <img
                    className='category-book-cover'
                    alt='book cover'
                    src={book.cover ?
                      book.cover :
                      defaultCover}
                  />
                  <div className='category-book-details'>
                    <div className='category-book-title'>{book.title}</div>
                    <div className='category-book-author'>by {book.author}</div>
                    <div className='category-book-creation-date'>{formatDate(book.creationDate)}</div>
                    <div className='category-book-description'>{book.description}</div>
                  </div>
                </div>
              )
            return null
          })}
          {bookList.length === 0 && <Empty />}
        </div>
      }
    </>
  )
}