import { gql } from "apollo-server-cloud-functions";


export const typeDefs = gql`

  type Task {

    _id: ID!

    taskName: String!

    description: String!

    isDone: Boolean!

    priority: Int!

    tags: [String]

    userId: String!

    createdAt: String

    updatedAt: String

  }
 
  type Query {

    getUserDoneTasksLists(userId: String!): [Task]
    getUserNotFinishedTasksLists(userId: String!): [Task]
    getUserTasksLists(userId: String!): [Task]

  }
 
  type Mutation {

    addTask(

      taskName: String!

      description: String!

      priority: Int!

      tags: [String]

      userId: String!

    ): Task
 
    updateTask(

      taskId: ID!

      taskName: String

      description: String

      priority: Int

      isDone: Boolean

      tags: [String]

      userId: String!

    ): Task

  }

`;
 