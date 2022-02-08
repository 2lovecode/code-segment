<?php
/*
*
*
*	模版方法：在一个方法中定义一个算法的框架，
*	规定要执行哪些算法，以及算法执行的顺序。
*	并且将一些算法的实现延迟到子类中。
*
*	这样做的好处是可以在不改变算法结构的基础上，
*	自由地处理一些算法的实现。
*
*	在本示例中，RunMachineTemplateMethod的run方法，
*	定义了一个算法框架，其中把openPower和display的
*	实现延迟到了子类中。示例中的两个子类是RunComputer
*	和RunTv。
*	需要注意的是，run方法要加final修饰符，防止子类修改
*	框架结构。connectElectricity方法也是可以在子类中
*	重载的。对于一些算法结构有不同分支的代码可以考虑
*	在算法结构中使用钩子方法实现。
*/
abstract class RunMachineTemplateMethod
{
	final public function run()
	{
		$this->connectElectricity();
		$this->openPower();
		$this->display();
	}

	public function connectElectricity()
	{
		echo "The Electricity is coming!<br>\n";
	}

	abstract public function openPower();

	abstract public function display();
}

class RunComputer extends RunMachineTemplateMethod
{
	public function openPower()
	{
		echo "Computer open power!<br>\n";
	}

	public function display()
	{
		echo "Computer display!<br>\n";
	}
}

class RunTv extends RunMachineTemplateMethod
{
	public function openPower()
	{
		echo "TV open power!<br>\n";
	}

	public function display()
	{
		echo "TV display!<br>\n";
	}
}


class Test
{
	public function run()
	{
		$computer = new RunComputer();
		$tv = new RunTv();

		$computer->run();
		echo "<hr>\n";
		$tv->run();
	}
}

$test = new Test();
$test->run();