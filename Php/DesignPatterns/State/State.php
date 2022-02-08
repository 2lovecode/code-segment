<?php

/*
	状态模式:允许对象在内部状态改变时，改变它的行为。

	在示例代码中，我们使用一个简单的售卖机模型进行实现：

	等待投币:状态1
			->投币:动作1
	投币完成:状态2
			->扳动把手:动作2
	结束交易:状态3
			->获取产品:动作3
	...返回等待投币状态...
*/

/*
	抽象状态类
*/
abstract class State
{
	public $machine;

	public function __construct($machine)
	{
		$this->machine = $machine;
	}

	//投币动作
	public function putCoin()
	{
		throw new Exception('you can not put coin!');
	}

	//扳动把手动作
	public function turnHandle()
	{
		throw new Exception('you can not turn handle!');
	}

	//获取产品动作
	public function getProduct()
	{
		throw new Exception('you can not get product!');
	}
}

class WaitCoinState extends State
{
	public function putCoin()
	{
		$this->machine->setCurStateObject(Machine::STATE_COMPLETE_COIN);
		var_export("put coin!");
	}
}

class CompleteCoinState extends State
{
	public function turnHandle()
	{
		$this->machine->setCurStateObject(Machine::STATE_END_TRANSACTION);
		var_export('turn handle!');
	}
}

class EndTransactionState extends State
{
	public function getProduct()
	{
		$this->machine->setCurStateObject(Machine::STATE_WAIT_COIN);
		var_export('get product!');
	}
}

class Machine
{
	const STATE_WAIT_COIN = 1;
	const STATE_COMPLETE_COIN = 2;
	const STATE_END_TRANSACTION = 3;

	private $curStateObject;

	private $statePool = [
		self::STATE_WAIT_COIN => 'WaitCoinState',
		self::STATE_COMPLETE_COIN => 'CompleteCoinState',
		self::STATE_END_TRANSACTION => 'EndTransactionState',
	];

	//初始化状态
	public function __construct()
	{
		$this->setCurStateObject(self::STATE_WAIT_COIN);
	}


	private function generalStateObject($state)
	{
		$className = $this->statePool[$state] ?? null;

		if (is_null($className)) {
			throw new Exception("state is not exists!");
		}

		return new $className($this);
	}

	public function setCurStateObject($state)
	{
		$this->curStateObject = $this->generalStateObject($state);
	}

	public function getCurStateObject()
	{
		return $this->curStateObject;
	}

	//把行为委托给特定的状态类执行
	public function __call($name, $arguments)
	{
		if (method_exists($this->curStateObject, $name)) {
			return call_user_func_array([$this->curStateObject, $name], $arguments);
		} else {
			throw new Exception('method ('.$name.') is not exists!');
		}
	}
}


class Test
{
	public function run()
	{
		try {
			$machine = new Machine();
			$machine->putCoin();
			echo '<br>';
			$machine->turnHandle();
			echo '<br>';
			$machine->getProduct();
			echo '<br>';

			$machine->putCoin();
			echo '<br>';
			$machine->turnHandle();
			echo '<br>';
			$machine->getProduct();
		} catch (Exception $e) {
			var_export($e->getMessage());
		}
	}
}

$test = new Test();
$test->run();