

import { addTask } from "@/graphql/resolvers/mutations/add-task";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { getUserDoneTasksLists } from "@/graphql/resolvers/queries/get-User-Done-tasks";
 
dotenv.config({ path: ".env" });
jest.setTimeout(20000); 

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL!);
},20000);
 
afterAll(async () => {
  await mongoose.connection.close();
},20000);
 
describe("Get User Done Tasks Query", () => {
  const userId = "user-done-test";
  const unique = Date.now();
 
  beforeAll(async () => {
    await addTask({}, {
      taskName: "Done Task " + unique,
      description: "This task is marked done",
      priority: 2,
      userId,
      isDone: true
    });
  });
 
  it("should return only done (isDone: true) tasks", async () => {
    const tasks = await getUserDoneTasksLists({}, { userId });
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
    tasks.forEach(task => {
      expect(task.userId).toBe(userId);
      expect(task.isDone).toBe(true);
    });
  });
});
 
 