import { Routes, Route } from 'react-router-dom';

import './index.css';
import commonStyles from './common.module.css';

import PageHeader from './components/PageHeader/index.js';

import ProtectedPage from './routes/protected/index.js';
import MainPage from './routes/main/index.js';
import LoginPage from './routes/login/index.js';
import PostFormPage from './routes/post-form/index.js';
import TagPage from './routes/tag/index.js';
import PostPage from './routes/post/index.js';
import GalleryPage from './routes/gallery/index.js';
import PhotoPage from './routes/photo/index.js';

const App = () => {
  return (
    <div className={commonStyles.pageContainer}>
      <PageHeader title={'tsvetta archive'} />
      <div className='page-content'>
        <main className='main'>
          <Routes>
            <Route
              path='/'
              element={
                <ProtectedPage>
                  <MainPage />
                </ProtectedPage>
              }
            />
            <Route
              path='/gallery'
              element={
                <ProtectedPage accessLevel={4}>
                  <GalleryPage />
                </ProtectedPage>
              }
            />
            <Route
              path='/gallery/:id'
              element={
                <ProtectedPage accessLevel={4}>
                  <PhotoPage />
                </ProtectedPage>
              }
            />
            <Route
              path='/create-post'
              element={
                <ProtectedPage accessLevel={4}>
                  <PostFormPage />
                </ProtectedPage>
              }
            />
            <Route
              path='/post/:id'
              element={
                <ProtectedPage>
                  <PostPage />
                </ProtectedPage>
              }
            />
            <Route
              path='/post/:id/edit'
              element={
                <ProtectedPage accessLevel={4}>
                  <PostFormPage />
                </ProtectedPage>
              }
            />
            <Route
              path='/tag/:tagId'
              element={
                <ProtectedPage>
                  <TagPage />
                </ProtectedPage>
              }
            />
            <Route path='/login' element={<LoginPage />} />
            <Route path='*' element={<div>404 Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
