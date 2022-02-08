<?php
/*
*
* 工厂方法：定义一个创建对象的接口，由子类决定实例化哪个类，把实例化类的逻辑推迟到子类中
*
* 在本示例中：我们在CakeStore的抽象类中定义了创建Cake的接口createCake,子类在继承此抽象类后必须实现此方法，因此，决定实例化哪个类的逻辑推迟到了子类，由子类决定。
*
* 在我们的orderCake方法中，使用了$cake->bake()等方法，而这些方法是由Cake抽象定义的，所以CakeStore依赖于Cake.而具体的Cake对象也依赖于抽象Cake.这种方式避免了我们的CakeStore依赖于具体的Cake类，所以这是依赖倒置原则的很好示例。
*
*/

//抽象蛋糕店
abstract class CakeStore
{
	public function orderCake()
	{
		$cake = $this->createCake();

		$cake->bake();
		$cake->package();
	}

	abstract function createCake();
}

//抽象蛋糕
abstract class Cake
{
	abstract public function bake();

	abstract public function package();
}

//具体蛋糕类
class BeiJingCake extends Cake
{
	public function bake()
	{
		echo "BeiJing cake is baking<br>\n";
	}

	public function package()
	{
		echo "BeiJing cake is packaging<br>\n";
	}
}

class ShangHaiCake extends Cake
{
	public function bake()
	{
		echo "Shang Hai cake is baking<br>\n";
	}

	public function package()
	{
		echo "Shang Hai cake is packaging<br>\n";
	}
}

//具体蛋糕店类
class BeiJingCakeStore extends CakeStore
{
	public function createCake()
	{
		return new BeiJingCake();
	}
}


class ShangHaiCakeStore extends CakeStore
{
	public function createCake()
	{
		return new ShangHaiCake();
	}
}


class Test
{
	public function run()
	{
		$beijingStore = new BeiJingCakeStore();
		$shanghaiStore = new ShangHaiCakeStore();

		$beijingStore->orderCake();
		$shanghaiStore->orderCake();
	}
}

$test = new Test();
$test->run();