import { gql } from '@apollo/client';

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
