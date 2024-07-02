import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import Input, { InputValidationState } from '../../components/Input';
import Button from '../../components/Button';

import formStyles from '../../components/Form/index.module.css';

const SUBMIT_CREATE_POST_FORM = gql`
  mutation SubmitCreatePostForm($data: PostInput!) {
    addPost(data: $data) {
      success
      message
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

const CreatePostPage = () => {
  const now = new Date();
  const d = ('0' + now.getDate()).slice(-2);
  const m = ('0' + (now.getMonth() + 1)).slice(-2);
  const y = now.getFullYear();
  const nowFormatted = `${y}-${m}-${d}`;

  const [formData, setFormData] = useState({
    title: now.toLocaleDateString('ru-RU'),
    date: nowFormatted,
    photos: [],
    tags: [],
    privacy: 'ALL',
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

    console.log(name, value);

    setFormData({
      ...formData,
      [name]: value,
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

    try {
      console.log(formData);
      const { data } = await submitForm({
        variables: {
          input: {
            name: formData.title,
            password: formData.date,
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
      <fieldset className={formStyles.fieldset}>
        <legend>Create Post</legend>

        <div className={formStyles.field}>
          <label htmlFor='title'>Title:</label>
          <Input
            placeholder='title'
            name='title'
            autoComplete='title'
            onChange={handleChange}
            state={validation.title}
            value={formData.title}
          />
        </div>

        <div className={formStyles.field}>
          <label htmlFor='date'>Date:</label>
          <Input
            placeholder='date'
            type='date'
            name='date'
            autoComplete='date'
            onChange={handleChange}
            state={validation.date}
            value={formData.date}
          />
        </div>

        {/* + */}
        <div className={formStyles.field}>
          <label htmlFor='photos'>Photos:</label>
          <Input
            placeholder='photos'
            type='text'
            name='photos'
            autoComplete='photos'
            onChange={handleChange}
            state={validation.photos}
            value={formData.photos[0]}
          />
        </div>

        {/* multi select */}
        <div className={formStyles.field}>
          <label htmlFor='tags'>Tags:</label>
          <Input
            placeholder='tags'
            type='text'
            name='tags'
            autoComplete='tags'
            onChange={handleChange}
            state={validation.tags}
            value={formData.tags[0]}
          />
        </div>

        {/* textarea */}
        <div className={formStyles.field}>
          <label htmlFor='text'>Text:</label>
          <Input
            placeholder='text'
            type='text'
            name='text'
            autoComplete='text'
            onChange={handleChange}
            state={validation.text}
            value={formData.text}
          />
        </div>

        {/* select */}
        <div className={formStyles.field}>
          <label htmlFor='privacy'>Privacy:</label>
          <Input
            placeholder='privacy'
            type='text'
            name='privacy'
            autoComplete='privacy'
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
