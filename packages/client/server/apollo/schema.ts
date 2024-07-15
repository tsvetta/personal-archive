export const apolloSchema = `#graphql
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
        description: String
    }

    input PhotoInput {
        src: String!
        description: String
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

    input CreateUserInput {
        username: String!
        password: String!
        role: Privacy!
    }

    input LoginInput {
        username: String!
        password: String!
    }

    type User {
        _id: ID!
        username: String!
        role: Privacy!
        refreshToken: String
    }

    type Query {
        tag(id: ID!): Tag
        tags: [Tag]
        post(id: ID!): Post
        posts: [Post]
        user(id: ID!): User
        users: [User]
    }

    type Mutation {
        addTag(name: String!): Tag
        deleteTag(id: ID!): [Tag]
        addPost(data: PostInput!): Post
        updatePost(id: ID!, data: PostInput!): Post
        deletePost(id: ID!): [Post]

        addUser(data: CreateUserInput!): User
        loginUser(data: LoginInput!): User
    }
`;
