const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'super-secret-key-panafrican-aller-retour-2026';
const token = jwt.sign(
  { sub: '5e232aa1-a908-407c-a11d-223246aa6fb9', role: 'SUPER_ADMIN', isVerified: true },
  secret,
  { expiresIn: '1d' }
);

console.log(token);
