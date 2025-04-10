
import { addTask } from "@/graphql/resolvers/mutations/add-task";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { getUserDoneTasksLists } from "@/graphql/resolvers/queries/get-User-Done-tasks";
import { getUserNotFinishedTasksLists } from "@/graphql/resolvers/queries/get-User-Not-Finished";
 
dotenv.config({ path: ".env" });
jest.setTimeout(20000); // 20 seconds

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URL!);
},20000);
 
afterAll(async () => {
  await mongoose.connection.close();
});
 
describe("Get User Active Tasks Query", () => {
  const userId = "user-active-test";
  const unique = Date.now();
 
  beforeAll(async () => {
    await addTask({}, {
      taskName: "Active Task " + unique,
      description: "This is an active task and should show up",
      priority: 3,
      userId,
      isDone: false
    });
  });
 
  it("should return only active (isDone: false) tasks", async () => {
    const tasks = await getUserNotFinishedTasksLists({}, { userId });
    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
    tasks.forEach(task => {
      expect(task.userId).toBe(userId);
      expect(task.isDone).toBe(false);
    });
  });
});