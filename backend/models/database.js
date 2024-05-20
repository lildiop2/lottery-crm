import "dotenv/config";
import mongoose from "mongoose";
const { Schema, SchemaTypes, model } = mongoose;
mongoose
  .connect(
    `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`
  )
  .then(() => console.log("connected!"))
  .catch((error) => console.log({ error }));

const User = model(
  "User",
  new Schema(
    {
      firstname: {
        type: String,
        required: true,
      },
      lastname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        minLength: 10,
        required: true,
        lowercase: true,
        unique: true,
      },
      password: {
        type: String,
        minLength: 5,
        required: true,
      },
      roles: { type: Array, default: ["ROLE_DEFAULT"] },
    },
    { timestamps: true }
  )
);

const Ticket = model(
  "Ticket",
  new Schema(
    {
      owner: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: true,
      },
      games: [
        {
          type: SchemaTypes.ObjectId,
          ref: "Game",
          required: true,
        },
      ],
      total_price: {
        type: Number,
      },
      createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
      },
      updatedAt: Date,
    },
    { timestamps: true }
  )
);

const Game = model(
  "Game",
  new Schema(
    {
      type: {
        type: String,
        required: true,
      },
      number: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        default: 0,
      },
      createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
      },
      updatedAt: Date,
    },
    { timestamps: true }
  )
);

export { User, Ticket, Game };
