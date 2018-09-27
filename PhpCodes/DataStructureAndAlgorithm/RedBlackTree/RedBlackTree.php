<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 红黑树
 * 1.节点是红色或黑色
 * 2.根是黑色
 * 3.所有的叶子节点都是黑色
 * 4.每个红色节点必须有两个黑色节点
 * 5.从任一节点到其叶子节点的简单路径都包含相同数量的黑色节点
 *
 */

class Node
{
    private $id;

    /**
     * @var
     * 1 => red
     * 2 => black
     */
    private $color = 1;

    private $value = null;

    public $parent = 0;
    
    public $left = 0;

    public $right = 0;

    public function __construct($value)
    {
        $this->id = uniqid();
        $this->value = $value;
    }

    public function getID()
    {
        return $this->id;
    }

    public function getValue()
    {
        return $this->value;
    }

    public function setColor($color)
    {
        $this->color = $color;
    }

    public function getColor()
    {
        return $this->color;
    }
}

class RedBlackTree
{
    private $root = 0;

    private $nodePool = [];

    public function addNodeToPool($id, $object)
    {
        $this->nodePool[$id] = $object;
    }

    /**
     * @param $id
     * @return Node
     */
    public function getNodeFromPool($id)
    {
        return isset($this->nodePool[$id]) ? $this->nodePool[$id] : null;
    }

    public function find($value)
    {
        $tmp = $this->getNodeFromPool($this->root);

        while (!is_null($tmp)) {
            if ($tmp->getValue() > $value) {
                $tmp = $this->getNodeFromPool($tmp->left);
            } else if ($tmp->getValue() < $value) {
                $tmp = $this->getNodeFromPool($tmp->right);
            } else {
                return true;
            }
        }

        return false;
    }

    public function insert($value)
    {
        if ($this->isEmpty()) {
            $node = new Node($value);
            $node->setColor(2);
            $this->root = $node->getID();
        } else {

        }

        return true;
    }

    public function delete($value)
    {

    }

    public function isEmpty()
    {
        return $this->root == 0;
    }

}