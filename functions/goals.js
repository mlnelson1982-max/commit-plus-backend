const functions = require('firebase-functions');
const admin = require('firebase-admin');

/**
 * Create a new Goal (e.g., "Gym 3x a week").
 * Expects: { title: string, frequencyPerWeek: number, penaltyAmount: number, partners: string[] }
 */
exports.createGoal = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required.');
    const uid = context.auth.uid;
    const { title, frequencyPerWeek, penaltyAmount, partners } = data;

    if (!title || !frequencyPerWeek) {
        throw new functions.https.HttpsError('invalid-argument', 'Title and frequency required.');
    }

    // Validate partners (optional: check if they are actually partners)
    const assignedPartners = Array.isArray(partners) ? partners : [];

    const goalRef = admin.firestore().collection(`users/${uid}/goals`).doc();
    await goalRef.set({
        title,
        frequencyPerWeek,
        penaltyAmount: penaltyAmount || 0,
        assignedPartners, // UIDs of partners who can verify
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        active: true,
        currentStreak: 0
    });

    return { ok: true, goalId: goalRef.id };
});

/**
 * Submit proof for a goal.
 * Expects: { goalId: string, mediaUrl: string, notes: string }
 */
exports.submitProof = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required.');
    const uid = context.auth.uid;
    const { goalId, mediaUrl, notes } = data;

    if (!goalId || !mediaUrl) {
        throw new functions.https.HttpsError('invalid-argument', 'Goal ID and Media URL required.');
    }

    // Check if goal exists
    const goalRef = admin.firestore().doc(`users/${uid}/goals/${goalId}`);
    const goalSnap = await goalRef.get();
    if (!goalSnap.exists) {
        throw new functions.https.HttpsError('not-found', 'Goal not found.');
    }
    const goal = goalSnap.data();

    const proofRef = admin.firestore().collection('proofs').doc();
    await proofRef.set({
        uid,
        goalId,
        goalTitle: goal.title,
        mediaUrl,
        notes: notes || '',
        status: 'pending', // pending, approved, rejected
        approvals: [],
        assignedPartners: goal.assignedPartners,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { ok: true, proofId: proofRef.id };
});

/**
 * Verify (Approve/Reject) a proof.
 * Expects: { proofId: string, approved: boolean, comment: string }
 */
exports.verifyProof = functions.https.onCall(async (data, context) => {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required.');
    const verifierUid = context.auth.uid;
    const { proofId, approved, comment } = data;

    if (!proofId) throw new functions.https.HttpsError('invalid-argument', 'Proof ID required.');

    const proofRef = admin.firestore().collection('proofs').doc(proofId);

    return admin.firestore().runTransaction(async (t) => {
        const doc = await t.get(proofRef);
        if (!doc.exists) throw new functions.https.HttpsError('not-found', 'Proof not found.');

        const proof = doc.data();

        // Check permission
        if (!proof.assignedPartners.includes(verifierUid)) {
            throw new functions.https.HttpsError('permission-denied', 'You are not an assigned partner for this goal.');
        }

        // Check if already voted
        const existingVote = proof.approvals.find(v => v.uid === verifierUid);
        if (existingVote) {
            throw new functions.https.HttpsError('failed-precondition', 'You have already verified this proof.');
        }

        const vote = {
            uid: verifierUid,
            approved: !!approved,
            comment: comment || '',
            at: new Date().toISOString() // using ISO string for array storage
        };

        const newApprovals = [...proof.approvals, vote];

        // Decision Logic: simple logic - if any partner approves, it's approved? 
        // Or valid if > 50%? For MVP let's say 1 approval is enough to mark 'approved'
        // or 1 rejection marks 'rejected'.
        // Let's go with: if accepted, status = approved. If rejected, status = rejected.
        // Last vote wins for simplicity in MVP, or purely additive.

        let newStatus = proof.status;
        if (approved) newStatus = 'approved';
        else newStatus = 'rejected';

        t.update(proofRef, {
            approvals: newApprovals,
            status: newStatus,
            lastVerifiedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // If approved, verify if we should increment streak on goal
        // (This logic would be more complex in real app - preventing double counting etc)
        if (newStatus === 'approved' && proof.status !== 'approved') {
            // Only increment if it wasn't already approved
            const goalRef = admin.firestore().doc(`users/${proof.uid}/goals/${proof.goalId}`);
            t.update(goalRef, {
                currentStreak: admin.firestore.FieldValue.increment(1)
            });
        }

        return { ok: true, status: newStatus };
    });
});
