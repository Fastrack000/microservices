const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Product {
    id: ID!
    name: String!
    price: Int!
    inventory: Int!
  }

  type Order {
    id: ID!
    productId: ID!
    userId: ID!
    quantity: Int!
    status: String!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    price: Float!
    inventory: Int!
  }

  input OrderInput {
    productId: ID!
    userId: ID!
    quantity: Int!
  }
  type Error {
    message: String!
  }
  type Query {
    users: [User!]!
    user(email: String!): User | Error
    products: [Product!]!
    product(id: ID!): Product
    orders: [Order!]!
    order(id: ID!): Order
  }
  
  

  union ProductResponse = Product | Error
  union UserResponse = User | Error

  type Mutation {
    registerUser(input: RegisterInput!): UserResponse
    createProduct(input: ProductInput!): ProductResponse
    placeOrder(input: OrderInput!): Order
  }
`;

module.exports = typeDefs;