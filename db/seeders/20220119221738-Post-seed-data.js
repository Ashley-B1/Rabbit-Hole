'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Posts', [
      { userId: 2, title: 'Hello World', content: 'Hello world, my name is Thomas. What is new?', createdAt: new Date(), updatedAt: new Date()},
      { userId: 2, title: 'Identity and Bugs', content: 'Some people think I am a fruit, some people think I am a vegetable. Few know the truth. When you are a plant, you tend to attract a lot of bugs.', createdAt: new Date(), updatedAt: new Date()},
      { userId: 3, title: 'Environment Setup Difficulties', content: 'I tend to have hardware issues because I live underwater.', createdAt: new Date(), updatedAt: new Date()},
      { userId: 4, title: 'Accessibility and "User Experience"', content: 'I have trouble typing because I do not have a physical body. Good thing I can pair program with someone and use my otherworldly navigation skills!', createdAt: new Date(), updatedAt: new Date()},
  ], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Posts', null, {})
};
