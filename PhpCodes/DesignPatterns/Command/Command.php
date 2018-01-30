<?php

/*
*
*	命令模式：将请求封装，并把发出请求的对象和处理请求的对象解耦，并支持撤销请求的操作。
*
*   关键元素：客户，调用者，请求，接收者。
*
*   在我们的示例中，客户对应Test类，调用者对应Console(控制台)，命令对应Command接口的具体实现类，接收者对应Light(灯)和Fan(电风扇)。
*
*	我们在使用时，即在客户类Test中使用时，如果多添加一个接收者，我们只需要添加一个Command和接收者，在setCommand时绑定。不用修改调用者的代码。
*	同时，命令模式还支持宏命令和撤销操作，在示例中我们仅提供了宏命令的实现MacroCommand。
*/

interface Command
{
	public function execute();
}

class LightOnCommand implements Command
{
	private $light;

	public function __construct($light)
	{
		$this->light = $light;
	}

	public function execute()
	{
		$this->light->LightOn();
	}
}
class LightOffCommand implements Command
{
	private $light;

	public function __construct($light)
	{
		$this->light = $light;
	}
	
	public function execute()
	{
		$this->light->LightOff();
	}
}

class FanOnConmmand implements Command
{
	private $fan;

	public function __construct($fan)
	{
		$this->fan = $fan;
	}
	
	public function execute()
	{
		$this->fan->FanOn();
	}
}

class FanOffCommand implements Command
{
	private $fan;

	public function __construct($fan)
	{
		$this->fan = $fan;
	}
	
	public function execute()
	{
		$this->fan->FanOff();
	}
}

class MacroCommand implements Command
{
	private $commands;

	public function __construct($commands)
	{
		$this->commands = $commands;
	}
	
	public function execute()
	{
		foreach ($this->commands as $command) {
			$command->execute();
		}
	}
}


class Light
{
	public function LightOn()
	{
		echo "Light is on<br>\n";
	}

	public function LightOff()
	{
		echo "Light is off<br>\n";
	}
}

class Fan
{
	public function FanOn()
	{
		echo "Fan is on<br>\n";
	}

	public function FanOff()
	{
		echo "Fan is off<br>\n";
	}
}

class Console
{
	private $commands = null;

	public function setCommand($pos, $command)
	{
		$this->commands[$pos] = $command;
	}

	public function run($pos)
	{
		if (isset($this->commands[$pos])) {
			$this->commands[$pos]->execute();
		}
	}
}

class Test
{
	public function run()
	{
		
		$light = new Light();
		$fan = new Fan();

		$lightOnCommand = new LightOnCommand($light);
		$lightOffCommand = new LightOffCommand($light);

		$fanOnConmmand = new FanOnConmmand($fan);
		$fanOffCommand = new FanOffCommand($fan);

		$macroCommand = new MacroCommand([$lightOnCommand, $lightOffCommand, $fanOnConmmand, $fanOffCommand]);

		$console = new Console();

		$console->setCommand(0, $lightOnCommand);
		$console->setCommand(1, $lightOffCommand);
		$console->setCommand(2, $fanOnConmmand);
		$console->setCommand(3, $fanOffCommand);
		$console->setCommand(4, $macroCommand);

		$console->run(0);
		$console->run(1);
		$console->run(2);
		$console->run(3);
		$console->run(4);
	}
}

$test = new Test();
$test->run();