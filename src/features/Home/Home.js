import React, { Fragment, useState } from 'react';
import './Home.scss'
import bookCover from '../../assets/book-cover.jpg';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sorter from '../../components/Sorter/Sorter';
import Button from '../../components/Button/Button';

const mockBooks = [];

const mockCategories = {
  reading: 'Currently Reading',
  wantToRead: 'Want to Read',
  read: 'Read'
};

for (let i = 0; i < 10; i++) {
  mockBooks.push({
    id: i + 1,
    time: Date.now(),
    title: `Book ${i + 1}`,
    description: `Lorem ipsum dolor sit amet ${i + 1}`,
    author: `Author ${i + 1}`,
    category: mockCategories.reading,
    deleted: 'false'
  });
};

export default props => {

  const [expandedFilters, setExpandedFilters] = useState(false);

  function handleExpandFilters() {
    const filterHeader = document.getElementById('filterHeader');
    if (filterHeader.className === 'filter-header') filterHeader.className += ' expanded-filters';
    else filterHeader.className = 'filter-header';
    setExpandedFilters(!expandedFilters);
  };

  const headerWithFilter = () => {

    function handleSortDirectionChange({ sorterDirection, dataIndex }) {
      console.log(`${sorterDirection} ${dataIndex}`)
    }

    const filters = [
      {
        name: 'Creation Date',
        dataIndex: 'date',
        icon: <FontAwesomeIcon icon={['fas', 'calendar']} />
      },
      {
        name: 'Book',
        dataIndex: 'book',
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
              {/* <Button className='mr10' onClick={() => setOpenBookDetails(true)}>
                <FontAwesomeIcon className='mr10' icon={['fas', 'plus']} />
                <div>Add a new book</div>
              </Button> */}
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
          onSort={handleSortDirectionChange}
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
      <div className='category-section'>
        {mockBooks.map(book => (
          <div key={book.id} className='book-item'>
            <img alt='book cover' src={bookCover} style={{ width: 200, height: 300 }} />
            <div className='book-title'>{book.title}</div>
          </div>
        ))}
      </div>
    </Fragment>
  );
};