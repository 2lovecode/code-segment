<?php

/*
*	观察者模式:定义了对象之间的一对多的依赖关系，当主题对象发生改变时，会通知依赖它的其他对象，使其它对象也发生改变
*	
*	对于观察者模式，一个经典的类比是报纸订阅：出版者(Subject) + 订阅者(Observer) = 观察者模式; 订阅者可以随时订阅一份报纸或者取消订阅，出版商在一份报纸出版后，会通知所有的订阅者并发送报纸。
*	
*	此示例中，主题对象通过push的方式(在update方法中传递参数)把数据推送给观察者observer的。这样的好处是观察者不必关心要获取什么数据，因为主题会把所有数据推送过来。同时造成的不便是，当主题需要增加数据时，会修改observer接口和各个具体的observer的update方法。
*
*
*	一个主题接口Subject,具有registerObserver，removeObserver,notifyObserver方法
*	一个观察者接口Observer,具有update方法
*	
*	DataCenter实现具体的方法:
*		构造方法，初始化储存观察者属性的数据结构
*		registerObserver,把observer放入属性数组中
*		removeObserver,把对应的observer在属性数组中删除
*		notifyObserver,循环属性数组，调用所有的observer的update方法
*		setState,设置state属性的值
*	ObserverOne实现的具体方法:
*	构造方法,初始化主题对象，之所以observer要持有一个subject对象，是为了能够随时pull到subject的数据，并且能够随时取消订阅
*		update,在subject数据更新后，observer做的动作
*/
interface Subject
{
	public function registerObserver(Observer $observer);
	public function removeObserver(Observer $observer);
	public function notifyObserver();
}

interface Observer
{
	public function update($state);
}


class DataCenter implements Subject
{
	private $observerList;

	private $state;

	public function __construct()
	{
		$this->observerList = [];
	}

	public function registerObserver(Observer $observer)
	{
		$className = get_class($observer);

		$this->observerList[$className] = $observer;
	}

	public function removeObserver(Observer $observer)
	{
		$className = get_class($observer);
		if (isset($this->observerList[$className])) {
			unset($this->observerList[$className]);
		}
	}

	public function notifyObserver()
	{
		foreach ($this->observerList as $className => $observer) {
			if (is_null($observer) || !($observer instanceof Observer)) {
				continue;
			}

			$observer->update($this->state);
		}
	}

	public function setState($state)
	{
		$this->state = $state;
		$this->notifyObserver();
	}
}


class ObserverOne implements Observer
{
	private $subject;

	public function __construct(Subject $subject)
	{
		$this->subject = $subject;
		$subject->registerObserver($this);
	}

	public function update($state)
	{
		echo "This ObserverOne: state is ".$state."<br>\n";
	}
}


class ObserverTwo implements Observer
{
	private $subject;

	public function __construct(Subject $subject)
	{
		$this->subject = $subject;
		$subject->registerObserver($this);
	}

	public function update($state)
	{
		echo "This ObserverTwo: state is ".$state."<br>\n";
	}
}


class Test
{
	public function run()
	{
		$dataCenter = new DataCenter();

		$obOne = new ObserverOne($dataCenter);
		$obTwo = new ObserverTwo($dataCenter);

		$dataCenter->setState('abc');
	}
}

$test = new Test();

$test->run();