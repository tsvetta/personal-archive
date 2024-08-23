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

import { cx } from '../../utils/cx.js';
import { getDateFormatted } from '../../utils/date-formatted.js';

import { TagData } from '../../components/Tags/index.js';
import Input from '../../components/Input/index.js';
import Button from '../../components/Button/index.js';
import InputTagsSuggest from '../../components/InputTagsSuggest/index.js';
import Select, { SelectOption } from '../../components/Select/index.js';

import formStyles from '../../components/Form/index.module.css';
import styles from './index.module.css';

import {
  addTag,
  deleteTag,
  getTags,
  submitCreatePostForm,
  getPost,
  submitEditPostForm,
  setPhotoPublished,
  getBBCDNPhotos,
  getPosts,
} from '../../../server/apollo/queries.js';
import { AccessLevels, Photo, Privacy } from '../../../server/apollo/types.js';

import FieldPhotos from './field-photos.js';
import { ValidationState, validateForm } from './form-validation.js';

const selectOptions: SelectOption[] = [
  '',
  {
    value: 0,
    name: Privacy.ALL,
  },
  {
    value: 1,
    name: Privacy.FAMILY,
  },
  {
    value: 2,
    name: Privacy.FRIENDS,
  },
  {
    value: 3,
    name: Privacy.CLOSE_FRIENDS,
  },
  {
    value: 4,
    name: Privacy.TSVETTA,
  },
];

export type CreatePostFormData = {
  title?: string;
  date?: string;
  photos: Photo[];
  tags: TagData[];
  accessLevel?: AccessLevels | '';
  text?: string;
};

const deafultFormData: CreatePostFormData = {
  title: '',
  date: undefined,
  photos: [],
  tags: [],
  accessLevel: '',
  text: '',
};

const mapFormData = (formData: CreatePostFormData) => ({
  title: formData.title || undefined,
  date: formData.date,
  photos: formData.photos.map((photo: Photo) => ({
    file: photo.file?._id
      ? {
          _id: photo.file?._id,
        }
      : undefined,
    src: photo.src,
    description: photo.description,
  })),
  tags: formData.tags.map((tag) => tag._id),
  accessLevel: Number(formData.accessLevel),
  text: formData.text || undefined,
});

const PostFormPage = () => {
  const { id: urlId } = useParams();
  const isEditPage = Boolean(urlId);

  const { data: postData } = useQuery(getPost, {
    variables: { id: urlId },
    skip: !urlId,
  });

  const { data: tagsData } = useQuery(getTags);
  const [submitCreateForm] = useMutation(submitCreatePostForm);
  const [submitEditForm] = useMutation(submitEditPostForm);
  const [submitAddTag] = useMutation(addTag);
  const [submitDeleteTag] = useMutation(deleteTag);
  const [publishPhoto] = useMutation(setPhotoPublished);

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

  // when route changes
  useEffect(() => {
    if (postData?.post) {
      setFormData({
        ...postData.post,
        date: getDateFormatted(postData.post.date),
      });
    } else {
      setFormData({
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
        const photoId = photo._id;

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
          tags: [...prevData.tags, data.addTag],
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
          _id: Math.random().toString(),
          src: '',
          description: '',
        },
      ],
    }));
  }, [formData.photos]);

  const handleDeletePhoto = useCallback(
    (deleteId: string) => () => {
      const photosWithoutDeleted = formData.photos.filter(
        (photo) => photo._id !== deleteId
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

    try {
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
            refetchQueries: [
              {
                query: getPosts,
              },
            ],
          });

          // редирект на страницу поста?
          // нотификация об успешном обновлении
        } catch (error: any) {
          throw new Error('Edit Post: Validation fail!');
        }

        return;
      }

      const { data } = await submitCreateForm({
        variables: {
          data: preparedData,
        },
        refetchQueries: [
          {
            query: getPosts,
          },
          {
            query: getBBCDNPhotos,
            variables: {
              published: false,
              limit: 20,
              skip: 0,
            },
          },
        ],
      });

      const hasPhotos = formData.photos.length > 0;
      if (hasPhotos) {
        formData.photos.forEach(async (photo) => {
          const isPhotoFromGallery = Boolean(photo.fromGallery);

          if (isPhotoFromGallery && photo.src) {
            await publishPhoto({
              variables: { id: photo._id },
              refetchQueries: [
                {
                  query: getBBCDNPhotos,
                  variables: { published: false, limit: 20, skip: 0 },
                },
              ],
            });
          }
        });
      }

      setFormData(deafultFormData);
      setFieldsValidation(validateForm(deafultFormData, true));
    } catch (error: any) {
      console.error('Error submitting form:', error.message);
    }
  };

  const handleGalleryPhotoClick = useCallback(
    (photo: any) => {
      setFormData((prevData: CreatePostFormData) => {
        const photosWithoutLast =
          prevData.photos.length <= 1 ? [] : prevData.photos.slice(0, -1);
        const photoLast =
          prevData.photos.length === 0 ? {} : prevData.photos.slice(-1)[0];

        return {
          ...prevData,
          photos: [
            ...photosWithoutLast,
            {
              ...photoLast,
              _id: photo._id,
              file: {
                _id: photo._id,
                fileUrl: photo.fileUrl,
                filePreview: photo.filePreview,
              },
              fromGallery: true,
            },
          ],
        };
      });
    },
    [formData.photos]
  );

  const handleAddDate = () => {
    setFormData((prevData) => ({
      ...prevData,
      date: nowFormatted,
    }));
  };

  const hanldeDeleteDate = () => {
    setFormData((prevData) => ({
      ...prevData,
      date: undefined,
    }));
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
          placeholder={formData.date || 'Заголовок поста'}
          name='title'
          value={formData.title || ''}
          onChange={handleChange}
          autoComplete='off'
        />

        <div>
          <label htmlFor='date'>Date:</label>
          {!formData.date && (
            <Button
              size='s'
              className={styles.addPhotoButton}
              onClick={handleAddDate}
              testId={'add-date-button'}
            >
              +
            </Button>
          )}
          {formData.date && (
            <div className={styles.dateFieldWrapper}>
              <Input
                type='date'
                name='date'
                value={formData.date}
                className={styles.dateFieldInput}
                onChange={handleChange}
                testId='date-input'
              />
              <Button
                view='danger'
                size='s'
                onClick={hanldeDeleteDate}
                className={styles.dateFieldDeleteButton}
              >
                x
              </Button>
            </div>
          )}
        </div>

        <FieldPhotos
          value={formData.photos}
          onChange={handlePhotosChange}
          onAddPhoto={handleAddPhoto}
          onDeletePhoto={handleDeletePhoto}
          validation={fieldsValidation.photos}
          showGallery={!isEditPage}
          onGalleryPhotoClick={handleGalleryPhotoClick}
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

        <label htmlFor='accessLevel'>Access Level:</label>
        <Select
          name='accessLevel'
          options={selectOptions}
          value={formData.accessLevel}
          validation={fieldsValidation.accessLevel}
          onChange={handleChange}
          testId='access-level-select'
        />

        <Button type='submit' className={styles.submitFormButton}>
          Save
        </Button>

        {fieldsValidation.formError && (
          <span className={cx([formStyles.errorMessage, styles.errorMessage])}>
            {fieldsValidation.formError}
          </span>
        )}
      </fieldset>
    </form>
  );
};

export default PostFormPage;
