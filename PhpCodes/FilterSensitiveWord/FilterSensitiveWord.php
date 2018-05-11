<?php

header("Content-type:text/html; charset=utf-8");

class MyMap
{
	public function get($key)
	{
		return isset($this->$key) ? $this->$key : null;
	}

	public function put($key, $value)
	{
		$this->$key = $value;
	}
}

class MyFilter
{
	public $map = null;

	public function addWordToMap($word)
	{
		$len = mb_strlen($word);
		if (is_null($this->map)) {
			$map = new MyMap();
			$map->put('isEnd', 0);
		} else {
			$map = $this->map;
		}
		$tmp = $map;

		for ($i = 0; $i < $len; $i++) {
			$nowWord = mb_substr($word, $i, 1);

			$nowMap = $map->get($nowWord);

			if (!is_null($nowMap)) {
				$map = $nowMap;
			} else {
				$newMap = new MyMap();
				$newMap->put('isEnd', 0);
				$map->put($nowWord, $newMap);
				$map = $newMap;
			}

			if ($i == ($len - 1)) {
				$map->put('isEnd', 1);
			}
		}
		$this->map = $tmp;
	}

	//最大匹配
	public function searchFromMap($string)
	{
		$len = mb_strlen($string);
		$tmp = $this->map;
		$map = $this->map;
		$str = '';
		$result = [];
		for ($i = 0; $i < $len; $i++) {
			$nowWord = mb_substr($string, $i, 1);
			$nowMap = $map->get($nowWord);

			if (!is_null($nowMap)) {
				$str .= $nowWord;
				if ($nowMap->get('isEnd')) {
					array_push($result, $str);
					$str = '';
					$map = $tmp;
				} else {
					$map = $nowMap;
				}
			} else {
				if (!empty($str)) {
					$i--;
				}
				$str = '';
				$map = $tmp;
			}
		}
		return $result;
	}
}

$example = new MyFilter();

$example->addWordToMap('中国人');
$example->addWordToMap('中国男人');
$example->addWordToMap('中国女人');
$example->addWordToMap('中国男');
$example->addWordToMap('中国女');
$example->addWordToMap('男人');
$example->addWordToMap('女人');
$example->addWordToMap('男');
$example->addWordToMap('女');
$example->addWordToMap('人');


$str = '我是中国人,我爱中国,中国男人发送中国女人男到中国男人发送';

$result = $example->searchFromMap($str);
//var_dump($example->map);
var_dump($result);
