import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import { cx } from '../../utils/cx';

import Input, { InputValidationState } from '../../components/Input';
import Button from '../../components/Button';
import FieldPhotos from './field-photos';

import formStyles from '../../components/Form/index.module.css';
import styles from './index.module.css';

const SUBMIT_CREATE_POST_FORM = gql`
  mutation SubmitCreatePostForm($data: PostInput!) {
    addPost(data: $data) {
      _id
      date
    }
  }
`;

type ValidationState = {
  title: InputValidationState;
  date: InputValidationState;
  photos: InputValidationState;
  tags: InputValidationState;
  privacy: InputValidationState;
  text: InputValidationState;
};

export type Photo = {
  id: string;
  src: string;
  description?: string;
};

export enum Privacy {
  ALL = 'ALL',
  FAMILY = 'FAMILY',
  FRIENDS = 'FRIENDS',
  CLOSE_FRIENDS = 'CLOSE_FRIENDS',
  TSVETTA = 'TSVETTA',
}

type CreatePostFormData = {
  title?: string;
  date?: string;
  photos: Photo[];
  tags: string[]; // id
  privacy: Privacy;
  text?: string;
};

const CreatePostPage = () => {
  const now = new Date();
  const d = ('0' + now.getDate()).slice(-2);
  const m = ('0' + (now.getMonth() + 1)).slice(-2);
  const y = now.getFullYear();
  const nowFormatted = `${y}-${m}-${d}`;

  const [formData, setFormData] = useState<CreatePostFormData>({
    title: undefined,
    date: nowFormatted,
    photos: [],
    tags: [],
    privacy: Privacy.ALL,
    text: undefined,
  });

  const [validation, validate] = useState<ValidationState>({
    title: 'default',
    date: 'default',
    photos: 'default',
    tags: 'default',
    privacy: 'default',
    text: 'default',
  });

  const [submitForm] = useMutation(SUBMIT_CREATE_POST_FORM);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotosChange =
    (changedId: string, type: 'src' | 'description') => (e: any) => {
      const { value } = e.target;

      const updatedPhotos = formData.photos.map((photo) => {
        if (changedId === photo.id) {
          return {
            ...photo,
            [type]: value,
          };
        }
        return photo;
      });

      setFormData({
        ...formData,
        photos: updatedPhotos,
      });
    };

  const handleAddPhoto = () => {
    setFormData({
      ...formData,
      photos: [
        ...formData.photos,
        { id: Math.random().toString(), src: '', description: '' },
      ],
    });
  };

  const handleDeletePhoto = (deleteId: string) => () => {
    const photosWithoutDeleted = formData.photos.filter(
      (photo) => photo.id !== deleteId
    );

    setFormData({
      ...formData,
      photos: [...photosWithoutDeleted],
    });
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    validate({
      title: 'success',
      date: 'success',
      photos: 'success',
      tags: 'success',
      privacy: 'success',
      text: 'success',
    });

    console.log('handleSubmit', formData);

    try {
      const { data } = await submitForm({
        variables: {
          data: {
            title: formData.title,
            date: formData.date,
            photos: formData.photos,
            tags: formData.tags,
            privacy: formData.privacy,
            text: formData.text,
          },
        },
      });
      console.log('try', data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form
      id='create-post-form'
      onSubmit={handleSubmit}
      className={formStyles.form}
    >
      <fieldset className={cx([formStyles.fieldset, styles.formInner])}>
        <legend>Create Post</legend>

        <div className={formStyles.field}>
          <label htmlFor='title'>Title:</label>
          <Input
            placeholder={now.toLocaleDateString('ru-RU')} // по умолчанию заголовок - дата поста
            name='title'
            onChange={handleChange}
            state={validation.title}
            value={formData.title}
          />
        </div>

        <div className={formStyles.field}>
          <label htmlFor='date'>Date:</label>
          <Input
            placeholder={now.toLocaleDateString('ru-RU')}
            type='date'
            name='date'
            onChange={handleChange}
            state={validation.date}
            value={formData.date}
          />
        </div>

        <FieldPhotos
          value={formData.photos}
          onChange={handlePhotosChange}
          onAddPhoto={handleAddPhoto}
          onDeletePhoto={handleDeletePhoto}
        />

        {/* multi select */}
        <div className={formStyles.field}>
          <label htmlFor='tags'>Tags:</label>
          <Input
            placeholder='Tags'
            type='text'
            name='tags'
            onChange={handleChange}
            state={validation.tags}
            value={formData.tags[0]}
          />
        </div>

        {/* textarea */}
        <div className={formStyles.field}>
          <label htmlFor='text'>Text:</label>
          <Input
            placeholder='Text'
            type='textarea'
            name='text'
            onChange={handleChange}
            state={validation.text}
            value={formData.text}
          />
        </div>

        {/* select */}
        <div className={formStyles.field}>
          <label htmlFor='privacy'>Privacy:</label>
          <Input
            placeholder='ALL'
            type='text'
            name='privacy'
            onChange={handleChange}
            state={validation.privacy}
            value={formData.privacy}
          />
        </div>

        <Button type='submit'>Save</Button>
      </fieldset>
    </form>
  );
};

export default CreatePostPage;
