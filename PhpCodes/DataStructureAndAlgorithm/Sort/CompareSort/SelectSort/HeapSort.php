<?php
header('content-type:text/html;charset=utf-8');
/**
 *	堆排序
 *  我们使用数组构建堆，注意数组下标从1开始。
 */

abstract class Heap
{
	protected $heap = [0];
	protected $size = 0;

	public function __construct(array $dataList = [])
	{
		foreach ($dataList as $value) {
			$this->size++;
			$this->insert($value);
		}
	}

	abstract public function insert($value);

	abstract public function delete();

	public function sort()
	{
		$result = [];
		$size = $this->size;
		for ($i = 1; $i <= $size; $i++) {
			$result[] = $this->delete();
		}
		return $result;
	}
}

//最小堆
class MinHeap extends Heap
{
	public function insert($value)
	{
		for ($i = $this->size; ($i > 0) && ($this->heap[floor($i/2)] > $value); $i = floor($i/2)) {
			$this->heap[$i] = $this->heap[floor($i/2)];
		}

		$this->heap[$i] = $value;
	}


	public function delete()
	{
		$minValue = $this->heap[1];
		$lastValue = $this->heap[$this->size--];
		$child = 1;

		for ($i = 1; $i*2 <= $this->size; $i = $child) {

			$child = $i * 2;

			$leftIndex = $child;
			$rightIndex = $child + 1;

			if (($child != $this->size) && ($this->heap[$leftIndex] > $this->heap[$rightIndex])) {
				$child++;
			}

			if ($lastValue > $this->heap[$child]) {
				$this->heap[$i] = $this->heap[$child];
			} else {
				break;
			}
		}

		$this->heap[$i] = $lastValue;
		return $minValue;
	}
}

//最大堆
class MaxHeap extends Heap
{
	public function insert($value)
	{
		for ($i = $this->size; (floor($i/2) > 0) && ($this->heap[floor($i/2)] < $value); $i = floor($i/2)) {
			$this->heap[$i] = $this->heap[floor($i/2)];
		}
		$this->heap[$i] = $value;
	}

	public function delete()
	{
		$maxValue = $this->heap[1];
		$lastValue = $this->heap[$this->size--];

		$child = 1;

		for ($i = 1; $i * 2 <= $this->size; $i = $child) {
			$child = $i * 2;
			$leftIndex = $child;
			$rightIndex = $child + 1;


			if (($child != $this->size) && ($this->heap[$leftIndex] < $this->heap[$rightIndex])) {
				$child++;
			}

			if ($this->heap[$child] > $lastValue) {
				$this->heap[$i] = $this->heap[$child];
			} else {
				break;
			}
		}

		$this->heap[$i] = $lastValue;
		return $maxValue;

	}
}



$testData = [33, 4, 3, 2, 5, 6, 9, 10, 32, 23, 45, 11, 25];
$minHeap = new MinHeap($testData);
$maxHeap = new MaxHeap($testData);

echo '<pre>';
var_dump($minHeap->sort());
var_dump($maxHeap->sort());