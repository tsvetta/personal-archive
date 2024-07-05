import {
  ChangeEventHandler,
  FormEventHandler,
  Key,
  useCallback,
  useState,
} from 'react';
import { useMutation, useQuery } from '@apollo/client';

import { cx } from '../../utils/cx';
import { getNowFormatted, nowRu } from '../../utils/date-formatted';

import { TagData } from '../../components/Tags';
import Input from '../../components/Input';
import Button from '../../components/Button';
import InputTagsSuggest from '../../components/InputTagsSuggest';
import Select, { SelectOption } from '../../components/Select';

import formStyles from '../../components/Form/index.module.css';
import styles from './index.module.css';

import { addTag, deleteTag, getTags, submitCreatePostForm } from '../../api';

import FieldPhotos from './field-photos';
import { ValidationState, validateForm } from './form-validation';

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

const CreatePostPage = () => {
  const { data: tagsData } = useQuery(getTags);
  const [submitForm] = useMutation(submitCreatePostForm);
  const [submitAddTag] = useMutation(addTag);
  const [submitDeleteTag] = useMutation(deleteTag);

  const nowFormatted = getNowFormatted();

  const [formData, setFormData] = useState<CreatePostFormData>({
    date: nowFormatted,
    ...deafultFormData,
  });

  const [fieldsValidation, setFieldsValidation] = useState<ValidationState>(
    validateForm(formData, true)
  );

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
        if (changedId === photo.id) {
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
      } catch (error) {
        console.error('Error saving tag:', error);
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
      } catch (error) {
        console.error('Error deleting tag:', error);
      }
    },
    [submitDeleteTag]
  );

  const handleAddPhoto = useCallback(() => {
    setFormData((prevData) => ({
      ...prevData,
      photos: [
        ...formData.photos,
        { id: Math.random().toString(), src: '', description: '' },
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

    try {
      const { data } = await submitForm({
        variables: {
          data: preparedData,
        },
        refetchQueries: ['Posts'],
      });

      // очищать форму
      // нотификация об успешном добавлении
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

        <label htmlFor='title'>Title:</label>
        <Input
          placeholder={nowRu} // по умолчанию заголовок - дата поста
          name='title'
          value={formData.title}
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
          value={formData.text}
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

export default CreatePostPage;
