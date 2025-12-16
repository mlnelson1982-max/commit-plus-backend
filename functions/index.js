const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenAI } = require('@google/genai');

admin.initializeApp();

function requireAuth(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Login required.');
  }
  return context.auth.uid;
}

function todayId(timezone = 'America/Detroit') {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Generate daily plan using Gemini AI
 * Returns: { ok: true, date, result: { today_plan, nudges } }
 */
exports.generateDailyPlan = functions.https.onCall(async (data, context) => {
  const uid = requireAuth(context);

  const userRef = admin.firestore().doc(`users/${uid}`);
  const profileRef = admin.firestore().doc(`users/${uid}/profile/main`);
  const [userSnap, profileSnap] = await Promise.all([userRef.get(), profileRef.get()]);

  if (!userSnap.exists) {
    throw new functions.https.HttpsError('failed-precondition', 'User doc missing.');
  }
  if (!profileSnap.exists) {
    throw new functions.https.HttpsError('failed-precondition', 'Profile doc missing.');
  }

  const user = userSnap.data();
  const profile = profileSnap.data();
  const tz = user.timezone || 'America/Detroit';
  const date = data?.date || todayId(tz);

  const ai = new GoogleGenAI({ apiKey: functions.config().gemini.key });

  const systemInstruction = `You are Commit+ Coach AI. Return ONLY valid JSON. No markdown. No commentary.`;

  const prompt = {
    user: {
      timezone: tz,
      coachMode: user.coachMode || 'coach',
    },
    profile: {
      goalLbsToLose: profile.goalLbsToLose,
      timelineWeeks: profile.timelineWeeks,
      dietStyle: profile.dietStyle,
      fastingPlan: profile.fastingPlan,
      baselineSteps: profile.baselineSteps,
      schedule: profile.schedule,
    },
    task: {
      date,
      ask: "Create today's plan and 3 nudges timed for the user's day.",
    },
  };

  const schema = {
    type: 'object',
    properties: {
      today_plan: {
        type: 'object',
        properties: {
          fasting_window: { type: 'string' },
          hydration_goal_oz: { type: 'integer' },
          steps_target: { type: 'integer' },
          workout: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              duration_minutes: { type: 'integer' },
              notes: { type: 'string' },
            },
            required: ['type', 'duration_minutes', 'notes'],
          },
          meals: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                time: { type: 'string' },
                meal: { type: 'string' },
                ingredients: { type: 'array', items: { type: 'string' } },
              },
              required: ['time', 'meal', 'ingredients'],
            },
          },
        },
        required: ['fasting_window', 'hydration_goal_oz', 'steps_target', 'workout', 'meals'],
      },
      nudges: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            time_local: { type: 'string' },
            message: { type: 'string' },
            tone: { type: 'string', enum: ['coach', 'drill', 'friend'] },
          },
          required: ['time_local', 'message', 'tone'],
        },
      },
    },
    required: ['today_plan', 'nudges'],
  };

  const resp = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: [{ role: 'user', parts: [{ text: JSON.stringify(prompt) }] }],
    config: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: schema,
    },
  });

  let json;
  try {
    json = JSON.parse(resp.text);
  } catch (e) {
    throw new functions.https.HttpsError('internal', 'AI returned invalid JSON.');
  }

  const planRef = admin.firestore().doc(`users/${uid}/dailyPlans/${date}`);
  await planRef.set(
    {
      date,
      todayPlan: json.today_plan,
      nudges: json.nudges,
      generatedBy: 'gemini',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  await userRef.set(
    { lastActiveAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );

  return { ok: true, date, dailyPlanPath: planRef.path, result: json };
});

/**
 * Log a workout
 */
exports.logWorkout = functions.https.onCall(async (data, context) => {
  const uid = requireAuth(context);
  const workout = data?.workout;

  if (!workout || typeof workout !== 'object') {
    throw new functions.https.HttpsError('invalid-argument', 'Missing workout object.');
  }

  const workoutRef = admin.firestore().collection(`users/${uid}/workouts`).doc();
  await workoutRef.set({
    ...workout,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  await admin.firestore().doc(`users/${uid}`).set(
    { lastActiveAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );

  return { ok: true, workoutId: workoutRef.id };
});

/**
 * Create a social post
 */
exports.createPost = functions.https.onCall(async (data, context) => {
  const uid = requireAuth(context);
  const text = String(data?.text || '').trim();
  const visibility = data?.visibility || 'public';

  if (!text || text.length > 500) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Post text required (max 500 chars).'
    );
  }

  const postRef = admin.firestore().collection('posts').doc();
  await postRef.set({
    uid,
    text,
    mediaUrl: data?.mediaUrl || '',
    metrics: data?.metrics || {},
    visibility,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { ok: true, postId: postRef.id };
});

/**
 * User onDelete trigger - cleanup
 */
exports.onUserDelete = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;
  await admin.firestore().doc(`users/${uid}`).delete();
  console.log(`Deleted user data for ${uid}`);
});

module.exports = { generateDailyPlan: exports.generateDailyPlan, logWorkout: exports.logWorkout, createPost: exports.createPost, onUserDelete: exports.onUserDelete };
