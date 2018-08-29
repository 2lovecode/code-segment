<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

class Node
{
    public $index;
    public $value;

    public function setValue($value)
    {
        $this->value = $value;
        $this->index = $value['index'];

        return $this->index;
    }
}

class TreeNode
{
    public $parent = null;

    public $nodeList = [];

    public $indexList = [];

    public $children = [];

    public $nodeNum = 0;

    public function __construct($order = 3)
    {
        for ($i = 0; $i < ($order - 1); $i++) {
            $this->indexList[$i] = 0;
            $this->nodeList[$i] = null;
        }
        for ($i = 0; $i < $order; $i++) {
            $this->children[$i] = null;
        }
    }

    public function setValue($value)
    {
        $node = new Node();
        $index = $node->setValue($value);
        array_push($this->indexList, $index);
        $this->nodeList[$index] = $node;
        sort($this->indexList);
        $this->nodeNum = count($this->indexList);
    }
}



class BTree
{
    /**
     * @var TreeNode
     */
    public $rootNode = null;

    public $order = 3;

    public function __construct($order = 3)
    {
        $this->order = $order;
    }

    public function insert($value)
    {
        if ($this->isEmpty()) {
            $newNode = new TreeNode($this->order);
            $newNode->setValue($value);
            $this->rootNode = $newNode;
        } else {
            $nowNode = $this->rootNode;
            $index = $value['index'];
            while ($nowNode != null) {
                foreach ($nowNode->indexList as $value) {
                    if ($index < $value) {
                        
                    }
                }
            }
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
        } else {
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


