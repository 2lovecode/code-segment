<?php

/*
*
*	使用php实现Hash表,使用分离链表法解决Hash值冲突问题。
*
*/
class HashNode
{
	public $key;
	public $value;
	public $nextNode;

	public function __construct($key, $value, $nextNode = NULL)
	{
		$this->key = $key;
		$this->value = $value;
		$this->nextNode = $nextNode;
	}
}
class MyHashTable
{
	private $buckets;

	private $size;

	public function __construct($size = 10)
	{
		$this->size = $size;
		$this->buckets = new SplFixedArray($this->size);
	}


	private function hashFunc($str)
	{
		$strLen = strlen($str);
		$hashValue = 0;

		for ($i = 0; $i < $strLen; $i++) {
			$hashValue += ord($str[$i]);
		}

		return $hashValue % $this->size;
	}


	public function add($key, $value)
	{
		$index = $this->hashFunc($key);

		if (isset($this->buckets[$index])) {
			$this->buckets[$index] = new HashNode($key, $value, $this->buckets[$index]);
		} else {
			$this->buckets[$index] = new HashNode($key, $value, NULL);
		}
	}

	public function find($key)
	{
		$index = $this->hashFunc($key);
		$current = $this->buckets[$index];

		while ($current != NULL) {
			if ($current->key == $key) {
				break;
			}
			$current = $current->nextNode;
		}
		return $current->value;
	}
}

class Test
{
	public function run()
	{
		$hashTable = new MyHashTable(5);

		$hashTable->add('abc', 123);
		$hashTable->add('cba', 333);

		var_dump($hashTable->find('abc'), $hashTable->find('cba'));
	}
}

$test = new Test();
$test->run();