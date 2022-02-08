<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

require_once "ReverseStack.php";

$testData = [1, 2, 3, 4, 5];
$reverseStack = new \PHPCodes\InterestingQuestion\Stack\StackReverse\ReverseStack($testData);

while (!$reverseStack->isEmpty()) {
    var_dump($reverseStack->pop());
}

