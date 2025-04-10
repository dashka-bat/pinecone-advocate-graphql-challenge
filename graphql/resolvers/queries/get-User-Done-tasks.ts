import Task from "@/models/Task";

 
 
export const getUserDoneTasksLists = async (_: any, { userId }: any) => {
  const tasks =  await Task.find({ userId, isDone: true });
  
  return tasks;
 
};