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
    protected $params = [];

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
        $this->params = $params;
    }

    public function atpCheck()
    {
        return [
            'code' => 0,
            'stock' => [
                [
                    'pn' => 'MyTestOne',
                    'sublocation' => 'one',
                    'qty' => 100,
                ],
                [
                    'pn' => 'MyTestTwo',
                    'sublocation' => 'two',
                    'qty' => 100,
                ]
            ]
        ];
    }

    public function apply()
    {
        $parts = $this->getParamsValue("parts", []);
        $stock = [];
        foreach ($parts as $each) {
            $stock[] = [
                "pn" => $each["newPn"],
                "pnStatus" => "0",
                "sublocation" => "",
                "qty" => "997"
            ];
        }
        return [
            "code" => 0,
            "serviceOrder" => $this->getParamsValue("serviceOrder"),
            "status" => 0,
            "stock" => $stock,
            "errdbmsg" => "ERROR_SUCCESS"
        ];
    }

    public function finish()
    {
        return [
            "serviceOrder" => $this->getParamsValue("serviceOrder"),
            "status" => 1,
            "code" => 0,
            "errdbmsg" => "ERROR_SUCCESS"
        ];
    }

    public function cancel()
    {
        return [
            "serviceOrder" => $this->getParamsValue("serviceOrder"),
            "status" => 1,
            "code" => 0,
            "errdbmsg" => "ERROR_SUCCESS"
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

    protected function getParamsValue($key, $default = '')
    {
        return isset($this->params[$key]) ? $this->params[$key] : $default;
    }
}