<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

class ShellSort
{
    private $originalData = [];

    public function __construct($original = [])
    {
        $this->originalData = $original;
    }

    public function sort()
    {
        return [];
    }
}

$shellSort = new ShellSort();
echo '<pre>';
var_dump($shellSort->sort());