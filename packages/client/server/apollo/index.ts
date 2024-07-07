import { gql } from '@apollo/client';

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
        src
        description
      }
      title
      text
      privacy
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
        src
        description
      }
      title
      text
      privacy
    }
  }
`;

export const loginUser = gql`
  mutation LoginUser($data: LoginInput!) {
    loginUser(data: $data) {
      # authToken
      refreshToken
      user {
        _id
        username
        role
      }
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
