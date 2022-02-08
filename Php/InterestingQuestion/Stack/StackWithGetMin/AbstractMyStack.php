<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

namespace PHPCodes\InterestingQuestion\Stack\StackWithGetMin;


abstract class AbstractMyStack
{
    abstract public function push($value);

    abstract public function pop();

    abstract public function getMin();

    abstract public function isEmpty();
}