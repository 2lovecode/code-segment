<?php
header("Content-type:text/html; charset=utf-8");

class PageRank
{
	public $map = [];

	public $rank = [];

	public $inputList = []; // example web 'a' (has input link): web 'b'

	public $size;

	public $keyValue = 0.85;

	public function __construct(array $map) {
		$this->map = $map;
		$this->size = count($this->map);
	}

	//init rank score and transform 'map' format to 'inputList' format
	public function init()
	{
		$size = $this->size;
		foreach ($this->map as $key => $value) {
			$this->inputList[$key] = [];
		}
		foreach ($this->map as $key => $value) {
			$this->rank[$key] = 1/$size;
			foreach ($value as $v) {
				if (empty($this->inputList[$v])) {
					$this->inputList[$v][] = $key;
				} else {
					array_push($this->inputList[$v], $key);
				}
			}
			
		}
	}


	public function caculate()
	{
		$tmp = $this->rank;
		$keyValue = $this->keyValue;
		$size = $this->size;

		foreach ($this->inputList as $key => $value) {
			$score = (1 - $keyValue)/$size;
			foreach ($value as $v) {
				$cc = count($this->map[$v]);
				if ($cc) {
					$score += ($keyValue*(1/$cc * $this->rank[$v]));
				}
			}
			$tmp[$key] = $score;
		}
		$this->rank = $tmp;
	}



}

$map = [
		'a' => ['b', 'c', 'd'],// web 'a' (has out link): web 'b', web 'c', web 'd'
		'b' => ['a', 'd'],
		'c' => ['b'],
		'd' => ['b', 'c'],
];


$example = new PageRank($map);
$example->init();

echo '<pre>';

for ($i = 0; $i < 10; $i++) {
	$example->caculate();
	var_dump($example->rank);
}