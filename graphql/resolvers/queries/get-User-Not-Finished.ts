

import Task from "@/models/Task";
 
 
export const getUserNotFinishedTasksLists = async (_:any,{ userId }: { userId: string })=>{
    return await Task.find({ userId, isDone: false });
   
}