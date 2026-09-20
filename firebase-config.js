// ============================================================
//  Firebase Configuration — QPM Productivity
// ============================================================

var firebaseConfig = {
    apiKey: "AIzaSyC4CCzN1586RkyySe9jtCP-56hVI1JgdrM",
    authDomain: "qpm-productivity.firebaseapp.com",
    projectId: "qpm-productivity",
    storageBucket: "qpm-productivity.firebasestorage.app",
    messagingSenderId: "146209323051",
    appId: "1:146209323051:web:82946c3e78e983f29c526e"
};

// Cloudinary unsigned upload configuration for images embedded in Notes.
// This reuses the working QuickChat media account; create a dedicated
// FlowHub preset later if separate quotas or stricter rules are needed.
var cloudinaryConfig = {
    cloudName: "mihkz6nh",
    uploadPreset: "quickchat_preset",
    folder: "flowhub/notes"
};
