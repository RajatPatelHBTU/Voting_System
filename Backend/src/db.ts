import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

const MONOGDB_URL = process.env.MONOGDB_URL;

if(MONOGDB_URL === undefined){
    throw new Error("MONOGDB_URL is not defined");
}
 mongoose.connect(MONOGDB_URL).then(
    () => {
        console.log("Database connected");
    }).catch((e) => {
        console.log("Database not connected", e);
    }
 );

const VoterCounterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true }
});

const VoterCounter = mongoose.model('VoterCounter', VoterCounterSchema);
const PartyCounterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true }
});

const PartyCounter = mongoose.model('PartyCounter', PartyCounterSchema);


const VoterSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    idType: { type: String, required: true },
    documentNumber: { type: Number, required: true, unique: true },
    selfieUrl: { type: String, required: true },
    documentUrl: { type: String, required: true },
    mobile: { type: Number, required: true, unique: true  },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    voterId : {type: String , required : true},
    verified : {type : Boolean , default : false},
    voterIndex : {type : Number, unique: true},
    isBlocked : {type : Boolean , default : false}
});
VoterSchema.pre('save', async function (next) {
    if (!this.voterIndex) {
        try {
            const counter = await VoterCounter.findOneAndUpdate(
                { name: 'voterIndex' },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            );
            this.voterIndex = counter.value;
        } catch (error) {
            console.log(error);
            return 
        }
    }
    next();
});
const PartySchema = new mongoose.Schema({
    partyName: { type: String, required: true, unique: true },
    partyAbbreviation: { type: String, required: true, unique: true },
    dateOfBirth: { type: String, required: true },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    idType: { type: String, required: true },
    documentNumber: { type: Number, required: true, unique: true },
    symbolUrl: { type: String, required: true },
    documentUrl: { type: String , required: true},
    mobile: { type: Number, required: true, unique: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    voterId : {type: String , required : true},
    email: { type: String, unique: true, required: true },
    partyLeaderName: { type: String, required: true },
    manifesto: { type: String, required: true },
    partyConstitution: { type: String, required: true },
    partyIndex : {type : Number, unique : true},
    partyId : { type: Number, unique: true, sparse: true },
    verified : {type : Boolean , default : false},
    isBlocked : {type : Boolean , default : false},
    teamMembers : [{type : mongoose.Schema.Types.ObjectId, ref : "Partyteam"}]
})
PartySchema.pre('save', async function (next) {
    if (!this.partyIndex) {
        try {
            const counter = await PartyCounter.findOneAndUpdate(
                { name: 'partyIndex' },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            );
            this.partyIndex = counter.value;
        } catch (error) {
            console.log(error);
            return 
        }
    }
    next();
});

const PartyteamSchema = new mongoose.Schema({
    name : {type : String, required : true},
    role : {type : String, required : true},
    avatar : {type : String, required : true},
    party : {type : mongoose.Schema.Types.ObjectId, ref : "Party", required : true}
})

const BroadcastMessagesSchema = new mongoose.Schema({
    name : {type : String, required : true},
    party : {type : String, required : true},
    hash : {type : String, requried : true},
    time : {type : String, required : true}
})

const voterModel = mongoose.model("Voter",VoterSchema);
const partyModel = mongoose.model("Party",PartySchema);
const partyteamModel = mongoose.model("Partyteam",PartyteamSchema);
const broadcastMessages = mongoose.model("BroadcastMessages",BroadcastMessagesSchema);



export default {
    voterModel,
    partyModel,
    partyteamModel,
    broadcastMessages
}