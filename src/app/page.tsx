"use client"

import { useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";

export default function Home() {

  const tasks = useQuery(api.projects.get);

  return (
    <div>
      {tasks?.map((project) => (
        <div key={project._id}>

        </div>
      ))}
    </div>
  );
}
