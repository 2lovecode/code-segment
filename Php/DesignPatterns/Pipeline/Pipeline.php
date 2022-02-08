<?php

/*
*
*
* 管道模式：对于管道模式来说，有3个对象：管道，载荷，过滤器(阶段，阀门均可)。我们的目的是在管道中对载荷进行一系列的处理。因为可以对过滤器进行动态的添加，所以对载荷的处理可以变得更加灵活。但同时带来的问题是，在过滤器过多时，我们很难把握整体的处理逻辑。而且在某一个过滤器对载荷处理后，因为载荷改变，会造成下一个过滤器中的逻辑出错。
*
*
* 在我们的示例中：管道类是Pipeline，载荷是在实例化Pipeline时传递的payLoad，过滤器是所有实现StageInterface的类。在web应用中，在服务器将请求分发给php的web入口文件到到达具体处理请求的文件的周期中，我们可以对request这个载荷的处理，可以应用管道模式。
*
*
*
*/
interface PipelineInterface
{
	public function __construct($payLoad);

	public function pipe(StageInterface $stage);

	public function process();
}

interface StageInterface
{
	public function handle($payLoad);
}

class StageAddOne implements StageInterface
{
	public function handle($payLoad)
	{
		return $payLoad + 1;
	}
}

class StageMultiTwo implements StageInterface
{
	public function handle($payLoad)
	{
		return $payLoad * 2;
	}
}


class StageAddTwo implements StageInterface
{
	public function handle($payLoad)
	{
		return $payLoad + 2;
	}
}


class Pipeline implements PipelineInterface
{
	private $pipes;
	private $payLoad;

	public function __construct($payLoad)
	{
		$this->payLoad = $payLoad;
	}

	public function pipe(StageInterface $stage)
	{
		$this->pipes[] = $stage;
		return $this;
	}

	public function process()
	{
		foreach ($this->pipes as $eachPipe)
		{
			$this->payLoad = call_user_func([$eachPipe, 'handle'], $this->payLoad);
		}

		return $this->payLoad;
	}
}


class Test
{
	public function run()
	{
		$payLoad = 10;

		$stageAddOne = new StageAddOne();
		$stageMultiTwo = new StageMultiTwo();
		$stageAddTwo = new StageAddTwo();

		$pipe = new Pipeline($payLoad);

		return $pipe->pipe($stageAddOne)->pipe($stageMultiTwo)->pipe($stageAddTwo)->process();
	}
}

$test = new Test();

echo '<pre>';
var_dump($test->run());