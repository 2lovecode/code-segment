<?php
/*
*
*
*	迭代器模式：提供顺序访问聚合对象中各个元素的方法，而又不暴露其内部的实现
*	把遍历的任务放到迭代器上，而不是聚合对象上，简化了聚合的接口和实现，让责任各得其所
*
*
*
*	示例中，FirstAggregate是聚合对象，
*	FirstIterator提供了遍历FirstAggregate中各个元素的方法。
*
*/
interface MyAggregate
{
	public function createIterator();
}

interface MyIterator
{
	public function hasNext();
	public function next();
	public function remove();
}

class FirstAggregate implements MyAggregate
{
	private $data;

	public function __construct($data)
	{
		$this->data = $data;
	}

	public function createIterator()
	{
		return new FirstIterator($this->data);
	}
}


class FirstIterator implements MyIterator
{
	private $aggregate;
	private $position;

	public function __construct(array $aggregate = [])
	{
		$this->aggregate = $aggregate;
		$this->position = 0;
	}

	public function hasNext()
	{
		return isset($this->aggregate[$this->position]);
	}

	public function next()
	{
		return $this->aggregate[$this->position++];
	}

	public function remove()
	{
		return;
	}
}


class Test
{
	public function run()
	{
		$data = [4, 2, 5, 1, 3];

		$aggregate = new FirstAggregate($data);
		$iterator = $aggregate->createIterator();

		while ($iterator->hasNext()) {
			var_dump($iterator->next());
		}
	}
}

$test = new Test();
$test->run();
