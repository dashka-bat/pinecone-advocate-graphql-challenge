import { useMutation } from "@apollo/client";
import { useState } from "react";
import { gql } from "@apollo/client";

const UPDATE_TASK = gql`
  mutation UpdateTask(
    $taskId: ID!
    $taskName: String
    $description: String
    $priority: Int
    $isDone: Boolean
    $tags: [String]
    $userId: String!
  ) {
    updateTask(
      taskId: $taskId
      taskName: $taskName
      description: $description
      priority: $priority
      isDone: $isDone
      tags: $tags
      userId: $userId
    ) {
      _id
      taskName
      description
      priority
      isDone
      tags
    }
  }
`;

interface UpdateTaskProps {
  refetchActive: () => void; // refetchActive функц
  onClose: () => void; // onClose функц
  task: any; // Сонгосон даалгаврын мэдээлэл
  userId: string; // Хэрэглэгчийн ID
}

export default function UpdateTask({
  refetchActive,
  onClose,
  task,
  userId,
}: UpdateTaskProps) {
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
          taskName: taskName || undefined,
          description: description || undefined,
          priority: priority || undefined,
          isDone,
          tags: tags
            ? tags.split(",").map((tag: any) => tag.trim())
            : undefined,
          userId: userId || "123", // Dynamic user ID
        },
      });

      await refetchActive(); // 🔁 Даалгавар шинэчлэх
      onClose(); // Modal хаах
      setMessage(`Task "${data.updateTask.taskName}" updated!`);
    } catch (err) {
      setMessage(
        `Error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Update Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Бусад оролт талбарууд */}
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className="w-full p-2 border rounded text-black"
        />
        {/* Бусад оролт талбарууд */}
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Task"}
        </button>
      </form>

      {message && (
        <p className={`mt-2 ${error ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
