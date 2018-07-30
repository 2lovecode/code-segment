<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 * 绑定一个实例
 */

require_once '../OContainer.php';

interface Ec
{
    public function run();
}

class Ec01 implements Ec
{
    public function run()
    {
        return 'I am Ec01';
    }
}

/************************** 绑定一个单例示例 ********************************/

$container = new OContainer();

$ec01 = new Ec01();

//绑定
$container->instance('Ec', $ec01);

//获取实例
$ec0101 = $container->make('Ec');

var_dump($ec0101->run());