<?php

/*
*
*	外观模式：定义了一个统一的接口，用来访问子系统中的一群接口。
*	外观模式和适配器模式在实现上比较相似，但是其应用的意图有所不同。
*	适配器模式意图改变一个接口成另一个接口，外观模式意图将一群接口简化
*
*	在示例中，我们有一个子系统House，其中有一群接口(door light air)。
*	当我们回家时，要开门，打开灯，打开空调。一个回家动作统一了多个接口。
*/
interface DoorInterface
{
	public function open();

	public function close();
}

interface LightInterface
{
	public function on();

	public function off();
}

interface AirInterface
{
	public function start();

	public function stop();
}

class Door implements DoorInterface
{
	public function open()
	{
		echo "open the door<br>\n";
	}

	public function close()
	{
		echo "close the door<br>\n";
	}
}

class Light implements LightInterface
{
	public function on()
	{
		echo "turn on the light<br>\n";
	}

	public function off()
	{
		echo "turn off the light<br>\n";
	}
}

class Air implements AirInterface
{
	public function start()
	{
		echo "start the air<br>\n";
	}

	public function stop()
	{
		echo "stop the air<br>\n";
	}
}



class House
{
	private $door;
	private $light;
	private $air;

	public function __construct(DoorInterface $door, LightInterface $light, AirInterface $air)
	{
		$this->door = $door;
		$this->light = $light;
		$this->air = $air;
	}

	public function goBackHome()
	{
		$this->door->open();
		$this->light->on();
		$this->air->start();
	}

	public function leaveHome()
	{
		$this->door->close();
		$this->light->off();
		$this->air->stop();
	}
}


class Test
{
	public function run()
	{
		$door = new Door();
		$light = new Light();
		$air = new Air();


		$house = new House($door, $light, $air);

		$house->goBackHome();
		echo "<hr>";
		$house->leaveHome();
	}
}

$test = new Test();

$test->run();