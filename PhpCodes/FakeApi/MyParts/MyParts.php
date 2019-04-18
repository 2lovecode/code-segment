<?php
/**
 * code-segment
 *
 * @author    liu hao<liu546hao@163.com>
 * @copyright liu hao<liu546hao@163.com>
 */

namespace PHPCodes\FakeApi\MyParts;


use PHPCodes\FakeApi\Log;

class MyParts
{
    protected $signal = '';

    const SCENARIO_ATP = 'atp';
    const SCENARIO_APPLY = 'apply';
    const SCENARIO_FINISH = 'finish';
    const SCENARIO_CANCEL = 'cancel';

    protected $signalMethodMap = [
        'atp' => 'atpCheck',
        'apply' => 'apply',
        'finish' => 'finish',
        'cancel' => 'cancel',
    ];

    public function __construct($params = [])
    {
        Log::write(json_encode($params));
        $this->signal = $params['signal'] ?? '';
    }

    public function atpCheck()
    {
        return [
            'code' => 0,
            'stock' => [
                [
                    'pn' => 'MyTestOneR',
                    'sublocation' => 'one',
                    'qty' => 0,
                ],
                [
                    'pn' => 'MyTestTwoR',
                    'sublocation' => 'two',
                    'qty' => 0,
                ],
                [
                    'pn' => 'MyTestThreeBP',
                    'sublocation' => 'three',
                    'qty' => 1,
                ],
                [
                    'pn' => 'MyTestFour',
                    'sublocation' => 'four',
                    'qty' => 1,
                ],
            ]
        ];
    }

    public function exec()
    {
        $data = [];
        if (!empty($this->signal)) {
            $method = $this->signalMethodMap[$this->signal] ?? '';
            if (!empty($method)) {
                if ($result = call_user_func_array([$this, $method], [])) {
                    $data = $result;
                }
            }
        }

        $this->returnJson($data);
    }

    protected function returnJson($data)
    {
        Log::write(json_encode($data));
        echo json_encode($data);
    }
}