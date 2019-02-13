<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

namespace PHPCodes\Tests\InterestingQuestion\Stack\StackReverse;


use PHPCodes\InterestingQuestion\Stack\StackReverse\ReverseStack;

class StackReverseTest extends \BaseTestCase
{
    public function testIsEmpty()
    {
        $list = [1, 2, 3, 4, 5];

        $stack = new ReverseStack($list);

        $this->assertTrue(!$stack->isEmpty());
        return $stack;
    }

    /**
     * @param $expect
     * @param ReverseStack $stack
     *
     * @dataProvider popProvider
     * @depends testIsEmpty
     */
    public function testPop($expect, ReverseStack $stack)
    {
        $actual = $stack->pop();
        $this->assertEquals($expect, $actual);
    }

    public function popProvider()
    {
        return [
            'one' => [5],
            'two' => [4],
            'three' => [3],
            'four' => [2],
            'five' => [1],
        ];
    }
}