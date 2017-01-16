var http = require("http");

http.createServer(pageCalled).listen(8081);

function pageCalled(request, response){
	response.writeHead(200, {'Content-Type':'text/plain'});

	response.end('Hello World\n');
}

console.log("Server running at http://127.0.0.1:8081/");