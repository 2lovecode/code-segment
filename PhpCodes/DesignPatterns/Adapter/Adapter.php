<?php
/*
*	适配器模式：将目标接口，转化为客户期望的接口。
*
*	在我们的示例中，目标接口是MonkeyInterface，
*	但是客户(Test类的run方法)期望的是PersonInterface，即客户期望处理的是Person。
*	我们的处理方式是在客户和目标接口中间加一个适配器(MonkeyAdapter)，客户使用的是适配器实例，适配器
*   实例最终会将相应请求委托给它持有的目标对象来处理(MonkeyAdapter中的$monkey属性)
*
*
*/
interface MonkeyInterface
{
	public function jump();
	public function roar();//吼叫
}

interface PersonInterface
{
	public function walk();
	public function speak();
}


class LittleMonkey implements MonkeyInterface
{
	public function jump()
	{
		echo "jump jump<br>\n";
	}

	public function roar()
	{
		echo "ohoooooo..<br>\n";
	}
}


class LittleBoy implements PersonInterface
{
	public function walk()
	{
		echo "I am walking<br>\n";
	}

	public function speak()
	{
		echo "I am speaking<br>\n";
	}
}


class MonkeyAdapter implements PersonInterface
{
	private $monkey;

	public function __construct(MonkeyInterface $monkey)
	{
		$this->monkey = $monkey;
	}

	public function walk()
	{
		$this->monkey->jump();
	}

	public function speak()
	{
		$this->monkey->roar();
	}
}


class Test
{
	public function run()
	{
		$person = new LittleBoy();
		$person->walk();
		$person->speak();

		$monkey = new LittleMonkey();
		$monkeyAdapter = new MonkeyAdapter($monkey);

		$monkeyAdapter->walk();
		$monkeyAdapter->speak();
	}
}


$test = new Test();

$test->run();