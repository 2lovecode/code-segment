<?php

header("Content-type:text/html; charset=utf-8");

class MyMap
{
    public $isEnd = 0;

    private $keySpace = [];

	public function get($key)
	{
		return isset($this->keySpace[$key]) ? $this->keySpace[$key] : null;
	}

	public function put($key, $value)
	{
        $this->keySpace[$key] = $value;
	}

	public function hasNext()
    {
        return !empty($this->keySpace);
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
				$map->put($nowWord, $newMap);
				$map = $newMap;
			}

			if ($i == ($len - 1)) {
				$map->isEnd = 1;
			}
		}
		$this->map = $tmp;
	}

	//最大匹配(有问题)
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
				if ($nowMap->isEnd) {
                    if (!in_array($str, $result)) {
                        array_push($result, $str);
                    }
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

	//左侧全量匹配
    public function leftFullSearch($string)
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
                if ($nowMap->isEnd) {
                    if (!in_array($str, $result)) {
                        array_push($result, $str);
                    }
                    if ($nowMap->hasNext()) {
                        $map = $nowMap;
                    } else {
                        $str = '';
                        $map = $tmp;
                    }
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

    public function matchSearch($string)
    {

    }
}

$example = new MyFilter();

$example->addWordToMap('中国人');
$example->addWordToMap('中国男人');
$example->addWordToMap('中国女人');
$example->addWordToMap('中国男');
$example->addWordToMap('中国女');
$example->addWordToMap('中国');
$example->addWordToMap('男人');
$example->addWordToMap('女人');
$example->addWordToMap('男');
$example->addWordToMap('女');
$example->addWordToMap('人');


$str = '我是中国人,我爱中国,中国男人发送中国女人男到中国男人发送';

var_dump($example->searchFromMap($str));

//var_dump($example->map);
//var_dump($result);
var_dump($example->leftFullSearch($str));
