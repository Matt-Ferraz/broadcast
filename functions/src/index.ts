import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";

initializeApp();

setGlobalOptions({ region: "southamerica-east1", maxInstances: 10 });

export const processScheduledMessages = onSchedule(
  { schedule: "every 1 minutes", region: "southamerica-east1" },
  async () => {
    const db = getFirestore();
    const now = Timestamp.now();

    const snapshot = await db
      .collection("messages")
      .where("status", "==", "scheduled")
      .where("scheduledAt", "<=", now)
      .get();

    if (snapshot.empty) {
      logger.info("Nenhuma mensagem para processar.");
      return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { status: "sent" });
    });

    await batch.commit();
    logger.info(`${snapshot.size} mensagem(ns) marcada(s) como enviada(s).`);
  }
);
//   response.send("Hello from Firebase!");
// });
