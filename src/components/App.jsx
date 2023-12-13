import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import imageAPI from '../service/image-api';

import Button from './Button';
import ImageGallery from './ImageGallery';
import Loader from './Loader';
import Modal from './Modal';
import SearchBar from './SearchBar';

// const BASE_URL = 'https://pixabay.com/api/';
// const MY_API_KEY = '27785613-3c730127b1356d079421a0eb8';
// const searchParams = new URLSearchParams({
//   image_type: 'photo',
//   orientation: 'horizontal',
// });

export const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  // const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [per_page, setPer_page] = useState(12);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPhoto, setModalPhoto] = useState('');

  useEffect(() => {
    if (query === '') {
      return;
    }

    setIsLoading(true);
    imageAPI
      .fetchImage({ query, page })
      // fetch(
      //   `${BASE_URL}?q=${query}&page=${page}&key=${MY_API_KEY}&${searchParams}&per_page=12`
      // )
      //   .then(response => response.json())
      .then(photos => {
        if (photos.hits.length === 0) {
          toast.error('There are no photos');
        }
        setPhotos(prevPhotos => [...prevPhotos, ...photos.hits]);
        setIsVisible(page < Math.ceil(photos.totalHits / 12));
      })
      .catch(error => error)
      .finally(() => {
        setIsLoading(false);
      });
  }, [query, page]);

  const handleSearchSubmit = queryForm => {
    if (query === queryForm) {
      toast.error(`You already find ${queryForm}`);
      return;
    }

    setQuery(queryForm);
    setPage(1);
    setPhotos([]);
    setIsVisible(false);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const onClickPhoto = url => {
    setModalPhoto(url);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <SearchBar onSubmit={handleSearchSubmit} />
      {isLoading && <Loader />}
      <ImageGallery photos={photos} onClickPhoto={onClickPhoto} />
      {isVisible && <Button isLoading={isLoading} onClick={handleLoadMore} />}
      {isModalOpen && (
        <Modal modalPhoto={modalPhoto} onModalClose={handleModalClose} />
      )}

      <ToastContainer autoClose={2000} />
    </div>
  );
};
