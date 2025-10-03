export const round2 = (n) => Math.round(n * 100) / 100;

export function netForUserInTx(tx, userId) {
  // +amount if others owe me, -amount if I owe someone
  let net = 0;
  for (const tr of tx.transfers) {
    if (tr.toUserId === userId) net += tr.amount;
    if (tr.fromUserId === userId) net -= tr.amount;
  }
  return round2(net);
}

export function presentNames(ids, contactsById, meId, meName = "You") {
  return ids.map((id) => (id === meId ? meName : contactsById[id]?.name || id));
}
