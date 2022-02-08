<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

namespace App;


use Service\Random;

class Welcome extends AbstractApp
{
    public function index()
    {
        $random = new Random();
        $random->setList(['c', 'php', 'go', 'java']);
        return $random->exec();
    }
}