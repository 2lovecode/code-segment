<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 *
 *
 * 容器事件
 */

require_once '../OContainer.php';

interface Ei
{
    public function run();
}

class Ei01 implements Ei
{
    public function run()
    {
    }
}

class Ei02 implements Ei
{
    public function run()
    {
    }
}
/************************** 容器事件 ********************************/

$container = new OContainer();

//绑定全局容器事件
$container->resolving(function () {
    echo 'Global Resolving!';
});

//绑定局部容器事件
$container->resolving('Ei02', function () {
   echo 'Ei02 Resolving';
});

//获取实例
$container->make('Ei01');
echo '<hr>';
$container->make('Ei02');