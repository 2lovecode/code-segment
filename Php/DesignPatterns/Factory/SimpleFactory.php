<?php

/*
*
*
*
* 简单工厂模式：创建对象的逻辑抽取出来，放到工厂中实现
*
* 在本示例中：客户类Test获取对象实例door的代码放到工厂类Factory中实现。
* 带来的好处是，在我们需要添加door的类型时，不必更改Test类的代码，只需要在factory中添加即可。
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


class SimpleFactory
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
		$factory = new SimpleFactory();

		$doorOne = $factory->create(['Black']);
		$doorTwo = $factory->create(['White']);

		$doorOne->open();
		$doorOne->close();

		$doorTwo->open();
		$doorTwo->close();
	}
}

$test = new Test();
$test->run();