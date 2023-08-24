// router instance 

import { z } from "zod";
import { db } from "../db/db";
import { publicProcedure,router } from "./trpc";
import { createHTTPServer } from '@trpc/server/adapters/standalone';


    const apiBaseUrl = "https://jsonplaceholder.typicode.com"


const appRouter = router({
    getAllTodos: publicProcedure 
        .query(async () => {
            try {
                console.log("fetching");
                
                const todos = await fetch(apiBaseUrl+"/users/1/todos")
                return todos.json()
            } catch (error) {
                console.log(error);
                
            }
        }),

    getTodoById: publicProcedure
        .input(z.string()) // input parser & validation using Zod
        .query(async (opts) => {
            const {input} = opts;
            const todos = await fetch(apiBaseUrl+`/users/1/todos/${input}`)
            return todos.json()
        }),
    createTodo: publicProcedure
        .input(z.object( {title: z.string()} ))
        .mutation(async (opts) => {
            const {input} = opts
            const result = await fetch(apiBaseUrl+"/users/1/todos",{
                method:"POST",
                body:JSON.stringify({
                    title: input.title,
                    completed: false
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                  },
            })
            return result.json()
        }),
    
})

// export `appRouter`signatur only
export type  AppRouter = typeof appRouter;

// define router
const server = createHTTPServer({
    router: appRouter
})

server.listen(3000)
