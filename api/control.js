import fetch from 'node-fetch';
// 注意：这里需要替换为你的开发板实际IP和端口
const BOARD_IP = "192.168.42.1";
const BOARD_PORT = "8080";

export default async function handler(req, res) {
  const { state } = req.query;
  
  if (!state || !['on', 'off'].includes(state)) {
    return res.status(400).json({ error: '无效的状态参数' });
  }

  try {
    // 转发请求到开发板
    const boardResponse = await fetch(`http://${BOARD_IP}:${BOARD_PORT}/${state}`);
    
    if (!boardResponse.ok) {
      throw new Error('开发板响应异常');
    }
    
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('中转错误:', error);
    res.status(500).json({ error: '无法连接到开发板', details: error.message });
  }
}
