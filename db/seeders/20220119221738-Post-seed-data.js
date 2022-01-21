'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Posts', [
      {
        userId: 2,
        title: 'Hello World',
        content: 'Hello world, my name is Thomas. What is new?',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        title: 'Identity and Bugs',
        content: 'Some people think I am a fruit, some people think I am a vegetable. Few know the truth. When you are a plant, you tend to attract a lot of bugs.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        title: 'Environment Setup Difficulties',
        content: 'I tend to have hardware issues because I live underwater.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 4,
        title: 'Accessibility and "User Experience"',
        content: 'I have trouble typing because I do not have a physical body. Good thing I can pair program with someone and use my otherworldly navigation skills!',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        title: 'How To Become A Full Stack Engineer',
        content: 'The first thing you need to do is download VSCode and type a simple algorithm. Test your algorithm and see all of the error messages populate. Once all errors are generated, bang your head on the keyboard until you draw blood. VSCode requires a blood sacrifice in order for your code to work. If you do not want to go through the traditional route you can simply come here and ask your peers questions and watch YouTube videos.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        title: 'How Javascript Traumatized Me',
        content: 'I thought I was a great coder until I came across Javascript. It\'s hard to use computer logic when I barely use common sense logic in real life. The binary code behind the computer is more complex than my one-dimensional brain can handle. I never thought I could be defeated by 1\'s and 0\'s but I guess it\'s a nice life lesson to humble myself.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Posts', null, {})
};
