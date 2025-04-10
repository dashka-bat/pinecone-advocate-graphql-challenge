import { get } from "http";
import { addTask } from "./mutations/add-task";
import { updateTask } from "./mutations/update-task";


import { getUserDoneTasksLists } from "./queries/get-User-Done-tasks";
import { getUserNotFinishedTasksLists } from "./queries/get-User-Not-Finished";


export const resolvers = {
  Query: {
  getUserDoneTasksLists,
    getUserNotFinishedTasksLists
  
    
  },
  Mutation: {

    addTask,
    updateTask,
    
  },
};
