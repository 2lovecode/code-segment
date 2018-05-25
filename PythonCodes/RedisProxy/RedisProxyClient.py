import socket

tin=socket.socket()

tin.connect(('127.0.0.1',10086))

while True :
	inp = input('>>>>')
	tin.send(inp.encode('utf8'))
	data = tin.recv(1024)
	if data:
		print(data)
	else:
		pass