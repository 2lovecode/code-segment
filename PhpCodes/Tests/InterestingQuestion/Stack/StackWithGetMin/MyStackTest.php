<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */
use PHPCodes\InterestingQuestion\Stack\StackWithGetMin\MyStack;

class MyStackTest extends BaseTestCase
{

    public function testIsEmpty()
    {
        $myStack = new MyStack();

        $this->assertTrue($myStack->isEmpty());

        return $myStack;
    }

}