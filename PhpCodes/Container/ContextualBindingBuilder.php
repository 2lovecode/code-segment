<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */
require_once 'ContextualBindingBuilderInterface.php';

class ContextualBindingBuilder implements ContextualBindingBuilderInterface
{
    protected $container;

    protected $concrete;

    protected $needs;

    public function __construct(OContainer $container, $concrete)
    {
        $this->concrete = $concrete;
        $this->container = $container;
    }

    public function needs($abstract)
    {
        $this->needs = $abstract;

        return $this;
    }

    public function give($implementation)
    {
        $this->container->addContextualBinding(
            $this->concrete, $this->needs, $implementation
        );
    }
}