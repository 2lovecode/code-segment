<?php

// clone的作用是对象复制。
// 1.在php中，我们把一个对象赋值给一个变量，实际上是把这个对象的引用赋给变量，他们指向的是同一个对象。当使用这个变量对对象进行操作时，实际上会影响所有指向这个对象的变量。
namespace test1;

class TestA
{
	public $testPro;
}

$testA = new TestA();
$testData = $testA;

$testA->testPro = 'original value';
$testData->testPro = 'change value';
var_dump($testA->testPro);
var_dump($testData->testPro);
echo '<hr>';

// 在示例中，我们可以看到把$testA赋值给$testData，实际上是把指向testA对象的引用赋给了$testData。直观的表现是，当我们改变$testData->testPro的值时，$testA->testPro的值随之改变。

// 2.而php给我们提供了复制一个对象的方法，使用clone时，会在内存中重新开辟一个空间存放新的对象，变量指向这个新的空间地址。
namespace test2;

class TestA
{
	public $testPro;
}

$testA = new TestA();
$testData = clone $testA;

$testA->testPro = 'original value';
$testData->testPro = 'change value';

var_dump($testA->testPro);
var_dump($testData->testPro);
echo '<hr>';

// 在示例中，我们可以看到把$testA clone的副本赋值给$testData，实际上是复制一份新的testA对象放到一个新的内存空间，把这个新的内存空间的地址赋给$testData。直观的表现是，当我们改变$testData->testPro的值时，$testA->testPro的值随不改变。

// 3.但是，clone复制的新对象中的引用属性仍然指向旧对象该属性指向的地址。即所有的引用属性仍然会是一个指向原来变量的引用。
namespace test3;

class TestA
{
	public $testPro;
}

class TestB
{
	public $testA;
}

$testA = new TestA();

$testA->testPro = 'original value';

$testB = new TestB();
$testB->testA = $testA;
$testB->testA->testPro = 'testB change value';

$cloneTestB = clone $testB;
$cloneTestB->testA->testPro = 'cloneTestB change value';

var_dump($cloneTestB->testA->testPro);
var_dump($testB->testA->testPro);
var_dump($testA->testPro);
echo '<hr>';

// 结果：
// string(23) "cloneTestB change value" 
// string(23) "cloneTestB change value" 
// string(23) "cloneTestB change value"

// 在示例中，我们可以看到cloneTestB 对象中的属性testA仍然和testB 对象中的属性testA指向的是同一个对象testA（直观的表现就是改变$cloneTestB->testA->testPro的值，$testB->testA->testPro和$testA->testPro的值随之改变）。

// 4.那么，如何解决3中的问题呢？我们可以在__clone()魔术方法中强制把testA属性指向一个经过clone得到的新的testA对象。

namespace test4;

class TestA
{
	public $testPro;
}

class TestB
{
	public $testA;

	public function __clone()
	{
		$this->testA = clone $this->testA;
	}
}

$testA = new TestA();

$testA->testPro = 'original value';

$testB = new TestB();
$testB->testA = $testA;
$testB->testA->testPro = 'testB change value';

$cloneTestB = clone $testB;
$cloneTestB->testA->testPro = 'cloneTestB change value';

var_dump($cloneTestB->testA->testPro);
var_dump($testB->testA->testPro);
var_dump($testA->testPro);

// 结果：
// string(23) "cloneTestB change value"
// string(18) "testB change value"
// string(18) "testB change value" 

// 在示例中，我们重载了TestB类的__clone魔术方法，在该方法中，我们把testA的值修改为原值的一个clone复制。这样经过clone得到的新对象的testA属性指向的地址和旧对象testA属性指向的地址就不同了。直观的表现是我们改变$cloneTestB->testA->testPro的值时，$testB->testA->testPro和$testA->testPro的值不再随之改变。