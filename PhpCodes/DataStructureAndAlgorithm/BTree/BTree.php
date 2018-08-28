<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

class ValueObject
{
    private $index;
    private $value;

    public function __construct($value)
    {
        $this->value = $value;
        $this->index = $value['index'];
    }

    public function getIndex()
    {
        return $this->index;
    }

    public function getValue()
    {
        return $this->value;
    }
}

class TreeNode
{
    public $parentNode = null;

    public $children = [];

    private $maxValueNum = 3;

    private $currentValueNum = 0;

    private $maxChildNum = 3;

    private $currentChildNum = 0;

    private $valueMap = [];

    public function __construct($max = 3)
    {
        $this->maxValueNum = $max;
        $this->maxChildNum = $max;
    }

    public function addValue($value)
    {
        $valueObject = new ValueObject($value);
        $this->valueMap[$valueObject->getIndex()] = $valueObject;
        ksort($this->valueMap);
        $this->currentValueNum++;
    }

    public function addChild($value)
    {

    }

}



class BTree
{
    public $rootNode = null;

    public $order = 3;

    public function __construct($order = 3)
    {
        $this->order = $order;
    }

    public function insert($value)
    {
        if ($this->isEmpty()) {
            $node = new TreeNode($this->order);
            $node->addValue($value);
            $this->rootNode = $node;
        } else {
            $current = $this->find($value['index']);
            $current->addValue($value);


        }
    }

    /**
     * @param $index
     * @return TreeNode
     */
    public function find($index)
    {
        if ($this->isEmpty()) {
            return null;
        }
    }

    public function isEmpty()
    {
        return is_null($this->rootNode);
    }
}

$btree = new BTree();

$array = [
    [
        'index' => 1,
        'name' => 'a',
    ],
    [
        'index' => 5,
        'name' => 'b',
    ],
    [
        'index' => 9,
        'name' => 'g',
    ],
    [
        'index' => 2,
        'name' => 'j',
    ],
    [
        'index' => 3,
        'name' => 'k',
    ],
    [
        'index' => 10,
        'name' => 'l',
    ],
];

foreach ($array as $value) {
    $btree->add($value);
}

var_dump($btree->find(1));


