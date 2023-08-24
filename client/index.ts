import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../server';
//     👆 **type-only** import
 
// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
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

