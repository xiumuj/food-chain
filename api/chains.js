// api/chains.js (Vercel Serverless Function)
// 注意：无数据库版本，重启/闲置后数据会清空。如果需要持久化，建议连接 Vercel KV (Redis)
let globalChains = [];

export default function handler(req, res) {
    // 处理跨域 (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 1. 学生提交正确食物链 (POST)
    if (req.method === 'POST') {
        const { foodChain, studentName } = req.body;
        if (foodChain && Array.isArray(foodChain)) {
            globalChains.push({
                name: studentName || "学生",
                chain: foodChain,
                time: new Date().toLocaleTimeString('zh-CN')
            });
            // 保持数据在合理范围内 (可选)
            if (globalChains.length > 500) globalChains.shift();
            
            return res.status(200).json({ status: 'success', message: '已同步到教师端' });
        }
        return res.status(400).json({ error: '数据格式不正确' });
    }

    // 2. 教师端清除所有数据 (DELETE)
    if (req.method === 'DELETE') {
        globalChains = [];
        return res.status(200).json({ status: 'success', message: '所有数据已清空' });
    }

    // 3. 教师端/学生端获取所有数据 (GET)
    if (req.method === 'GET') {
        return res.status(200).json(globalChains);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
