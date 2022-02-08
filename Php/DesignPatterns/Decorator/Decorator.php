<?php
/*
* 装饰者模式：动态地将责任附加到对象上
*
* 在装饰者模式中，装饰者和被装饰者继承自同一个类。装饰者会持有一个被装饰者的对象，在方法中通过在调用被装饰者相应方法的前后添加自己的逻辑，从而达到添加功能的目的。装饰者模式提供了一种类似于继承的另一种扩展方式
*
* 在此示例中，具体Human和HumanDecorator同属Human抽象类。装饰者会持有一个Human实例，在HumanDecorator调用display时会在调用Human的display方法的前后包装一层自己的逻辑，从而达到扩展功能的目的。
*
*
*/
abstract class Human
{
	abstract public function display();
}

class YellowHuman extends Human
{
	public function display()
	{
		echo "YellowHuman";
	}
}

class BlackHuman extends Human
{
	public function display()
	{
		echo "BlackHuman";
	}
}

abstract class HumanDecorator extends Human
{
	protected $human;
	public function __construct(Human $human)
	{
		$this->human = $human;
	}
}

class WatchDecorator extends HumanDecorator
{
	public function display()
	{
		echo $this->human->display()." with a Watch";
	}
}

class GlassesDecorator extends HumanDecorator
{
	public function display()
	{
		echo $this->human->display()." with a Glasses";
	}
}


class Test
{
	public function run()
	{
		$yellowHuman = new YellowHuman();
		$blackHuman = new BlackHuman();


		$yellowHumanWithWatch = new WatchDecorator($yellowHuman);
		$blackHumanWithGlasses = new GlassesDecorator($blackHuman);

		$yellowHumanWithWatchWithGlasses = new GlassesDecorator($yellowHumanWithWatch);

		$yellowHuman->display();
		echo "<br>\n";
		$blackHuman->display();
		echo "<br>\n";

		$yellowHumanWithWatch->display();
		echo "<br>\n";
		$blackHumanWithGlasses->display();
		echo "<br>\n";

		$yellowHumanWithWatchWithGlasses->display();
	}
}

$test = new Test();
$test->run();