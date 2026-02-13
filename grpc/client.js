const grpc = require('@grpc/grpc-js'); // Changed from 'grpc'
const protoLoader = require('@grpc/proto-loader');
const packageDef=protoLoader.loadSync('todo.proto',{})
const grpcObject=grpc.loadPackageDefinition(packageDef);
const todoPackage=grpcObject.todoPackage; 

const client=new todoPackage.Todo('localhost:40000', grpc.credentials.createInsecure());

const text=process.argv[2] || "Hello from gRPC client!";
// Improved Callback Logic
client.createTodo({ "id": -1, "text": text }, (err, response) => {
    if (err) {
        console.error('Create Error:', err.message);
        return;
    }
    console.log('Created:', response);

    // Call readTodos ONLY after creation is successful
    client.readTodos({}, (err, response) => {
        console.log('Read Todos Response:', JSON.stringify(response)); // Log the full response for clarity
        if(!response.items){
        response.items.forEach(todo => {
            console.log(`Todo ID: ${todo.id}, Text: ${todo.text}`);
        });
    }});
});

const call=client.streamTodos();
call.on('data',item=>{
    console.log("received from server: "+JSON.stringify(item));
})
call.on('end',()=>{
    console.log("Stream ended by server.");
})