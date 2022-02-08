<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

interface ContextualBindingBuilderInterface
{
    public function needs($abstract);

    public function give($implementation);
}