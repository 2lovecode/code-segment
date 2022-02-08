<?php
/**
 * Created by PhpStorm.
 * User: tank
 * Date: 2018/5/11
 * Time: 19:47
 */


header("Content-type:text/html; charset=utf-8");

/**
 * 敏感词查找
 *
 * 假设需要查找的敏感词有：
 *      1.a b c d e
 *
 *      注：1的左对齐子集
 *      2.a b c
 *      3.a b
 *      4.a
 *
 *      注：1的非左对齐子集
 *      5.b c d e
 *      6.d e
 *
 *      注：包含1的非左对齐子集
 *      7.d e f g
 *      8.e f g
 *
 *
 * 假设需要处理的字符串是：
 *     x x x x x a b c d e f g x x x x x
 *
 * 要求对于该字符串，以上8个敏感词都要命中
 */

class LetterObject
{
    public $value;
    public $frequency;

    public function __construct($value)
    {
        $this->value = $value;
        $this->frequency = 1;
    }
}


class LetterTable
{
    private $letterTable = [];

    private static $instance = null;

    private function __construct()
    {

    }

    public static function instance()
    {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function __clone()
    {
        return self::$instance;
    }

    public function set($letter)
    {
        if (!$this->isExists($letter)) {
            $letterObject = new LetterObject($letter);
            $this->letterTable[$letter] = $letterObject;
        } else {
            $letterObject = $this->get($letter);
            $letterObject->frequency = $letterObject->frequency + 1;
        }
    }

    public function get($letter)
    {
        return $this->isExists($letter) ? $this->letterTable[$letter] : null;
    }

    public function isExists($letter)
    {
        return isset($this->letterTable[$letter]);
    }
}

class TreeNode
{
    public $isEnd = 0;
    public $value = null;

    private $letterList = [];

    public function get($letter)
    {
        return isset($this->letterList[$letter]) ? $this->letterList[$letter] : null;
    }

    public function set($letter, $nextNode)
    {
        $letterTable = LetterTable::instance();
        $letterObject = $letterTable->get($letter);
        $nextNode->value = $letterObject;
        $this->letterList[$letter] = $nextNode;
    }

    public function hasNext()
    {
        return !empty($this->letterList);
    }
}

class SensitiveWordTree
{
    public $tree = null;

    public function addWordToTree($word)
    {
        $len = mb_strlen($word);
        if (is_null($this->tree)) {
            $tree = new TreeNode();
            $tree->isEnd =  0;
        } else {
            $tree = $this->tree;
        }
        $tmp = $tree;

        for ($i = 0; $i < $len; $i++) {
            $nowLetter = mb_substr($word, $i, 1);

            $letterTable = LetterTable::instance();
            $letterTable->set($nowLetter);

            $nowTree = $tree->get($nowLetter);

            if (!is_null($nowTree)) {
                $tree = $nowTree;
            } else {
                $newTree = new TreeNode();
                $newTree->isEnd = 0;
                $tree->set($nowLetter, $newTree);
                $tree = $newTree;
            }

            if ($i == ($len - 1)) {
                $tree->isEnd = 1;
            }
        }
        $this->tree = $tmp;
    }

    public function search($string)
    {
        $len = mb_strlen($string);
        $result = [];
        $stack = [];
        $letterTable = LetterTable::instance();

        $tmpTree = $this->tree;

        for ($i = 0; $i < $len; $i++) {
            $nowLetterA = mb_substr($string, $i, 1);
            if ($letterTable->isExists($nowLetterA) && ($i != ($len - 1))) {
                if (!is_null($tmpTree->get($nowLetterA))) {
                    array_push($stack, $i);
                }
            } else {
                $end = $i;
                while (count($stack) > 0) {
                    $curIndex = array_pop($stack);
                    $start = $curIndex;
                    $tmpWord = '';
                    $tree = $tmpTree;
                    for ($j = $curIndex; $j < $end; $j++) {
                        $nowLetter = mb_substr($string, $j, 1);
                        $nowTree = $tree->get($nowLetter);

                        if (!is_null($nowTree)) {
                            $tmpWord .= $nowLetter;
                            if ($nowTree->isEnd) {
                                array_push($result, [
                                    'word' => $tmpWord,
                                    'startOffset' => $start,
                                    'endOffset' => $j + 1,
                                ]);
                                if ($nowTree->hasNext()) {
                                    $tree = $nowTree;
                                } else {
                                    $start = $j;
                                    $tmpWord = '';
                                    $tree = $tmpTree;
                                }
                            } else {
                                $tree = $nowTree;
                            }
                        } else {
                            $start = $j;
                            $tmpWord = '';
                            $tree = $tmpTree;
                        }
                    }
                }
            }
        }

        return $result;
    }
}

$example = new SensitiveWordTree();

$sensitiveWordList = [
    '中国人',
    '中国男人',
    '中国女人',
    '中国男',
    '中国女',
    '中国',
    '男人',
    '女人',
    '男',
    '女',
    '人',
    '人们',
];

foreach ($sensitiveWordList as $eachWord) {
    $example->addWordToTree($eachWord);
}

$exampleStr = '我是男人啊啊啊啊中国人,我爱中国，中国男人们，中国女人们，中国男女们';

$result = $example->search($exampleStr);

echo '<hr>';
echo '添加的敏感词('.count($sensitiveWordList).'):<br><br>';
foreach ($sensitiveWordList as $eachWord) {
    echo $eachWord.'<br>';
}
echo '<hr>';
echo '处理的字符串示例('.mb_strlen($exampleStr).'):<br><br>';
echo $exampleStr.'<br>';
echo '<hr>';
echo '查找到的敏感词及其位置('.count($result).'):<br><br>';
foreach ($result as $eachData) {
    echo '<h5>'.$eachData['word'].'</h5><span style="font-size:10px">&nbsp;&nbsp;&nbsp;&nbsp;开始偏移量: '.$eachData['startOffset'].' 结束偏移量: '.$eachData['endOffset'].'</span>';
}
