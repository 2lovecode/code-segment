<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

require_once "AbstractMyStack.php";
require_once "MyStack.php";

use PHPCodes\InterestingQuestion\Stack\StackWithGetMin\MyStack;

$dataList = [100, 22, 39, 44, 11, 24];

$myStack = new MyStack();

foreach ($dataList as $eachValue) {
    $myStack->push($eachValue);
    var_dump($myStack->getMin());
}

echo '<hr>';

foreach ($dataList as $value) {
    var_dump($myStack->getMin());
    $myStack->pop();
}