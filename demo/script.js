import Spoller from '../src/Spoller.js'

const spollerElements = Array.from(document.querySelectorAll('[data-spoller]'))
if (spollerElements) {
   const spollers = spollerElements.map(spoller => new Spoller(spoller, {
      // one: true, await: true,
      // beforeOpen: () => {
      //    console.log('beforeOpen');
      // },
      // afterOpen: () => {
      //    console.log('afterOpen');
      // },
   }))
}

const funcSpoller = document.querySelector('[data-spoller-func]')
const spoller = new Spoller(funcSpoller, {
   beforeSelect: () => alert('Сработала функция beforeOpen()'),
   afterSelect: () => alert('Сработала функция afterOpen()'),
})

console.log(spoller);