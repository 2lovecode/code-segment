<?php

/*
*
*
*
* 简单工厂模式：创建对象的逻辑抽取出来，放到工厂中实现
*
* 优点：
* 缺点：
*
*
*
*
*
*
*/
//对象类
abstract class Door
{
	abstract public function open();
	abstract public function close();
}

class WhiteDoor extends Door
{
	public function open()
	{
		echo "White Door Open!<br>\n";
	}

	public function close()
	{
		echo "White Door Close!<br>\n";
	}
}
class BlackDoor extends Door
{
	public function open()
	{
		echo "Black Door Open!<br>\n";
	}

	public function close()
	{
		echo "Black Door Close!<br>\n";
	}
}

class NilDoor extends Door
{
	public function open()
	{}

	public function close()
	{}
}

//工厂类
abstract class SimpleFactory
{
	abstract public function create($config = []); 
}

class DoorSimpleFactory extends SimpleFactory
{
	public function create($config = [])
	{
		$object = null;

		if (is_array($config) && !empty($config)) {
			$className = array_shift($config).'Door';
			$object = new $className($config);
		} else {
			$object = new NilDoor();
		}
		return $object;
	}
}

class Test
{
	public function run()
	{
		$doorFactory = new DoorSimpleFactory();

		$doorOne = $doorFactory->create(['Black']);
		$doorTwo = $doorFactory->create(['White']);

		$doorOne->open();
		$doorOne->close();

		$doorTwo->open();
		$doorTwo->close();
	}
}

$test = new Test();
$test->run();