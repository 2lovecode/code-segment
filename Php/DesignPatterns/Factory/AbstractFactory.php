<?php
/*
*
*	抽象工厂：提供一个接口，用来创建相关或依赖对象的家族，而不需要明确指定具体类
*
*
*	在我们的示例中，MaterialFactory是抽象工厂的抽象类，它定义了创建Water和RawNoodles这两个同属一个家族的对象的方法。
*	在具体的工厂类中，每一个对象的创建都使用工厂方法的方式创建。
*
*
*/

//抽象工厂类和具体工厂类
abstract class MaterialFactory
{
	abstract public function createWater();
	abstract public function createRawNoodles();
}

class BeiJingMaterialFactory extends MaterialFactory
{
	public function createWater()
	{
		return new BitterWater();
	}

	public function createRawNoodles()
	{
		return new LongRawNoodles();
	}
}

class ShangHaiMaterialFactory extends MaterialFactory
{
	public function createWater()
	{
		return new SweetWater();
	}

	public function createRawNoodles()
	{
		return new ShortRawNoodles();
	}
}
//抽象Water和具体Water类--原料家族一员
abstract class Water
{
	abstract public function display();
}

class SweetWater extends Water
{
	public function display()
	{
		echo "I am Sweet Water!<br>\n";
	}
}
class BitterWater extends Water
{
	public function display()
	{
		echo "I am Biiter Water!<br>\n";
	}
}

//抽象RawNoodles和具体RawNoodles--原料家族一员
abstract class RawNoodles
{
	abstract public function display();
}
class LongRawNoodles extends RawNoodles
{
	public function display()
	{
		echo "I am Long RawNoodles!<br>\n";
	}
}
class ShortRawNoodles extends RawNoodles
{
	public function display()
	{
		echo "I am Short RawNoodles!<br>\n";
	}
}

//抽象产品Noodles和具体的产品Noodles
abstract class Noodles
{
	public $materialFactory;
	public $water;
	public $rawNoodles;

	public function __construct($materialFactory)
	{
		$this->materialFactory = $materialFactory;
	}

	public function prepare()
	{
		$this->water = $this->materialFactory->createWater();
		$this->rawNoodles = $this->materialFactory->createRawNoodles();
	}

	public function cook()
	{
		echo "cooking<br>\n";
	}
	public function package()
	{
		echo "packaging<br>\n";
	}

	public function display()
	{
		$this->water->display();
		$this->rawNoodles->display();
	}
}

class BeiJingNoodles extends Noodles
{	
}


class ShangHaiNoodles extends Noodles
{
}

//抽象NoodlesStore和具体NoodlesStore
abstract class NoodlesStore
{
	public function orderNoodles()
	{
		$noodles = $this->createNoodles();
		$noodles->prepare();
		$noodles->display();
		$noodles->cook();
		$noodles->package();
	}

	abstract public function createNoodles();
}

class BeiJingNoodlesStore extends NoodlesStore
{
	public function createNoodles()
	{
		$factory = new BeiJingMaterialFactory();
		return new BeiJingNoodles($factory);
	}
}

class ShangHaiNoodlesStore extends NoodlesStore
{
	public function createNoodles()
	{
		$factory = new ShangHaiMaterialFactory();
		return new ShangHaiNoodles($factory);
	}
}


class Test
{
	public function run()
	{
		$beijingStore = new BeiJingNoodlesStore();
		$shanghaiStore = new ShangHaiNoodlesStore();

		$beijingStore->orderNoodles();
		$shanghaiStore->orderNoodles();
	}
}

$test = new Test();
$test->run();
