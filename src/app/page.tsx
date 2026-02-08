"use client"

import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";

export default function Home() {

  const tasks = useQuery(api.tasks.get);

  return (
    <div>
      {tasks?.map((task) => (
        <div key={task._id}>

          <p>(task.text)</p>
          <p>Is completed: {task.isCompleted}</p>

        </div>
      ))}
    </div>
  );
}
