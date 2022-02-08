<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

namespace PHPCodes\Tests\InterestingQuestion\Stack\StackWithGetMin;


use PHPCodes\InterestingQuestion\Stack\StackWithGetMin\MyStackAnother;

class MyStackAnotherTest extends \BaseTestCase
{
    public function testIsEmpty()
    {
        $myStack = new MyStackAnother();
        $this->assertTrue($myStack->isEmpty());

        return $myStack;
    }

    /**
     * @param $value
     * @param $except
     * @param MyStackAnother $myStack
     *
     * @dataProvider pushProvider
     * @depends testIsEmpty
     */
    public function testPushAndGetMin($value, $except, MyStackAnother $myStack)
    {
        $myStack->push($value);
        $this->assertEquals($except, $myStack->getMin());
    }

    public function pushProvider()
    {
        return [
            'one'   => [111, 111],
            'two'   => [222, 111],
            'three' => [33, 33],
            'four'  => [44, 33]
        ];
    }

    /**
     * @param $value
     * @param $except
     * @param MyStackAnother $myStack
     *
     * @dataProvider popProvider
     * @depends testIsEmpty
     * @depends testPushAndGetMin
     */
    public function testPopAndGetMin($value, $except, MyStackAnother $myStack)
    {
        $this->assertEquals($except, $myStack->getMin());
        $current = $myStack->pop();
        $this->assertEquals($value, $current);
    }

    public function popProvider()
    {
        return [
            'one'   => [44, 33],
            'two'   => [33, 33],
            'three' => [222, 111],
            'four'  => [111, 111]
        ];
    }
}