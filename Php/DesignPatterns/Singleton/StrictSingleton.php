<?php
/*
*
* 单例模式：确保一类只有一个实例。
*
* 
* 普通的单例在clone时，仍然会出现两个单例的情况，
* 在将__clone()魔术方法改为private后可杜绝此情况。
*/
class Singleton
{
	static private $instance = null;

	private function __construct()
	{}

	static public function getInstance()
	{
		if (is_null(static::$instance)) {
			static::$instance = new self;
		}

		return static::$instance;
	}

	private function __clone()
	{

	}
}


class Test
{
	public function run()
	{
		$singletonOne = Singleton::getInstance();

		$singletonOne->pro = 'Hello';

		$singletonTwo = Singleton::getInstance();
		$singletonTwo->pro = 'World';

		// $singletonThree = clone $singletonOne;
		// $singletonThree->pro = 'Test';

		var_dump($singletonOne->pro);
		var_dump($singletonTwo->pro);
		// var_dump($singletonThree->pro);
	}
}

$test = new Test();
$test->run();