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
exports.dump = void 0;
const log_1 = require("../../utils/log");
const client_1 = require("../../networking/client");
const fs_1 = __importDefault(require("fs"));
function dump(host, spaceId, key, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_1.CharleeClient(key, host, spaceId);
        if (!fs_1.default.existsSync(`${path}`)) {
            fs_1.default.mkdirSync(`${path}`);
        }
        yield dumpEntities("contenttype", "contentTypeId", "contenttypes", client, path);
        yield dumpEntities("folder", "folderId", "folders", client, path);
        yield dumpEntities("content", "contentId", "items", client, path);
        yield dumpEntities("webhook", "webookId", "webhooks", client, path);
    });
}
exports.dump = dump;
function dumpEntities(entity, entityIdProperty, responseListingProperty, client, path) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)(`Dumping ${entity}s`);
        let entitiesToDump = [];
        (0, log_1.log)(`   Listing ${entity}s`);
        const resp = yield client.get(`/${entity}`);
        entitiesToDump = [...resp[responseListingProperty].map(p => p[entityIdProperty])];
        (0, log_1.log)(`      Found ${entitiesToDump.length} ${entity}s`);
        if (!fs_1.default.existsSync(`${path}/${entity}`)) {
            fs_1.default.mkdirSync(`${path}/${entity}`);
        }
        if (entity === "folder") {
            for (const folder of resp.folders) {
                fs_1.default.writeFileSync(`${path}/${entity}/${folder.folderId}.json`, JSON.stringify(folder, null, 3));
            }
        }
        else {
            for (const entityId of entitiesToDump) {
                yield dumpEntity(client, entity, entityId, path);
            }
        }
    });
}
function dumpEntity(client, entity, entityId, path) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, log_1.log)(`   Fetching ${entityId}`);
        try {
            const resp = yield client.get(`/${entity}/${entityId}`);
            fs_1.default.writeFileSync(`${path}/${entity}/${entityId}.json`, JSON.stringify(resp, null, 3));
        }
        catch (ex) {
            console.log(ex);
            (0, log_1.log)(`      Faild to fetch ${entity}`);
        }
    });
}
//# sourceMappingURL=dump.js.map