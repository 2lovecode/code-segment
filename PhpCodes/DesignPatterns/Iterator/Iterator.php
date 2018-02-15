<?php

/*
*	迭代器模式：定义一种方法顺序访问聚合对象，而又不暴露其内部实现
*
*	让客户遍历你的对象，而又无法得知内部数据的存储方式。
*/
class MyIterator
{
	private $arrayList;
	private $position;

	public function __construct($array)
	{
		$this->arrayList = $array;
		$this->position = 0;
	}

	public function hasNext()
	{
		return isset($this->arrayList[$this->position]);
	}

	public function next()
	{
		$value = $this->arrayList[$this->position];
		$this->position = $this->position + 1;
		return $value;
	}
}

class Test
{
	public function createIterator($arr1)
	{
		return new MyIterator($arr1);
	}
	public function run()
	{
		$arr1 = [1, 2, 3, 4, 5];
		$iterator = $this->createIterator($arr1);

		while ($iterator->hasNext()){
			var_dump($iterator->next());
		} 
	}
}

$test = new Test();
$test->run();