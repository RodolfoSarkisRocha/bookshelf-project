import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
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
  const history = useHistory();
  const [categoryTitle, setCategoryTitle] = useState('Category');
  const [filterIconClass, setFilterIconClass] = useState('arrow-down');
  const [category, setCategory] = useState('noCategory');
  const [showDescriptions, setShowDescriptions] = useState([]);

  const formatQueryParam = (value) => {
    const lowerWithHifen = value.replace(/[A-Z]/g,
      camelLetter => `-${camelLetter.toLowerCase()}`);
    return lowerWithHifen;
  };

  useEffect(() => {
    const defaultShowDescriptions = bookList.map(() => false);
    setShowDescriptions(defaultShowDescriptions);
  }, [bookList])

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
  }, [category]);

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
    let newQuery;
    if (value) {
      newQuery = formatQueryParam(value);
      history.push({
        pathname: '/category',
        search: `category=${newQuery}`
      })
      setCategory(value);
    }
  }

  const renderFilterContent = () => (
    <div className='category-select'>
      <div className='category-select-label'>
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

  function showAllDescription(index) {
    const showDescriptionsCopy = JSON.parse(JSON.stringify(showDescriptions));
    showDescriptionsCopy[index] = !showDescriptionsCopy[index];
    setShowDescriptions(showDescriptionsCopy);
    const descriptionElement = document.getElementById(`description-id-${index}`)
    if (descriptionElement)
      if (showDescriptionsCopy[index] === true) descriptionElement.classList.add('category-book-description-uncollapsed');
      else descriptionElement.classList.remove('category-book-description-uncollapsed');
  };


  // Setting the 'read more' button visibility dynamically depending on div's height
  useEffect(() => {
    const descriptionElements = document.getElementsByClassName(`category-book-description-collapsed`);
    const readMoreElements = document.getElementsByClassName(`read-more`);
    if (descriptionElements.length > 0) {
      for (let index = 0; index < descriptionElements.length; index++) {
        const element = descriptionElements[index];
        const descriptionHeight = element.scrollHeight;

        // Getting element max allowed height and replacing all non numbers characters
        const maxAllowedHeight = getComputedStyle(element).maxHeight.replace(/[^0-9]/g, '');

        // Since use effect runs every render, this is checking if classes are already set

        const classAlreadySet =
          (readMoreElements[index].classList.contains("read-more-visible") ||
            readMoreElements[index].classList.contains("read-more-invisible"));

        if (!classAlreadySet) {
          if (maxAllowedHeight > descriptionHeight)
            readMoreElements[index].classList.add('read-more-invisible');
          else readMoreElements[index].classList.add('read-more-visible');;
        }
      };
    };
  });

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
          {bookList.map((book, index) => {
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
                    <div id={`description-id-${index}`} className='category-book-description-collapsed'>
                      {book.description}
                    </div>
                    <div
                      onClick={() => showAllDescription(index)}
                      id={`read-more-id-${index}`}
                      className='read-more'
                    >
                      {showDescriptions[index] ? 'Read Less' : 'Read More'}
                    </div>
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