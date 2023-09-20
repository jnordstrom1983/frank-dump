"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharleeClient = void 0;
const axios_1 = __importDefault(require("axios"));
class CharleeClient {
    constructor(key, host, spaceId) {
        this.key = key;
        this.host = host;
        this.spaceId = spaceId;
        if (!host.toLowerCase().startsWith("http://") && !host.toLowerCase().startsWith("https://")) {
            this.baseUrl = `https://${host}/`;
        }
        else {
            this.baseUrl = `${host}/`;
        }
    }
    post(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield axios_1.default.post(`${this.baseUrl}/api/space/${this.spaceId}${path}`, data, {
                headers: {
                    Authorization: `Bearer ${this.key}`
                }
            });
            return resp;
        });
    }
    put(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield axios_1.default.put(`${this.baseUrl}/api/space/${this.spaceId}${path}`, data, {
                headers: {
                    Authorization: `Bearer ${this.key}`
                }
            });
            return resp.data;
        });
    }
    get(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield axios_1.default.get(`${this.baseUrl}/api/space/${this.spaceId}${path}`, {
                headers: {
                    Authorization: `Bearer ${this.key}`
                }
            });
            return resp.data;
        });
    }
    delete(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const resp = yield axios_1.default.delete(`${this.baseUrl}/api/space/${this.spaceId}${path}`, {
                headers: {
                    Authorization: `Bearer ${this.key}`
                }
            });
            return resp.data;
        });
    }
}
exports.CharleeClient = CharleeClient;
//# sourceMappingURL=client.js.map