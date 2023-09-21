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
exports.restore = void 0;
const client_1 = require("../../networking/client");
const log_1 = require("../../utils/log");
const fs_1 = __importDefault(require("fs"));
function restore(host, spaceId, key, path) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new client_1.CharleeClient(key, host, spaceId);
        if (!fs_1.default.existsSync(`${path}`)) {
            (0, log_1.log)(`Path not found: ${path}`);
            return;
        }
        const restoredContentTypes = yield restoreContentTypes(client, path);
        const restoredFolders = yield restoreFolders(client, path, restoredContentTypes);
        const restoredContentItems = yield restoreContent(client, path, restoredContentTypes, restoredFolders);
    });
}
exports.restore = restore;
function restoreContentTypes(client, path) {
    return __awaiter(this, void 0, void 0, function* () {
        let restored = [];
        if (!fs_1.default.existsSync(`${path}/contenttype`))
            return restored;
        (0, log_1.log)("Restoring contenttypes");
        const files = fs_1.default.readdirSync(`${path}/contenttype`);
        for (const file of files) {
            const data = JSON.parse(fs_1.default.readFileSync(`${path}/contenttype/${file}`).toString());
            (0, log_1.log)(`   Restoring ${data.contentTypeId}`);
            try {
                let response = yield client.post("/contenttype", {
                    name: data.name,
                    contentTypeId: data.contentTypeId
                });
                restored.push({ oldId: data.contentTypeId, newId: response.data.contenttype.contentTypeId });
            }
            catch (ex) {
                console.log(ex);
                (0, log_1.log)(`      Failed to restore`);
            }
        }
        for (const file of files) {
            let json = fs_1.default.readFileSync(`${path}/contenttype/${file}`).toString();
            let data = JSON.parse(json);
            const oldId = data.contentTypeId;
            const newId = restored.find(p => p.oldId === oldId).newId;
            if (!newId) {
                (0, log_1.log)(`   Could not find new content type id`);
                continue;
            }
            for (const r of restored) {
                var re = new RegExp(r.oldId, "g");
                json = json.replace(re, r.newId);
            }
            data = JSON.parse(json);
            (0, log_1.log)(`  Updating content type settings ${data.contentTypeId}`);
            try {
                yield client.put(`/contenttype/${newId}`, {
                    name: data.name,
                    enabled: data.enabled,
                    fields: data.fields,
                    generateSlug: data.generateSlug,
                    hidden: data.hidden
                });
            }
            catch (ex) {
                console.log(ex);
                (0, log_1.log)(`      Failed to restore`);
            }
        }
        return restored;
    });
}
function restoreFolders(client, path, restoredContentTypes) {
    return __awaiter(this, void 0, void 0, function* () {
        let restored = [];
        if (!fs_1.default.existsSync(`${path}/folder`))
            return restored;
        (0, log_1.log)("Restoring folders");
        const files = fs_1.default.readdirSync(`${path}/folder`);
        for (const file of files) {
            const data = JSON.parse(fs_1.default.readFileSync(`${path}/folder/${file}`).toString());
            (0, log_1.log)(`   Restoring ${data.folderId}`);
            try {
                let response = yield client.post("/folder", {
                    name: data.name,
                    folderId: data.folderId
                });
                yield client.put(`/folder/${response.data.folderId}`, {
                    name: data.name,
                    contentTypes: data.contentTypes.map(c => {
                        var _a, _b;
                        return (_b = (_a = restoredContentTypes.find(p => p.oldId === c)) === null || _a === void 0 ? void 0 : _a.newId) !== null && _b !== void 0 ? _b : c;
                    })
                });
                restored.push({ oldId: data.folderId, newId: response.data.folderId });
            }
            catch (ex) {
                console.log(ex);
                (0, log_1.log)(`      Failed to restore`);
            }
        }
        return restored;
    });
}
function restoreContent(client, path, restoredContentTypes, restoredFolders) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let restored = [];
        if (!fs_1.default.existsSync(`${path}/content`))
            return restored;
        (0, log_1.log)("Restoring content");
        const files = fs_1.default.readdirSync(`${path}/content`);
        for (const file of files) {
            const data = JSON.parse(fs_1.default.readFileSync(`${path}/content/${file}`).toString());
            (0, log_1.log)(`   Creating content ${data.content.contentId}`);
            try {
                const newContentTypeId = (_a = restoredContentTypes.find(p => p.oldId === data.content.contentTypeId)) === null || _a === void 0 ? void 0 : _a.newId;
                if (!newContentTypeId) {
                    (0, log_1.log)(`   Content Type not found ${data.content.contentTypeId}`);
                    continue;
                }
                let payloadCreate = {
                    "contentTypeId": newContentTypeId,
                    "contentId": data.content.contentId
                };
                let response = yield client.post("/content", payloadCreate);
                restored.push({ oldId: data.content.contentId, newId: response.data.contentId });
            }
            catch (ex) {
                console.log(ex);
                (0, log_1.log)(`      Failed to restore`);
            }
        }
        for (const file of files) {
            let json = fs_1.default.readFileSync(`${path}/content/${file}`).toString();
            let data = JSON.parse(json);
            const oldId = data.content.contentId;
            const newId = restored.find(p => p.oldId === oldId).newId;
            if (!newId) {
                (0, log_1.log)(`   Could not find new content id`);
                continue;
            }
            for (const r of restored) {
                var re = new RegExp(r.oldId, "g");
                json = json.replace(re, r.newId);
            }
            data = JSON.parse(json);
            (0, log_1.log)(`   Updating content data ${data.content.contentId}`);
            try {
                let payloadUpdate = {
                    status: data.content.status,
                    data: data.contentData
                };
                if (data.content.fodlerId) {
                    const newFolderId = (_b = restoredFolders.find(p => p.oldId === data.content.folderId)) === null || _b === void 0 ? void 0 : _b.newId;
                    if (newFolderId) {
                        payloadUpdate.folderId = newFolderId;
                    }
                }
                yield client.put(`/content/${newId}`, payloadUpdate);
            }
            catch (ex) {
                console.log(ex);
                (0, log_1.log)(`      Failed to restore`);
            }
        }
        return restored;
    });
}
//# sourceMappingURL=restore.js.map