(() => {
    const defaultModel = 'gemini-3.6-flash';

    function settingsRef(db, uid) {
        return db.collection('users').doc(uid).collection('stock_private').doc('gemini');
    }

    window.FlowHubGemini = {
        defaultModel,
        listen(db, uid, onSettings, onError) {
            return settingsRef(db, uid).onSnapshot(doc => {
                const data = doc.data() || {};
                onSettings({ key: data.geminiApiKey || '', model: data.geminiModel || defaultModel });
            }, onError);
        },
        save(db, uid, { key, model }) {
            return settingsRef(db, uid).set({
                geminiApiKey: key,
                geminiModel: model,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
        },
        openSettings() {
            document.getElementById('btn-open-settings').click();
        }
    };
})();
