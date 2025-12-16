const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Send a partnership invitation to another user.
 * Expects: { email: string }
 */
exports.sendPartnerInvite = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required.');
    const senderUid = context.auth.uid;
    const targetEmail = data?.email;

    if (!targetEmail || typeof targetEmail !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'Valid email required.');
    }

    // Find user by email
    let targetRecord;
    try {
        targetRecord = await admin.auth().getUserByEmail(targetEmail);
    } catch (e) {
        if (e.code === 'auth/user-not-found') {
            throw new functions.https.HttpsError('not-found', 'User not found with that email.');
        }
        throw e;
    }

    const targetUid = targetRecord.uid;
    if (senderUid === targetUid) {
        throw new functions.https.HttpsError('invalid-argument', 'Cannot invite yourself.');
    }

    // Check if invite already exists
    const existingInvite = await admin.firestore().collection('invites')
        .where('from', '==', senderUid)
        .where('to', '==', targetUid)
        .where('status', '==', 'pending')
        .get();

    if (!existingInvite.empty) {
        throw new functions.https.HttpsError('already-exists', 'Invite already pending.');
    }

    // Create invite
    const inviteRef = admin.firestore().collection('invites').doc();
    await inviteRef.set({
        from: senderUid,
        to: targetUid,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        senderEmail: context.auth.token.email || 'Unknown User'
    });

    return { ok: true, inviteId: inviteRef.id, message: `Invite sent to ${targetEmail}` };
});

/**
 * Respond to a partnership invite.
 * Expects: { inviteId: string, accept: boolean }
 */
exports.respondToInvite = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required.');
    const uid = context.auth.uid;
    const { inviteId, accept } = data;

    if (!inviteId) throw new functions.https.HttpsError('invalid-argument', 'Invite ID required.');

    const inviteRef = admin.firestore().collection('invites').doc(inviteId);

    return admin.firestore().runTransaction(async (t) => {
        const doc = await t.get(inviteRef);
        if (!doc.exists) throw new functions.https.HttpsError('not-found', 'Invite not found.');

        const invite = doc.data();
        if (invite.to !== uid) throw new functions.https.HttpsError('permission-denied', 'Not your invite.');
        if (invite.status !== 'pending') throw new functions.https.HttpsError('failed-precondition', 'Invite already processed.');

        const newStatus = accept ? 'accepted' : 'rejected';
        t.update(inviteRef, { status: newStatus, respondedAt: admin.firestore.FieldValue.serverTimestamp() });

        if (accept) {
            // Create mutual partnership records
            const partnerRef1 = admin.firestore().doc(`users/${invite.from}/partners/${invite.to}`);
            const partnerRef2 = admin.firestore().doc(`users/${invite.to}/partners/${invite.from}`);

            t.set(partnerRef1, {
                uid: invite.to,
                since: admin.firestore.FieldValue.serverTimestamp(),
                role: 'partner'
            });
            t.set(partnerRef2, {
                uid: invite.from,
                since: admin.firestore.FieldValue.serverTimestamp(),
                role: 'partner'
            });
        }

        return { ok: true, status: newStatus };
    });
});
