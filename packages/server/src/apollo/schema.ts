export const apolloSchema = `#graphql
    scalar Date
    scalar JSON

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

    type CDNPhoto {
        _id: ID!
        fileUrl: String!
        filePreview: String
        published: Boolean!
    }

    type Photo {
        _id: ID!
        src: String
        description: String
        file: CDNPhoto
    }

    input FileInput {
        _id: ID!
    }

    input PhotoInput {
        file: FileInput
        src: String
        description: String
    }

    type Post {
        _id: ID!
        date: Date,
        normalizedDate: Date,
        photos: [Photo]
        tags: [Tag]
        accessLevel: Int!
        text: String
        title: String
        createdAt: Date
    }

    input PostInput {
        date: Date
        photos: [PhotoInput]
        tags: [String]
        accessLevel: Int!
        text: String
        title: String
    }

    input CreateUserInput {
        username: String!
        password: String!
        role: Privacy
        accessLevel: Int!
    }

    input LoginInput {
        username: String!
        password: String!
    }

    type User {
        _id: ID!
        username: String!
        role: Privacy
        accessLevel: Int!
        refreshToken: String
    }

    enum Sort {
        asc
        desc
    }

    input PostsFilter {
        date: Sort
        createdAt: Sort
        tags: [ID]
    }
    
    type Query {
        tag(id: ID!): Tag
        tags: [Tag]
        post(id: ID!): Post
        posts(filter: PostsFilter): [Post]
        user(id: ID!): User
        users: [User]
        cdnPhoto(id: ID!): CDNPhoto
        cdnPhotos(published: Boolean, limit: Int, skip: Int): [CDNPhoto]
    }

    type Mutation {
        addTag(name: String!): Tag
        deleteTag(id: ID!): [Tag]
        addPost(data: PostInput!): Post
        updatePost(id: ID!, data: PostInput!): Post
        deletePost(id: ID!): [Post]

        addUser(data: CreateUserInput!): User
        loginUser(data: LoginInput!): User
        logoutUser: String

        setPhotoPublished(id: ID!): CDNPhoto
    }
`;
