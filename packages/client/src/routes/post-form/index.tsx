import {
  ChangeEventHandler,
  FormEventHandler,
  Key,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import { cx } from '../../utils/cx';
import { getDateFormatted, nowRu } from '../../utils/date-formatted';

import { TagData } from '../../components/Tags';
import Input from '../../components/Input';
import Button from '../../components/Button';
import InputTagsSuggest from '../../components/InputTagsSuggest';
import Select, { SelectOption } from '../../components/Select';

import formStyles from '../../components/Form/index.module.css';
import styles from './index.module.css';

import {
  addTag,
  deleteTag,
  getTags,
  submitCreatePostForm,
  getPost,
  submitEditPostForm,
} from '../../../server/apollo/index.js';

import FieldPhotos from './field-photos';
import { ValidationState, validateForm } from './form-validation';

export type Photo = {
  id: string;
  _id: string;
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

const selectOptions: SelectOption[] = [
  undefined,
  {
    id: Privacy.ALL,
    name: Privacy.ALL,
  },
  {
    id: Privacy.FAMILY,
    name: Privacy.FAMILY,
  },
  {
    id: Privacy.FRIENDS,
    name: Privacy.FRIENDS,
  },
  {
    id: Privacy.CLOSE_FRIENDS,
    name: Privacy.CLOSE_FRIENDS,
  },
  {
    id: Privacy.TSVETTA,
    name: Privacy.TSVETTA,
  },
];

export type CreatePostFormData = {
  title?: string;
  date?: string;
  photos: Photo[];
  tags: TagData[];
  privacy?: Privacy;
  text?: string;
};

const deafultFormData: CreatePostFormData = {
  title: '',
  photos: [],
  tags: [],
  privacy: undefined,
  text: '',
};

const mapFormData = (formData: CreatePostFormData) => ({
  title: formData.title || undefined,
  date: formData.date,
  photos: formData.photos.map((photo) => ({
    src: photo.src,
    description: photo.description,
  })),
  tags: formData.tags.map((tag) => tag._id),
  privacy: formData.privacy,
  text: formData.text || undefined,
});

const PostFormPage = () => {
  // is Edit page
  const { id: urlId } = useParams();
  const { data: postData } = useQuery(getPost, {
    variables: { id: urlId },
    skip: !urlId,
  });
  const isEditPage = Boolean(urlId);

  const { data: tagsData } = useQuery(getTags);
  const [submitCreateForm] = useMutation(submitCreatePostForm);
  const [submitEditForm] = useMutation(submitEditPostForm);
  const [submitAddTag] = useMutation(addTag);
  const [submitDeleteTag] = useMutation(deleteTag);

  const nowFormatted = getDateFormatted();

  const initialFormData = postData
    ? { ...postData.post, date: getDateFormatted(postData.post.date) } // is Edit page
    : {
        date: nowFormatted,
        ...deafultFormData,
      };
  const [formData, setFormData] = useState<CreatePostFormData>(initialFormData);

  const [fieldsValidation, setFieldsValidation] = useState<ValidationState>(
    validateForm(formData, true)
  );

  // when route chacnges?
  useEffect(() => {
    if (postData?.post) {
      setFormData({
        ...postData.post,
        date: getDateFormatted(postData.post.date),
      });
    } else {
      setFormData({
        date: nowFormatted,
        ...deafultFormData,
      });
    }
  }, [postData, urlId]);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      const { name, value } = e.target;

      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    []
  );

  const handlePhotosChange = useCallback(
    (changedId: string, type: 'src' | 'description') => (e: any) => {
      const { value } = e.target;

      const updatedPhotos = formData.photos.map((photo) => {
        const photoId = photo.id || photo._id; // TODO remove duplication

        if (changedId === photoId) {
          return {
            ...photo,
            [type]: value,
          };
        }

        return photo;
      });

      setFormData((prevData) => ({ ...prevData, photos: updatedPhotos }));
    },
    [formData.photos]
  );

  const handleTagsChange = useCallback(
    (clickedTag: TagData) => {
      const isNewTag =
        formData.tags.find((t) => t._id === clickedTag._id) === undefined;

      const updatedTags = isNewTag
        ? [...formData.tags, clickedTag]
        : formData.tags.filter((t) => t._id !== clickedTag._id);

      setFormData((prevData) => ({ ...prevData, tags: updatedTags }));
    },
    [formData.tags]
  );

  const handleTagCreate = useCallback(
    async (name: string) => {
      try {
        const { data } = await submitAddTag({
          variables: {
            name,
          },
          refetchQueries: ['Tags'],
        });

        setFormData((prevData) => ({
          ...prevData,
          tags: [...formData.tags, data.addTag],
        }));
      } catch (error: any) {
        console.error('Error saving tag:', error.message);
      }
    },
    [submitAddTag]
  );

  const handleTagDelete = useCallback(
    async (id: Key) => {
      try {
        await submitDeleteTag({
          variables: {
            id,
          },
          refetchQueries: ['Tags'],
        });
      } catch (error: any) {
        console.error('Error deleting tag:', error.message);
      }
    },
    [submitDeleteTag]
  );

  const handleAddPhoto = useCallback(() => {
    setFormData((prevData) => ({
      ...prevData,
      photos: [
        ...formData.photos,
        {
          id: Math.random().toString(),
          _id: Math.random().toString(), // TODO remove duplication
          src: '',
          description: '',
        },
      ],
    }));
  }, [formData.photos]);

  const handleDeletePhoto = useCallback(
    (deleteId: string) => () => {
      const photosWithoutDeleted = formData.photos.filter(
        (photo) => photo.id !== deleteId
      );

      setFormData((prevData) => ({
        ...prevData,
        photos: [...photosWithoutDeleted],
      }));
    },
    [formData.photos]
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const preSubmitValidationState = validateForm(formData);
    setFieldsValidation(preSubmitValidationState);

    if (!preSubmitValidationState.isValid) {
      throw new Error('Create Post: Validation fail!');
    }

    const preparedData = mapFormData(formData);

    if (isEditPage) {
      try {
        await submitEditForm({
          variables: {
            id: urlId,
            data: preparedData,
          },
          refetchQueries: ['Posts'],
        });

        // редирект на страницу поста?
        // нотификация об успешном обновлении
      } catch (error: any) {
        console.error('Error submitting form:', error.message);
      }

      return;
    }

    try {
      const { data } = await submitCreateForm({
        variables: {
          data: preparedData,
        },
        refetchQueries: ['Posts'],
      });

      // очищать форму
      // нотификация об успешном добавлении
    } catch (error: any) {
      console.error('Error submitting form:', error.message);
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

        <label htmlFor='title'>Title:</label>
        <Input
          placeholder={formData.date === nowFormatted ? nowRu : formData.date} // по умолчанию заголовок - дата поста
          name='title'
          value={formData.title || ''}
          onChange={handleChange}
        />

        <label htmlFor='date'>Date:</label>
        <Input
          placeholder={nowRu}
          type='date'
          name='date'
          value={formData.date}
          onChange={handleChange}
        />

        <FieldPhotos
          value={formData.photos}
          onChange={handlePhotosChange}
          onAddPhoto={handleAddPhoto}
          onDeletePhoto={handleDeletePhoto}
          validation={fieldsValidation.photos}
        />

        <label htmlFor='tags'>
          Tags<sup>*</sup>:
        </label>
        <InputTagsSuggest
          name='tags'
          placeholder='Input tags here'
          validation={fieldsValidation.tags}
          data={tagsData?.tags}
          value={formData.tags}
          onChange={handleTagsChange}
          onTagCreate={handleTagCreate}
          onTagDelete={handleTagDelete}
        />

        <label htmlFor='text'>Text:</label>
        <Input
          placeholder='Text'
          type='textarea'
          name='text'
          onChange={handleChange}
          value={formData.text || ''}
        />

        <label htmlFor='privacy'>Privacy:</label>
        <Select
          name='privacy'
          options={selectOptions}
          value={formData.privacy}
          validation={fieldsValidation.tags}
          onChange={handleChange}
        />

        <Button type='submit' className={styles.submitFormButton}>
          Save
        </Button>

        {fieldsValidation.formError && (
          <span className={styles.errorMessage}>
            {fieldsValidation.formError}
          </span>
        )}
      </fieldset>
    </form>
  );
};

export default PostFormPage;
