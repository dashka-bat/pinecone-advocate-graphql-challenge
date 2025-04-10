
import Task from "@/models/Task";
 
 
export const addTask = async (_: any, args: any) => {
  try {
    if(args.description.length < 10) {
      throw new Error("Validation error: Description must be at least 10 characters");   } 
    const task = new Task({ ...args });
    return await task.save();
  } catch (error: any) {
    throw new Error(error?.message || "Something went wrong.");
 
  }
};