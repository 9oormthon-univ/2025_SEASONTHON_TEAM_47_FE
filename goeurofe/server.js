// server.js (최소 동작 보장 버전)
const express = require('express');
const cors = require('cors');

const app = express();

// 미들웨어
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000'], // CRA 프론트 허용
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors()); // 프리플라이트 통과

// 테스트 라우트 (CORS/POST 확인용)
app.post('/api/itineraries/generate', (req, res) => {
  res.json({ ok: true, eQcho: req.body });
});

// 헬스 체크 (선택)
app.get('/healthz', (req, res) => res.send('ok'));

const PORT = 8080;
app.listen(PORT, () => console.log('listening on', PORT));
