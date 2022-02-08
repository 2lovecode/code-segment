<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

class DbStore
{
    private $autoIncreaseID = 0;

    private $recordMap = [];

    public function insert($data = [])
    {
        $this->autoIncreaseID++;

        $id = $this->autoIncreaseID;
        $data['id'] = $id;

        $this->recordMap[$id] = $data;

        return $id;
    }

    public function update($id, $data = [])
    {
        $ori = $this->findByID($id);
        foreach ($data as $key => $value) {
            $ori[$key] = $value;
        }

        $this->recordMap[$id] = $ori;
    }

    public function findByID($id)
    {
        return isset($this->recordMap[$id]) ? $this->recordMap[$id] : [];
    }
}

class AutoIncreaseShortener
{
    private $alphanumericMap = [];
    private $dbStore;

    public function __construct()
    {
        for ($i = 0; $i < 10; $i++) {
            $this->alphanumericMap[$i] = $i;
        }

        $start = ord('a') - 10;
        for ($i = 10; $i < 36; $i++) {
            $this->alphanumericMap[$i] = chr($start + $i);
        }

        $start = ord('A') - 36;
        for ($i = 36; $i < 62; $i++) {
            $this->alphanumericMap[$i] = chr($start + $i);
        }

        shuffle($this->alphanumericMap);
        $this->dbStore = new DbStore();
    }

    public function short($url)
    {
        $dbStore = $this->dbStore;
        $id = $dbStore->insert(['url' => $url]);

        $short = $this->decToN62($id);

        $dbStore->update($id, ['short' => $short]);
        return $short;
    }

    public function find($short)
    {
        $id = $this->n62ToDec($short);
        return $this->dbStore->findByID($id);
    }

    public function decToN62($number)
    {
        $tmp = [];
        $str = '';

        do {
            $m = $number % 62;
            $tmp[] = $m;
            $number = floor($number / 62);
        } while ($number != 0);

        $len = count($tmp);
        for ($i = $len - 1; $i >= 0; $i--) {
            $str .= $this->alphanumericMap[$tmp[$i]];
        }
        $str = str_pad($str, 6, $this->alphanumericMap[0], STR_PAD_LEFT);
        return $str;
    }

    public function n62ToDec($string)
    {
        $len = strlen($string);
        $map = array_flip($this->alphanumericMap);
        $number = 0;
        $exp = 0;
        for ($i = $len - 1; $i >= 0; $i--) {
            $number += $map[$string[$i]] * (62 ** $exp);
            $exp++;
        }

        return $number;
    }
}

$testData = [
    'http://www.baidu.com/path/to/file',
    'http://www.google.com/path/to/file',
    'http://sogou.com/path/to/file',
    'http://csdn.net/path/to/file',
    'http://oschina.com/path/to/file',
];
echo '<pre>';
$autoIncrease = new AutoIncreaseShortener();

foreach ($testData as $each) {
    $short = $autoIncrease->short($each);
    $shortUrlMap[] = $short;
}

foreach ($shortUrlMap as $each) {
    $data = $autoIncrease->find($each);
//    var_dump($data);
    echo $data['short'].' : '.$data['url'].'<br>';
}