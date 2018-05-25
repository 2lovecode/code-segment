'''
project name: 
	redis代理

function: 
	在项目服务器上运行此代理程序,项目应用程序通过socket连接代理程序,发送redis命令,由此代理程序向redis发起请求.

background:
	项目应用程序在处理每次请求时,都要发起对redis服务器的连接,连接耗时受网络影响,在高并发和网络延迟时会严重影响客户体验

library:
	1.使用python的redis库提供的redis连接池,保证连接的持续和可靠
	2.使用python的selectors库提供的高性能i/o多路复用,保证代理程序的高并发情况下的稳定和及时响应

usage:
	server:
		python RedisProxy.py

	client:
		python 
'''

import sys
import getopt
import socket
import selectors
import redis

from getopt import GetoptError

class RedisLink:
	def __init__(self, host="localhost", port="6379", db="0"):
		pool = redis.ConnectionPool(host="localhost", port="6379", db="0")
		self.redisLink = redis.Redis(connection_pool=pool)


class RedisProxy:

	def __init__(self, proxyHost='localhost', proxyPort='10086', redisLink=RedisLink, **otherArgs):
		self.proxyHost = proxyHost
		self.proxyPort = proxyPort
		self.redisLink = redisLink

	def run(self):

		
		sock = socket.socket()
		sock.bind((self.proxyHost, self.proxyPort))
		sock.listen(5)
		sock.setblocking(False)

		select = selectors.DefaultSelector()

		def read(connect, mask):
			data = connect.recv(1024)
			if data:
				print('echoing', repr(data), 'to', connect)
				connect.send(data)
			else:
				print('closing', connect)
				select.unregister(connect)
				connect.close()

		def accept(sock, mask):
			connect, addr = sock.accept()
			print('accepted', connect, 'from', addr)
			connect.setblocking(False)
			select.register(connect, selectors.EVENT_READ, read)

		select.register(sock, selectors.EVENT_READ, accept)
		
		while True:
			envents = select.select()

			for key, mask in envents:
				thiskeydata = key.data
				obj = key.fileobj
				thiskeydata(obj, mask)


try:

	proxyHost = '127.0.0.1'
	proxyPort = 10086
	redisConfig = ['127.0.0.1', 6379, 0]

	opts, args = getopt.getopt(sys.argv[1:], 'h:p:r:')

	for option, value in opts:
		if (option in ['-h']):
			proxyHost = value
			continue
		elif (option in ['-p']):
			proxyPort = value
			continue
		elif (option in ['-r']):
			redisConfigStr = value
			continue

	if 'redisConfigStr' in locals() :
		redisConfigTmp = redisConfigStr.split(':')

		for i in range(len(redisConfigTmp)):
			redisConfig[i] = redisConfigTmp[i]

	redisLink = RedisLink(redisConfig[0], redisConfig[1], redisConfig[2])


	redis_proxy = RedisProxy(proxyHost=proxyHost, proxyPort=proxyPort, redisLink=redisLink)
	redis_proxy.run()

except GetoptError as errMsg:
	print(errMsg)