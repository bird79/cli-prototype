#!/usr/bin/env node
var commander = require('commander');
var inquirer = require('inquirer');
var writeFile = require('write');

var questionsPerson = [{
    name: 'firstName',
    message: 'What is your first name?'
  }, {
    name: 'operatingSystem',
    message: 'What is your operating System?',
    default: 'MacOS'
  }, {
    name: 'favoriteColor',
    message: 'What is your favorite rainbow Color?',
    type: 'list',
    choices: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet'],
    filter: function (str){
      return str.toLowerCase();
    }
  }
];
var questionsFood = [{
  name: 'pizzaOrTaco',
  message: 'You want to eat pizza or taco?',
  type: 'list',
  choices: ['Pizza', 'Taco']
}, {
  type: 'rawlist',
  name: 'size',
  message: 'What size do you need',
  choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
  when: function(answers){
    return answers.pizzaOrTaco === 'Pizza';
  },
  filter: function(val) {
    return val.toLowerCase();
  }
}, {
  name: 'pizzaIngredients',
  message: 'OK, so what goes on your pizza?',
  type: 'checkbox',
  choices: ['peperonni', 'extra cheese', 'sausage', 'mushroom', 'sugar cubes'],
  when: function(answers){
    return answers.pizzaOrTaco === 'Pizza';
  }
}, {
  name: 'tacoIngredients',
  message: 'Pick out the things that go in your taco.',
  type: 'checkbox',
  choices: ['chicken', 'rice', 'beef', 'pico', 'hawt sauce', 'zazzle'],
  when: function(answers){
    return answers.pizzaOrTaco === 'Taco';
  }
}, {
  name: 'orderCount',
  message: 'Before order count',
  type: 'expand',
  choices: [{
    key: 'o',
    name: 'One',
    value: 'one'
  }, {
    key: 'w',
    name: 'Two',
    value: 'two'
  }, {
    key: 'r',
    name: 'Three',
    value: 'three'
  }, new inquirer.Separator(), {
    key: 't',
    name: 'Ten Over',
    value: 'tenOver'
  }]
}, {
  name: 'delivery',
  message: 'Is this for delivery?',
  type: 'confirm'
}];

commander.arguments('<question>')
  .version('1.0.0')
  .option('-f, --filename <filnename>', 'Write filename')
  .action(function(question) {
  if(question == 'person') {
    questions = questionsPerson;
  } else if (question == 'food') {
    questions = questionsFood;
  }
}).parse(process.argv);

if (typeof questions === 'undefined') {
  console.error('arguments is either person or food');
  // throw new Error('require type');
  process.exit(1);
}

inquirer.prompt(questions).then(answers => {
  console.log(answers);
  if(commander.filename) {
    writeFile(commander.filename, JSON.stringify(answers, null, '  '))
    .then(function() {
      console.log(commander.filename + ' writed.');
    });
  }
});