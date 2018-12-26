<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

require_once "AbstractMyStack.php";
require_once "MyStackAnother.php";

use PHPCodes\InterestingQuestion\Stack\StackWithGetMin\MyStackAnother;

$dataList = [200, 222, 39, 144, 11, 24];

$myStack = new MyStackAnother();

foreach ($dataList as $eachValue) {
    $myStack->push($eachValue);
    var_dump($myStack->getMin());
}

echo '<hr>';

foreach ($dataList as $value) {
    var_dump($myStack->getMin());
    $myStack->pop();
}