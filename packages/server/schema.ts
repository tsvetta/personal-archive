export const schema = `#graphql
    scalar Date

    enum Privacy {
        ALL
        FAMILY
        FRIENDS
        CLOSE_FRIENDS
        TSVETTA
    }

    type Tag {
        _id: ID!
        name: String!
        posts: [Post]
    }

    type Photo {
        _id: ID!
        src: String!
        description: [String]
    }

    input PhotoInput {
        src: String!
        description: [String]
    }

    type Post {
        _id: ID!
        date: Date
        photos: [Photo]
        tags: [Tag]
        privacy: Privacy!
        text: String
        title: String
    }

    input PostInput {
        date: Date
        photos: [PhotoInput]
        tags: [String]
        privacy: Privacy!
        text: String
        title: String
    }

    input LoginFormInput {
        name: String!
        password: String!
    }

    type FormResponse {
        success: Boolean!
        message: String!
    }

    type Query {
        tag(id: ID!): Tag
        tags: [Tag]
        post(id: ID!): Post
        posts: [Post]
    }

    type Mutation {
        addTag(name: String!): Tag
        deleteTag(id: ID!): [Tag]
        addPost(data: PostInput!): Post
        updatePost(id: ID!, data: PostInput!): Post
        deletePost(id: ID!): [Post]

        submitLoginForm(input: LoginFormInput!): FormResponse!
    }
`;
