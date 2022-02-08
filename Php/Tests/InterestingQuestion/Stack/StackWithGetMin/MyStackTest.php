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

    /**
     * @param $value
     * @param $result
     * @param MyStack $myStack
     * @dataProvider pushAndGetMinProvider
     * @depends testIsEmpty
     */
    public function testPushAndGetMin($value, $result, MyStack $myStack)
    {
        $myStack->push($value);
        $this->assertEquals($result, $myStack->getMin());
    }

    public function pushAndGetMinProvider()
    {
        return [
            'one'   => [200, 200],
            'two'   => [150, 150],
            'three' => [165, 150],
            'four'  => [22, 22],
            'five'  => [34, 22],
            'six'   => [11, 11],
        ];
    }

    /**
     * @param $myStack
     * @param $expect
     * @param $value
     * @dataProvider popAndGetMinProvider
     * @depends testIsEmpty
     * @depends testPushAndGetMin
     */
    public function testPopAndGetMin($expect, $value, MyStack $myStack)
    {
        $this->assertEquals($expect, $myStack->getMin());
        $current = $myStack->pop();
        $this->assertEquals($value, $current);
    }

    public function popAndGetMinProvider()
    {
        return [
            'one'   => [11, 11],
            'two'   => [22, 34],
            'three' => [22, 22],
            'four'  => [150, 165],
            'five'  => [150, 150],
            'six'   => [200, 200]
        ];
    }
}