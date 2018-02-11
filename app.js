const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.urlencoded( {extended: false} ));

// run and connect to the database
require('./models/database');
const Contact = require('./models/contact');

app.get('/', (req, res) => {
	Contact.find({}, (err, results) => {
		if (err) {
			return res.render.status(500).send('<h1>Error</h1>');
		}
		return res.render('index', {results, Contact});
	});
});

app.get('/add', (req, res) => {
	res.render('add');
});

app.post('/add', (req, res) => {
	const newContact = new Contact({
		name: req.body.name,
		phone: req.body.phone,
		isCell: req.body.phonetype == "cell",
		skills: getSkillsArray(req)
	});
	newContact.save((err, results) => {
		if (err) {
			return res.status(500).send('<h1>save() error</h1>', err);
		}
		return res.redirect('/');
	});
});

app.get('/update', (req, res) => {
	const contact = JSON.parse(req.query.contactinfo);
	res.render('update', {contact});
});

app.post('/update', (req, res) => {
	const query = {_id: req.body._id};
	const value = {
		$set: {
			name: req.body.name,
			phone: req.body.phone,
			isCell: req.body.phonetype == "cell" ? true : false,
			skills: getSkillsArray(req)
		}
	};
	Contact.findOneAndUpdate(query, value, (err, results) => {
		if (err) {
			return res.status(500).send('<h1>Update Error</h1>');
		}
		return res.redirect('/');
	});
});

app.get('/remove', (req, res) => {
	Contact.remove({_id: req.query._id}, (err, results) => {
		if (err) {
			return res.status(500).send('<h1>Remove error</h1>');
		}
		return res.redirect('/');
	});
});

function getSkillsArray(req) {
	let skillsList = [];
	skillsList.push({java: req.body.skill_java == 'java' ? true : false});
	skillsList.push({cpp: req.body.skill_cpp == 'cpp' ? true : false});
	skillsList.push({csharp: req.body.skill_csharp == 'csharp' ? true : false});
	skillsList.push({nodejs: req.body.skill_nodejs == 'nodejs' ? true : false});
	return skillsList;
}

const port = process.env.PORT || 3000;
app.listen(port, ()=> {
	console.log('Server started at port', port);
});