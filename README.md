![alt ilustration](https://github.com/alizaenazet/learn-trpc/blob/main/image/ilustrate.png?raw=true)

for more detailed information you can visit https://trpc.io/docs/quickstart#serving-the-api

## flow : 
1. Setup [[Trpc Quick start#Setup]]
2. init [[Trpc Quick start#init]]
3. Server [[Trpc Quick start#Server]]
4. Client [[Trpc Quick start#Client]]
5. Run [[Trpc Quick start#Run the project]]


## Setup

install trpc to package
```
npm install @trpc/server @trpc/client
```

install **Zod** for validate
```
npm i zod
```


## init
 1. Create a folder in the root level `server` and `client`
 2. Create a file for init trpc backend
    ```ts
    import { initTRPC } from "@trpc/server";
	
	// initialization and creat a only one per trpc backend
	const t = initTRPC.create();
	
	  
	
	// make reuseable export 
	export const router = t.router;
	export const publicProcedure = t.procedure;
```

## Server
### create router instance
**server/index.ts**
```ts
import { router } from './trpc';

const appRouter = router({
// ... make it blank first
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
```
 *define `appRouter` to make endpoints later and export the type as `AppRouter`  *

After that, you can start to make an endpoint, whatever you want inside `appRouter` variable,
Let's make an endpoint to get all todos like this :
**server/index.ts**
```ts
import { z } from "zod";
import { publicProcedure,router } from "./trpc";
import { createHTTPServer } from '@trpc/server/adapters/standalone';
```
*import `publicProcedure` & `router` from `trpc.ts`*

**server/index.ts**
```ts

const apiBaseUrl = "https://jsonplaceholder.typicode.com" // you can use it too

const appRouter = router({ 
getAllTodos: publicProcedure // endpoint name | publicProcedure
.query(async () => { // 

try {
console.log("fetching");
const todos = await fetch(apiBaseUrl+"/users/1/todos") 

return todos.json() // return the value for client side
} catch (error) {

console.log(error);
}

}),
```

### Retrieve an input for the endpoint

lets make two endpoint for get Todo by the ID and create Todo ask for the title of the todo in `getTodoById` & `createTodo` .
**server/index.ts**
```ts
// inside `const appRouter = router({ ...` 
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

//fetch api for get data
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
```

### serving the API endpoints
All the endpoints provided:  `getTodo`, `getTodoById`, and `createTodo` will served to the client side
**server/index.ts**
```ts
// export `appRouter`signatur only
export type AppRouter = typeof appRouter;

// define router
const server = createHTTPServer({
router: appRouter
})

server.listen(3000) //server side will run on port 3000
```


## Client

now that the server side is ready to use we can call it on the client side

**client/index.ts**
```ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
// import from server folder 
import type { AppRouter } from '../server'; 

// 👆 **type-only** import
// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.

const trpc = createTRPCProxyClient<AppRouter>({
links: [
httpBatchLink({
url: 'http://localhost:3000', // the server url
}),

],

});
```

After difine that you can use the `trpc` variable for call all of the endpoint like this :
**client/index.ts**
```ts
async function main() {

console.log("get todo by id (3)");
const todo = await trpc.getAllTodos.query()
console.log("todo: ");
console.log(todo);

console.log("create a todo");
const createTodo = await trpc.createTodo.mutate({title:"makan"})
console.log("created todo: ");
console.log(createTodo);
}

main().catch(console.error)
```

### full code client side
**client/index.ts**
```ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server';

const trpc = createTRPCProxyClient<AppRouter>({
links: [
httpBatchLink({
url: 'http://localhost:3000',
}),
],
});

  

async function main() {
console.log("get todo by id (3)");
const todo = await trpc.getAllTodos.query()
console.log("todo: ");
console.log(todo);

console.log("create a todo");
const createTodo = await trpc.createTodo.mutate({title:"makan"})
console.log("created todo: ");
console.log(createTodo);

}

main().catch(console.error)
```

### Run the project
1. you must run the server side first. After that you can run the client side
2. we will using a package `ts-node` 
   ```sql
   npm install -D ts-node
```
for use it seems like `node` just `ts-node` prompt and the file path 
```sql
 tsnode server/index.ts
```
3. run the server file first and make sure not get some error or some problem
4. finally u can run the client file
   ```sql
   tsnode client/index.ts
```

