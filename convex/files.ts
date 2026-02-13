import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { verifyAuth } from "./auth";

export const getFiles = query({
    args: {projectId: v.id("projects") },
    handler: async(ctx , args) => {
        const identity = await verifyAuth(ctx);

        const project = await ctx.db.get("projects", args.projectId)

        if(!project){
            throw new Error("Project not found")
        }

        if(project.ownerId !== identity.subject){
            throw new Error("Unauthorized access")
        }


     return await ctx.db
        .query("files")
        .withIndex("by_project", (q)=>q.eq("projectId", args.projectId))
        .collect()
    }
})


export const getSingleFile = query({
  args: { id: v.id("files") },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const file = await ctx.db.get("files", args.id);

     if (!file) {
      throw new Error("File not found");
    }

    const project = await ctx.db.get("projects", file.projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized to access this project");
    }

    return file;
  },
});

export const getFolderContents = query({
    args: 
    {
        projectId: v.id("projects"),
        parentId: v.optional(v.id("files"))
        
     },
    handler: async(ctx , args) => {
        const identity = await verifyAuth(ctx);

        const project = await ctx.db.get("projects", args.projectId)

        if(!project){
            throw new Error("Project not found")
        }

        if(project.ownerId !== identity.subject){
            throw new Error("Unauthorized access")
        }


        const files = await ctx.db
                .query("files")
                .withIndex("by_project_parent" , (q) => 
                    q.eq("projectId", args.projectId).eq("parentId", args.parentId)
                )
                .collect();

        //Sorting the folders>files (alphabetically)

        return files.sort((a, b) => {
            if(a.type === "folder" && b.type === "file") return -1;
            if(a.type === "file" && b.type === "folder") return 1;

            return a.name.localeCompare(b.name)
        })
    }
})

export const createFile = mutation({
  args: { 
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const project = await ctx.db.get("projects", args.projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized to access this project");
    }

    // Check if file with same name already exists in this parent folder
    const files = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q
          .eq("projectId", args.projectId)
          .eq("parentId", args.parentId)
      )
      .collect();

    const existing = files.find(
      (file) => file.name === args.name && file.type === "file"
    );

    if (existing) throw new Error("File already exists");

    const now = Date.now();

    await ctx.db.insert("files", {
      projectId: args.projectId,
      name: args.name,
      content: args.content,
      type: "file",
      parentId: args.parentId,
      updatedAt: now,
    });

    await ctx.db.patch("projects", args.projectId, {
      updatedAt: now,
    });
  },
});

export const createFolder = mutation({
  args: { 
    projectId: v.id("projects"),
    parentId: v.optional(v.id("files")),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    const project = await ctx.db.get("projects", args.projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized to access this project");
    }

    // Check if folder with same name already exists in this parent folder
    const files = await ctx.db
      .query("files")
      .withIndex("by_project_parent", (q) =>
        q
          .eq("projectId", args.projectId)
          .eq("parentId", args.parentId)
      )
      .collect();

    const existing = files.find(
      (file) => file.name === args.name && file.type === "folder"
    );

    if (existing) throw new Error("Folder already exists");

    const now = Date.now();

    await ctx.db.insert("files", {
      projectId: args.projectId,
      name: args.name,
      type: "folder",
      parentId: args.parentId,
      updatedAt: now,
    });

    await ctx.db.patch("projects", args.projectId, {
      updatedAt: now,
    });
  },
});