"use client"

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";


export default function Home() {

  const tasks = useQuery(api.projects.get);

  return(
        <div className="p-8 space-x-4">

          Building CodePilot

        </div>
  )
}
