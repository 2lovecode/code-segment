<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */
require_once 'SimpleContainer.php';

interface AInterface
{
    public function run();
}

class A implements AInterface
{
    public function run()
    {
        return 'I am A!';
    }
}

class B
{
    private $example;

    public function __construct(AInterface $example)
    {
        $this->example = $example;
    }

    public function run()
    {
        $str = $this->example->run();
        return '<<<< '.$str.' >>>>';
    }
}
$container = new SimpleContainer();

//示例1
$container->set('AInterface', 'A');
$a = $container->get('AInterface');
var_dump($a->run());

//示例2
$b = $container->get('B');
var_dump($b->run());
