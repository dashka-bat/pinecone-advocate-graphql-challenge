import { gql, useQuery } from "@apollo/client";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { ClerkProvider } from "@clerk/nextjs";

const GET_ACTIVE_TASKS = gql`
  query GetActiveTasks($userId: String!) {
    getUserNotFinishedTasksLists(userId: $userId) {
      _id
      taskName
      description
    }
  }
`;

export default function Tasks() {
  const { loading, error, data } = useQuery(GET_ACTIVE_TASKS, {
    variables: { userId: "user-active-test" }, // Replace this with actual user ID
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <ul>
        {data.getUserActiveTasks.map((task: any) => (
          <>
            <li key={task._id}>{task.taskName}</li>
            <li key={task._id}>{task.description}</li>
          </>
        ))}
      </ul>
    </div>
  );
}
