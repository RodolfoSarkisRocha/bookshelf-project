// React
import React, { Fragment, useState, useEffect } from 'react';

// Styles
import './Home.scss';

// Components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Sorter from '../../components/Sorter/Sorter';
import { exists, isJson } from '../../utils/booleanUtils';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import Modal from '../../components/Modal/Modal';
import Empty from '../../components/Empty/Empty';
import Spin from '../../components/Spin/Spin';
import Input from '../../components/Input/Input';
import TextArea from '../../components/TextArea/TextArea';
import Select from '../../components/Select/Select';
import { format } from 'date-fns';
import imageCompression from 'browser-image-compression';

// Redux
import { useDispatch, useSelector } from 'react-redux';
import { getBooks, getCategories, postBook, getBookById, updateBook, dltBook } from '../../reducers/book'
import Book from '../Book/Book';
import { toast } from 'react-toastify';

function Home() {

  // Initializing Constants
  const { getDataUrlFromFile } = imageCompression;
  const mobileDisplay = window.innerWidth < 768;
  const defaultBookBody = {
    title: null,
    author: null,
    description: null,
    cover: null,
    category: null,
    deleted: false,
    creationDate: null,
    comments: []
  }
  const bookError = {
    title: false,
    author: false,
    description: false,
    cover: false,
    category: false,
    creationDate: false,
    comments: false
  }

  // State
  const [modalVisible, setModalVisible] = useState(false);
  const [bookBody, setBookBody] = useState(defaultBookBody);
  const [formError, setFormError] = useState(bookError);
  const [coverPreview, setCoverPreview] = useState(null);
  const [showBookDetails, setShowBookDetails] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [imgHasChanged, setImgHasChanged] = useState(false);

  // Use Effect
  useEffect(() => {
    retrieveBooks()
  }, [])

  useEffect(() => {

  }, [showBookDetails])


  // Reducer 
  const dispatch = useDispatch();
  const bookList = useSelector(state => state.bookList);
  const categoriesList = useSelector(state => state.categoriesList);
  const getBooksLoading = useSelector(state => state.getBookLoading);
  const createBookLoading = useSelector(state => state.createBookLoading);
  const updateBookLoading = useSelector(state => state.updateBookLoading);
  const bookDetails = useSelector(state => state.bookBody);

  function validateForm() {

    function validateFields(fieldsToValidate) {
      // Starting an array of errors
      let errors = [];
      // For each field passed, take it's respective value and verifies if it does not exist, then push the field to errors
      fieldsToValidate.forEach(field => {
        const value = bookBody[field];
        if (!exists(value) || value.trim() === '') errors.push(field);
      })
      // Copying form errors default object
      const newFormError = JSON.parse(JSON.stringify(bookError));
      // For each error element set the state error true for that field
      errors.forEach(field => { newFormError[field] = true });
      setFormError(newFormError);
      // Returns boolean if any errors
      return errors.length > 0
    };

    // Creating an array of fields to be used in validation function as form field parameters
    const fieldsToValidate = ['title', 'author']
    return validateFields(fieldsToValidate);
  };

  function submitFormCallback() {
    setModalVisible(false);
    setBookBody(defaultBookBody);
    setCoverPreview(null);
    setShowBookDetails(false);
    retrieveBooks();
  };

  function mapBookDataToForm() {
    setCoverPreview(bookDetails.cover);
    setBookBody({
      ...bookDetails,
      category: JSON.stringify(bookDetails.category)
    });
  }

  function editBook() {
    mapBookDataToForm();
    setIsUpdating(true)
    setModalVisible(true);
  };

  function deleteBookCallback() {
    setShowBookDetails(false);
    setBookBody(defaultBookBody);
    retrieveBooks();
  };

  function deleteBook() {
    dispatch(dltBook(bookDetails, deleteBookCallback))
  };

  function handleCreateBook() {
    const callback = submitFormCallback;
    // Copying state array to prevent reference problems
    const bookBodyMapped = JSON.parse(JSON.stringify(bookBody));

    const {
      category,
      comments
    } = bookBodyMapped;

    // Getting the not stringyfied cover image 
    const { cover } = bookBody;

    let coverImage;

    coverImage = cover;

    // Parsing the category back to an object
    bookBodyMapped.category = isJson(category) ? JSON.parse(category) : category;

    // Creating a creation date 
    bookBodyMapped.creationDate = format(new Date(), 'yyyy-MM-dd');

    if (!exists(category) || category === 'noCategory') {
      bookBodyMapped.category = { value: 'noCategory', label: 'No Category' }
    }

    if (!validateForm()) dispatch(postBook(bookBodyMapped, coverImage, callback));
  };

  function handleUpdateBook() {
    const callback = submitFormCallback;

    // Copying state array to prevent reference problems
    const bookBodyMapped = JSON.parse(JSON.stringify(bookBody));

    // Getting the not stringyfied cover image 
    const { cover } = bookBody;

    const payloadMapped = {
      ...bookBodyMapped,
      cover: cover
    };

    // Checking if cover image is the same as before
    // to prevent unecessary upload
    // If not, delete the previous image from the storage
    let imageToDelete = null;
    const isTheSameCover = typeof payloadMapped.cover === 'string';
    if (!isTheSameCover) imageToDelete = bookDetails.cover;

    // Parsing the category back to an object
    const { category } = payloadMapped;
    payloadMapped.category = JSON.parse(category)

    if (!validateForm())
      dispatch(updateBook(payloadMapped, imageToDelete, callback));
  }

  function submitForm() {
    if (isUpdating) handleUpdateBook();
    else handleCreateBook();
  };

  /**
   * Closes the modal, clear the form fields, set update mode to false
   */
  function closeModal() {
    setModalVisible(false)
    setIsUpdating(false)
    setBookBody(defaultBookBody)
    setCoverPreview(null)
  };

  function openModal() {
    setModalVisible(true)
  };

  function removeCover() {
    setCoverPreview(null);
    setBookBody({
      ...bookBody,
      cover: null
    });
  };

  function onInputsChange(event) {
    const target = event?.target;
    const name = target?.name;
    const value = target?.value;

    setBookBody({
      ...bookBody,
      [name]: value
    });
  };

  /**
   * This compresses the image to a smaller size
   * and sets the image onto the state to later upload
   * @param {*} event The object containing the image meant to be uploaded
   */
  async function handleImageChange(event) {
    const imageFile = event.target.files[0];
    // Checking if file is of the type image
    if (imageFile && imageFile.type.split('/')[0] === 'image') {

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 300,
        useWebWorker: true
      };

      try {
        const compressedImage = await imageCompression(imageFile, options);
        // This is needed to set a file into the preview field
        const previewFile = await getDataUrlFromFile(compressedImage);
        setCoverPreview(previewFile);

        setBookBody({
          ...bookBody,
          cover: compressedImage
        });
        setImgHasChanged(true)
      }
      catch (err) {
        toast.error('There was a problem with your image, try again or send a different image')
      }
    }
  }

  function retrieveBookById(id) {

    function showBookDetails() {
      setShowBookDetails(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (exists(id)) {
      dispatch(getBookById(id, showBookDetails))
    }

  }

  /**
  * Retrieve books
  * @param {object} orderByParams params that are passed as payload to retrieve books function
  */
  function retrieveBooks(orderByParams) {
    dispatch(getCategories());
    const payload = {};
    if (exists(orderByParams)) {
      payload.sorterDirection = orderByParams.sorterDirection;
      payload.dataIndex = orderByParams.dataIndex;
    };
    dispatch(getBooks(payload));
  };

  /**
   * Checking if any book with current category is present 
   * renders a empty feedback component otherwise
   * @param {string} category 
   */
  function renderEmptyData(category) {
    const existsData = bookList.some(currentBook => currentBook.category?.value === category.value && currentBook.deleted === false);
    if (!existsData) return <Empty text='No books in this category' />;
    return null
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

  const renderBookCreation = () => (
    <div className='responsive-form'>
      <label>Cover: </label>
      <div className='file-upload-container'>
        {coverPreview &&
          <>
            <img
              className='cover-preview'
              src={coverPreview}
              id='output_image'
              alt='cover preview'
            />
          </>
        }
        <div className='file-upload-buttons'>
          <label className='file-upload-button' for='cover'>
            Choose a file
          </label>
          {coverPreview && <Button onClick={removeCover}>Remove</Button>}
        </div>
        <input
          className='upload-input'
          onChange={handleImageChange}
          type='file'
          accept='image/*'
          files={bookBody.cover}
          name='cover'
          id='cover'
        />
      </div>
      <div>
        <label for='title'>Title: </label>
        <Input
          value={bookBody.title}
          onChange={onInputsChange}
          maxLength={100}
          width='100%'
          name='title'
          error={formError.title}
          errorMessage='Please, inform the title'
        />
      </div>
      <div>
        <label for='author'>Author: </label>
        <Input
          value={bookBody.author}
          onChange={onInputsChange}
          maxLength={100}
          width='100%'
          name='author'
          error={formError.author}
          errorMessage='Please, inform the author'
        />
      </div>
      <div>
        <label for='category'>Category: </label>
        <Select
          value={bookBody?.category?.value}
          type='select'
          placeholder='Select a category'
          onChange={onInputsChange}
          width='100%'
          name='category'
          error={formError.category}
          errorMessage='Please, inform the category'
        >
          {categoriesList.map(category => (
            <option
              selected={JSON.stringify({ label: 'No Category', value: 'noCategory' })}
              value={JSON.stringify(category)}>
              {category.label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label for='description'>Description: </label>
        <TextArea
          value={bookBody.description}
          onChange={onInputsChange}
          maxLength={2000}
          height='100px'
          mode='textarea'
          width='100%'
          name='description'
        />
      </div>
    </div>
  );

  const renderModalFooter = () => (
    <>
      <Button
        loading={createBookLoading || updateBookLoading}
        loadingCss={{ color: '#f1f1f1', size: 16 }}
        className='mr10'
        onClick={closeModal}
      >
        Cancel
      </Button>
      <Button
        loading={createBookLoading || updateBookLoading}
        loadingCss={{ color: '#f1f1f1', size: 16 }}
        onClick={submitForm}
      >
        {isUpdating ? 'Edit' : 'Confirm'}
      </Button>
    </>
  );

  return (
    <Fragment>
      {showBookDetails ?
        <Book
          book={bookDetails}
          setShowBookDetails={setShowBookDetails}
          editBook={editBook}
          deleteBook={deleteBook}
        />
        :
        <>
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
            <Button
              icon={<FontAwesomeIcon icon={['fas', 'plus']} />}
              className='max-width'
              onClick={openModal}
            >
              Add book
            </Button>
            {/* Sorting the books by categories retrived from the database */}
            {categoriesList.map(currentCategory => (
              <div className='category-container'>
                <div className='category-header'>
                  <div>
                    {currentCategory?.label}
                  </div>
                  <Button
                    loading={false}
                    loadingCss={{ color: '#f1f1f1', size: 16 }}
                    icon={<FontAwesomeIcon icon={['fas', 'eye']} />}
                  >
                    View All
              </Button>
                </div>
                <div className='category-section'>
                  {
                    getBooksLoading ? <Spin /> :
                      <>
                        {bookList.map(book => {
                          if (book.category?.value === currentCategory?.value && book.deleted === false)
                            return (
                              <div key={book.id} className='book-item'>
                                <img onClick={() => retrieveBookById(book.id)} className='book-cover' alt='book cover' src={book.cover} />
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
        </>
      }
      <Modal
        title='Book'
        visible={modalVisible}
        width={mobileDisplay ? '80%' : '60%'}
        footer={renderModalFooter()}
      >
        {renderBookCreation()}
      </Modal>
    </Fragment>
  );
};

export default Home