export const VFS = {
    db: null,
    async init() {
        return new Promise((res) => {
            const request = indexedDB.open("PampOS_DB", 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                const store = db.createObjectStore("files", { keyPath: "path" });
                // Création de l'arborescence UNIX de base
                store.add({ path: "/", type: "dir", content: ["bin", "Users", "etc"] });
                store.add({ path: "/Users", type: "dir", content: ["admin"] });
                store.add({ path: "/Users/admin", type: "dir", content: ["Desktop", "Documents"] });
            };
            request.onsuccess = (e) => {
                this.db = e.target.result;
                res();
            };
        });
    },
    async ls(path) {
        const tx = this.db.transaction("files", "readonly");
        const store = tx.objectStore("files");
        const entry = await store.get(path);
        return entry ? entry.content : [];
    }
};
