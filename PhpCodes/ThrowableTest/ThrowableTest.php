<?php

class MyException extends Exception
{}

class MyError extends Error
{}

// class MyClass implements Throwable
// {}
//报错 Fatal error: Class MyClass cannot implement interface Throwable, extend Exception or Error instead

try {
	throw new MyException('This is Exception!');
}catch(Throwable $e) {
	var_dump($e->getMessage());
}

try {
	throw new MyError('This is Error!');
} catch (Throwable $e) {
	var_dump($e->getMessage());
}

// try {
// 	throw new MyClass('Hello World!');
// } catch (Throwable $e) {
// 	var_dump($e->getMessage());
// }