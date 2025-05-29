const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 提供静态前端页面
app.use(express.static(path.join(__dirname, 'public')));

// API 路由：中转控制开发板
app.get('/api/control', async (req, res) => {
    const { state } = req.query;
    if (!state || !['on', 'off'].includes(state)) {
        return res.status(400).json({ error: '无效的状态参数' });
    }

    try {
        const BOARD_IP = '192.168.42.1';
        const BOARD_PORT = '8080';
        const response = await fetch(`http://${BOARD_IP}:${BOARD_PORT}/${state}`);

        if (!response.ok) {
            throw new Error('开发板响应异常');
        }

        res.status(200).json({ status: 'success' });
    } catch (error) {
        console.error('中转错误:', error);
        res.status(500).json({ error: '无法连接到开发板', details: error.message });
    }
});

// 启动服务
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
