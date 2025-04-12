import { gql, useQuery, useMutation } from "@apollo/client";
import { useAuth, RedirectToSignIn, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@mui/material";
import { MessageSquareDiff } from "lucide-react";
import Link from "next/link";

const GET_USER_ACTIVE_TASKS = gql`
  query GetUserActiveTasks($userId: String!) {
    getUserNotFinishedTasksLists(userId: $userId) {
      _id
      taskName
      description
      priority
      isDone
      tags
    }
  }
`;

const GET_USER_DONE_TASKS = gql`
  query getUserDoneTasksLists($userId: String!) {
    getUserDoneTasksLists(userId: $userId) {
      _id
      taskName
      description
      priority
      isDone
      tags
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask(
    $taskId: ID!
    $taskName: String
    $description: String
    $priority: Int
    $tags: [String]
    $isDone: Boolean
    $userId: String!
  ) {
    updateTask(
      taskId: $taskId
      taskName: $taskName
      description: $description
      priority: $priority
      tags: $tags
      isDone: $isDone
      userId: $userId
    ) {
      taskName
    }
  }
`;

export default function Home() {
  const { user, isLoaded } = useUser();
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setUserId(user.id);
    }
  }, [isLoaded, user]);

  const {
    data: activeData,
    loading: activeLoading,
    error: activeError,
    refetch: refetchActive, // 🔥 энэ шугамыг нэм
  } = useQuery(GET_USER_ACTIVE_TASKS, {
    variables: { userId: userId || "" },
    skip: !userId,
  });

  const {
    data: doneData,
    loading: doneLoading,
    error: doneError,
  } = useQuery(GET_USER_DONE_TASKS, {
    variables: { userId: userId || "" },
    skip: !userId,
  });

  if (!isLoaded) return <p>Loading...</p>;
  if (!user) return <RedirectToSignIn />;
  if (activeLoading || doneLoading) return <p>Loading...</p>;
  if (activeError || doneError)
    return <p>Error: {activeError?.message || doneError?.message}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Task Dashboard</h1>
      <p>Welcome, {user.firstName}!</p>

      {/* Active Tasks */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Active Tasks</h2>
        <div className="space-y-5">
          <Link href={"/addTask"}>
            <button>
              add Task
              <MessageSquareDiff />
            </button>
          </Link>
          {activeData?.getUserNotFinishedTasksLists?.length === 0 ? (
            <div>
              <p>No active tasks found.</p>
            </div>
          ) : (
            activeData?.getUserNotFinishedTasksLists?.map((task: any) => (
              <div
                key={task._id}
                className="border p-5 rounded mb-4 flex justify-between"
              >
                <div>
                  <h3 className="font-bold">{task.taskName}</h3>
                  <p>{task.description}</p>
                  <p>Priority: {task.priority}</p>
                  <p>Is Done: {task.isDone ? "Yes" : "No"}</p>
                  <p>Tags: {task.tags?.join(", ")}</p>
                </div>
                <button onClick={() => setSelectedTask(task)}>
                  <Pencil />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Done Tasks */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Completed Tasks</h2>
        <div className="space-y-4">
          {doneData?.getUserDoneTasksLists?.length === 0 ? (
            <p>No completed tasks found.</p>
          ) : (
            doneData?.getUserDoneTasksLists?.map((task: any) => (
              <div
                key={task._id}
                className="border p-4 rounded mb-4 flex justify-between"
              >
                <div>
                  <h3 className="font-bold">{task.taskName}</h3>
                  <p>{task.description}</p>
                  <p>Priority: {task.priority}</p>
                  <p>Is Done: {task.isDone ? "Yes" : "No"}</p>
                  <p>Tags: {task.tags?.join(", ")}</p>
                </div>
                <button onClick={() => setSelectedTask(task)}>
                  <Pencil />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Update Task Modal */}
      {selectedTask && (
        <UpdateTaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          userId={user.id}
        />
      )}
    </div>
  );
}

function UpdateTaskModal({
  task,
  onClose,
  userId,
}: {
  task: any;
  onClose: () => void;
  userId: string;
}) {
  const [taskName, setTaskName] = useState(task.taskName || "");
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || 1);
  const [tags, setTags] = useState(task.tags?.join(", ") || "");
  const [isDone, setIsDone] = useState(task.isDone || false);
  const [message, setMessage] = useState("");
  const [updateTask, { loading, error }] = useMutation(UPDATE_TASK);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await updateTask({
        variables: {
          taskId: task._id,
          taskName,
          description,
          priority,
          isDone,
          tags: tags
            ? tags.split(",").map((tag: string) => tag.trim())
            : undefined,
          userId,
        },
      });
      setMessage(`"${data.updateTask.taskName}" шинэчлэгдлээ!`);
      onClose();
    } catch (err) {
      setMessage(
        `Алдаа: ${err instanceof Error ? err.message : "Тодорхойгүй алдаа"}`
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-black">
        <h2 className="text-xl font-bold mb-4">Даалгавар шинэчлэх</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Task Name"
            className="w-full p-2 border rounded"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            placeholder="Priority"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags"
            className="w-full p-2 border rounded"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isDone}
              onChange={(e) => setIsDone(e.target.checked)}
            />
            <span>Task Completed</span>
          </label>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Болих
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              {loading ? "Шинэчилж байна..." : "Шинэчлэх"}
            </button>
          </div>
        </form>
        {message && (
          <p className={`mt-2 ${error ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
interface Task {
  _id: string;
  taskName: string;
  description: string;
  priority: number;
  isDone: boolean;
  tags: string[];
}

interface ActiveTasksData {
  getUserNotFinishedTasksLists: Task[];
}

interface DoneTasksData {
  getUserDoneTasksLists: Task[];
}

interface UpdateTaskVariables {
  taskId: string;
  taskName?: string;
  description?: string;
  priority?: number;
  tags?: string[];
  isDone?: boolean;
  userId: string;
}

interface UpdateTaskResponse {
  updateTask: {
    taskName: string;
  };
}
