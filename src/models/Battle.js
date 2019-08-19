import { Schema, model } from 'mongoose';

const resultsSchema = new Schema({

  _id: false,
  castle: String,
  name: String,
  code: String,
  gold: Number,
  stock: Number,
  result: String,
  ga: Boolean,
  difficulty: Number,
  score: Number,

  atkLeaders: [String],
  defLeaders: [String],

  atk: Number,
  masterReport: {
    atk: Number,
    def: Number,
    gold: Number,
    id: Schema.Types.ObjectId,
  },

});

const battle = {

  date: Date,
  reportDate: Date,

  results: [resultsSchema],
  text: String,

  reportLink: String,

  ts: Date,

};

const schema = new Schema(battle, { collection: 'Battle' });

export default model('Battle', schema);
