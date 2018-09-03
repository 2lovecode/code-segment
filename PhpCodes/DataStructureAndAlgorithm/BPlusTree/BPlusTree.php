<?php
/**
 * code-segment
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

class BTNode
{
    public $id;
    public $parent;
    public $indexMap = [];

    public function __construct()
    {
        $this->id = uniqid();
    }
}

class innerNode extends BTNode
{
    public $children = [];
}

class LeafNode extends BTNode
{
    public $nextNode;

}
class BPlusTree
{
    public $root;

}