"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json()); // midleware que transforma la req.boyd a un json
const PORT = 3000;
app.get('/ping', (_req, res) => {
    console.log('Ping con exito');
    res.send('pong');
});
app.listen(PORT, () => {
    console.log(`Server running en port ${PORT}`);
});
//# sourceMappingURL=index.js.map