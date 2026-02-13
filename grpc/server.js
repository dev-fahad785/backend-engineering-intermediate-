const grpc = require('@grpc/grpc-js'); // Changed from 'grpc'
const protoLoader = require('@grpc/proto-loader');

const packageDef = protoLoader.loadSync('./todo.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();

// In the new library, bindAsync is used instead of bind
server.bindAsync(
    '0.0.0.0:40000', 
    grpc.ServerCredentials.createInsecure(), 
    (error, port) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log(`Server running at http://0.0.0.0:${port}`);
        // .start() is now implicit in bindAsync or called here
    }
);

server.addService(todoPackage.Todo.service, {
    "createTodo": createTodo,
    "readTodos": readTodos,
    "streamTodos": streamTodos,
});
const todos = []; // In-memory store for todo items

function createTodo(call, callback) {
    console.log('Received from client: ' + call.request.text);
    const todoItem = {
        id: todos.length+1, // In a real app, you'd increment this
        text: call.request.text
    };
    todos.push(todoItem); // Store the new todo item
    callback(null, todoItem);
}

function readTodos(call, callback) {
    callback(null, { 
        "items": todos // Ensure the key is "items"
    });
}
function streamTodos(call) {
    todos.forEach(todo => {
        call.write(todo);
    });
    call.end();
}       