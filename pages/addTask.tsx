import { gql } from "@apollo/client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { TextField, Button, Box, Typography, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

export const ADD_TASK = gql`
  mutation AddTask(
    $taskName: String!
    $description: String!
    $priority: Int!
    $tags: [String]
    $userId: String!
  ) {
    addTask(
      taskName: $taskName
      description: $description
      priority: $priority
      tags: $tags
      userId: $userId
    ) {
      _id
      taskName
      description
      priority
      tags
      userId
      isDone
    }
  }
`;

export default function AddTask() {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const [userId] = useState("123"); // Example user ID; this can be dynamic
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null); // State for feedback message
  const { user } = useUser();
  console.log(user);
  const [addTask, { loading, error }] = useMutation(ADD_TASK, {
    variables: { taskName, description, priority, tags, userId },
    onCompleted: () => {
      setMessage("Task successfully added!");
    },
    onError: (err) => {
      setMessage(`Error adding task: ${err.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim() === "" || description.trim() === "") return;
    addTask({
      variables: { taskName, description, priority, tags, userId: user?.id },
    });
    setTaskName("");
    setDescription("");
    setPriority(1);
    setTags([]); // Clear the input fields
  };

  return (
    <Box sx={{ bgcolor: "white", maxWidth: 600, margin: "0 auto", padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Add New Task
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Task Name"
            variant="outlined"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Priority"
              variant="outlined"
              type="number"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              required
            />
            <TextField
              fullWidth
              label="Tags"
              variant="outlined"
              value={tags.join(", ")}
              onChange={(e) =>
                setTags(e.target.value.split(",").map((tag) => tag.trim()))
              }
              helperText="Separate tags with commas"
            />
          </Stack>
        </Stack>
        <Box sx={{ marginTop: 2, textAlign: "center" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => {
              router.push("/");
            }}
            sx={{ padding: "10px 20px" }}
          >
            {loading ? "Adding..." : "Add Task"}
          </Button>
        </Box>
        {message && (
          <Typography
            sx={{
              marginTop: 2,
              color: message.startsWith("Error")
                ? "error.main"
                : "success.main",
            }}
          >
            {message}
          </Typography>
        )}
        {error && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {`Error: ${error.message}`}
          </Typography>
        )}
      </form>
    </Box>
  );
}
