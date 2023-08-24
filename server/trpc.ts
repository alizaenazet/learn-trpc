import { initTRPC } from "@trpc/server";

// initialization and creat a only one per trpc backend
const t = initTRPC.create();

// make reuseable export 
export const router = t.router;
export const publicProcedure = t.procedure;

