<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

class ArrayReduce
{
    public function run()
    {
        return array_reduce([1, 3], function ($carry, $item) {
            $carry += $item;
            return $carry;
        }, 0);
    }
}

$test = new ArrayReduce();
var_dump($test->run());