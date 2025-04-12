import { gql } from "@apollo/client";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  TextField,
  Button,
  Box,
  Typography,
  Stack,
  Slider,
} from "@mui/material";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

const ADD_TASK = gql`
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
  const [priority, setPriority] = useState(3); // Анхдагч утга 3
  const [tagsInput, setTagsInput] = useState("");
  const router = useRouter();
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const { user } = useUser();

  const [addTask, { loading }] = useMutation(ADD_TASK, {
    onCompleted: () => {
      setMessage({ text: "Даалгавар амжилттай нэмэгдлээ!", isError: false });
      setTaskName("");
      setDescription("");
      setPriority(3);
      setTagsInput("");
      setTimeout(() => router.push("/"), 1500);
    },
    onError: (err) => {
      setMessage({ text: `Алдаа: ${err.message}`, isError: true });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskName.trim()) {
      setMessage({ text: "Даалгаврын нэр хоосон байна", isError: true });
      return;
    }

    if (!description.trim()) {
      setMessage({ text: "Тайлбар хоосон байна", isError: true });
      return;
    }

    if (!user?.id) {
      setMessage({
        text: "Нэвтрээгүй байна. Дахин нэвтэрнэ үү",
        isError: true,
      });
      return;
    }

    try {
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await addTask({
        variables: {
          taskName,
          description,
          priority,
          tags,
          userId: user.id,
        },
      });
    } catch (err) {
      console.error("Даалгавар нэмэхэд алдаа гарлаа:", err);
    }
  };

  const handlePriorityChange = (event: Event, newValue: number | number[]) => {
    setPriority(newValue as number);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        maxWidth: 600,
        margin: "2rem auto",
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mb: 3, textAlign: "center" }}>
        Шинэ Даалгавар Нэмэх
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Даалгаврын нэр"
            variant="outlined"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />

          <TextField
            fullWidth
            label="Дэлгэрэнгүй тайлбар"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            required
          />

          <Box sx={{ width: "100%" }}>
            <Typography gutterBottom>Чухал ач холбогдол: {priority}</Typography>
            <Slider
              value={priority}
              onChange={handlePriorityChange}
              aria-labelledby="priority-slider"
              step={1}
              marks
              min={1}
              max={5}
              valueLabelDisplay="auto"
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="caption">Бага</Typography>
              <Typography variant="caption">Өндөр</Typography>
            </Box>
          </Box>

          <TextField
            fullWidth
            label="Шошго (таслалаар тусгаарна)"
            variant="outlined"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            helperText="Жишээ: ажил, гэр, хобби"
          />
        </Stack>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ px: 4, py: 1.5 }}
          >
            {loading ? "Нэмж байна..." : "Даалгавар Нэмэх"}
          </Button>
        </Box>

        {message && (
          <Typography
            sx={{
              mt: 3,
              color: message.isError ? "error.main" : "success.main",
              textAlign: "center",
            }}
          >
            {message.text}
          </Typography>
        )}
      </form>
    </Box>
  );
}
