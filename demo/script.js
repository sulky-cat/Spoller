import Spoller from '../src/Spoller.js'

const spollerElements = Array.from(document.querySelectorAll('[data-spoller]'))
const spollers = spollerElements.map(spoller => new Spoller(spoller))


new Spoller(document.querySelector('[data-spoller-func]'), {
   beforeSelect: () => alert('Сработала функция beforeSelect()'),
   afterSelect: () => alert('Сработала функция afterSelect()'),
})