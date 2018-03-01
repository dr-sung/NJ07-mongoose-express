const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name: String,
    phone: Number,
    isCell: Boolean,
    skills: Array   //[{java: true}, {cpp: false}, ...]
});

contactSchema.statics.getSkillsList = function(skills) {
    let list = [];
    for (const skill of skills) {
        const key = Object.keys(skill);
        if (skill[key]) {
            list.push(key);
        }
    }
    return list;
}

// a collection named 'contacts' is created
// 'contacts' collection uses contactSchema to store documents (data)
module.exports = mongoose.model('Contacts', contactSchema);