# jsmChat - simple nodejs chat

Purpose of current chat is learn how streams works. It is free to use. 
To install:

	npm install --production

Environment
------------
Chat was developed and tested at NodeJS 5.2.0, But should work properly with all 5.* +

Structure
------------
There are two modules: server (./server) and client (./chat). You should start your server and share your ip and port berween participants.

Start commands
------------
You can run server and client in two ways.
	
	node server [-p port]
	./server [-p port]
	
	node chat [-h host] [-p port]
	./chat [-h host] [-p port]

You can setup port and host with 2 ways:
 - parameters
 - change config files values:

	/assets/config/client.json;
	/assets/config/server.json
