import { gql } from 'graphql-tag';

export const getPosts = gql`
  query Posts {
    posts {
      _id
      date
      tags {
        _id
        name
      }
      photos {
        _id
        description
        file {
          fileUrl
          filePreview
        }
      }
      title
      text
      accessLevel
    }
  }
`;

export const getPost = gql`
  query Post($id: ID!) {
    post(id: $id) {
      _id
      date
      tags {
        _id
        name
      }
      photos {
        _id
        description
        file {
          fileUrl
          filePreview
        }
      }
      title
      text
      accessLevel
    }
  }
`;

export const getUser = gql`
  query User($id: ID!) {
    user(id: $id) {
      _id
      username
      role
      accessLevel
      refreshToken
    }
  }
`;

export const loginUser = gql`
  mutation LoginUser($data: LoginInput!) {
    loginUser(data: $data) {
      _id
      username
      role
      accessLevel
      refreshToken
    }
  }
`;

export const getTags = gql`
  query Tags {
    tags {
      _id
      name
      posts {
        _id
      }
    }
  }
`;

export const addTag = gql`
  mutation AddTag($name: String!) {
    addTag(name: $name) {
      _id
      name
    }
  }
`;

export const deleteTag = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(id: $id) {
      name
    }
  }
`;

export const submitCreatePostForm = gql`
  mutation SubmitCreatePostForm($data: PostInput!) {
    addPost(data: $data) {
      _id
    }
  }
`;

export const submitEditPostForm = gql`
  mutation SubmitEditPostForm($id: ID!, $data: PostInput!) {
    updatePost(id: $id, data: $data) {
      _id
    }
  }
`;

export const deletePostMutation = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      _id
    }
  }
`;

export const getBBCDNPhotos = gql`
  query BBCNDPhotos($published: Boolean, $limit: Int, $skip: Int) {
    cdnPhotos(published: $published, limit: $limit, skip: $skip) {
      _id
      fileUrl
      filePreview
      published
    }
  }
`;

export const setPhotoPublished = gql`
  mutation SetPhotoPublished($id: ID!) {
    setPhotoPublished(id: $id) {
      _id
      fileUrl
      filePreview
      published
    }
  }
`;
