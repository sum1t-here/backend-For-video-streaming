/**
  id string pk
  subscriber ObjectId users
  channel ObjectId users
  createdAt Date
  updated Date
 */

import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
  // one WHO is SUBSCRIBING
  subscriber: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // one to WHOM "subscriber" is SUBSCRIBING
  channel: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
