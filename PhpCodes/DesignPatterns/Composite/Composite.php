<?php
/*
*
*	组合模式：将组件和组件的组合统一，
*
*
*
*/

class InvalidMethodException extends \Exception
{

}

abstract class AbstractComponent
{
	public function add()
	{
		throw new InvalidMethodException();
	}

	public function remove()
	{
		throw new InvalidMethodException();
	}

	public function getName()
	{
		throw new InvalidMethodException();
	}
}

class Component extends AbstractComponent
{
	public function getName()
	{

	}
}

class Composite extends AbstractComponent
{
	public function add()
	{

	}

	public function remove()
	{
		
	}
}