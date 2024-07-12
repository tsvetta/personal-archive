import { Routes, Route } from 'react-router-dom';

import './index.css';
import commonStyles from './common.module.css';

import PageHeader from './components/PageHeader/index.js';

import MainPage from './routes/main/index.js';
import LoginPage from './routes/login/index.js';
import PostFormPage from './routes/post-form/index.js';

const App = () => {
  return (
    <div className={commonStyles.pageContainer}>
      <PageHeader title={'tsvetta archive'} />
      <div className='page-content'>
        <main className='main'>
          <Routes>
            <Route path='/' element={<MainPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/create-post' element={<PostFormPage />} />
            {/* <Route path="/post/:id" element={<PostPage />} /> */}
            <Route path='/post/:id/edit' element={<PostFormPage />} />
            {/* <Route path="/tag/:id" element={<MainPage />} /> */}
            <Route path='*' element={<div>404 Not Found</div>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
