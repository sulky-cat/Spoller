import Spoller from '../src/Spoller.js'

const spollerElements = Array.from(document.querySelectorAll('[data-spoller]'))
const spollers = spollerElements.map(spoller => new Spoller(spoller))


new Spoller(document.querySelector('[data-spoller-func]'), {
   beforeSelect: () => console.log('Сработала функция beforeSelect()'),
   afterSelect: () => console.log('Сработала функция afterSelect()'),
})