
export default {
  name: 'Javascript',
  activities: [
    { order: 1, name: 'Introduction' },
    { order: 2, name: 'Values, Types, and Operators' },
    { order: 3, name: 'Program Structure' },
    {
      order: 4,
      name: 'Functions',
      activities: [
        { order: 1, name: 'Defining a function' },
        { order: 2, name: 'Parameters and scopes' },
        { order: 3, name: 'Nested scope' }
      ]
    },
    {
      order: 5,
      name: 'Data Structures: Objects and Arrays',
      activities: [
        { order: 1, name: 'Data sets' },
        { order: 2, name: 'Properties' },
        { order: 3, name: 'Methods' }
      ]
    },
    { order: 6, name: 'Higher-Order Functions' },
    { order: 7, name: 'The Secret Life of Objects' },
    { order: 8, name: 'Bugs and Error Handling' }
  ]
};
