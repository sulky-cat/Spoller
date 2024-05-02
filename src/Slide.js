import Timer from "./Timer.js";
export default class Slide {
   static #duration = 300
   /**
    * Закрытие элемента с дальнейшим присваиванием свойства display со значением none.
    * @param   {HTMLElement} target    Элемент.
    * @param   {number} duration       Время выполнения.
    * @returns {(false|Promise)}     false - если анимация запрещена в данный момент; Promise - после удачного выполнения.
    */
   static async close(target, duration = Slide.#duration) {
      if (target.classList.contains('_slide'))
         return

      target.classList.add('_slide', '_slide-close')
      target.style.transitionProperty = 'height, margin, padding'
      target.style.transitionDuration = `${duration}ms`
      target.style.height = `${target.offsetHeight}px`
      target.offsetHeight
      target.style.overflow = 'hidden'
      target.style.height = '0px'
      target.style.paddingTop = 0
      target.style.paddingBottom = 0
      target.style.marginTop = 0
      target.style.marginBottom = 0

      await Timer.start(() => { }, duration)

      target.style.display = 'none'
      target.setAttribute('aria-hidden', true)
      target.style.removeProperty('height')
      target.style.removeProperty('padding-top')
      target.style.removeProperty('padding-bottom')
      target.style.removeProperty('margin-top')
      target.style.removeProperty('margin-bottom')
      target.style.removeProperty('overflow')
      target.style.removeProperty('transition-duration')
      target.style.removeProperty('transition-property')
      target.classList.remove('_slide', '_slide-close')
      return target

   }
   /**
    * Открытие элемента.
    * @param   {HTMLElement} target   Элемент.
    * @param   {number} duration      Время выполнения.
    * @returns {(false|Promise)}    false - если анимация запрещена в данный момент; Promise - после удачного выполнения.
    */
   static async open(target, duration = Slide.#duration) {
      if (target.classList.contains('_slide'))
         return

      target.classList.add('_slide', '_slide-open')
      target.style.removeProperty('display')
      target.setAttribute('aria-hidden', false)
      const height = target.offsetHeight
      target.style.overflow = 'hidden'
      target.style.height = '0px'
      target.style.paddingTop = 0
      target.style.paddingBottom = 0
      target.style.marginTop = 0
      target.style.marginBottom = 0
      target.offsetHeight
      target.style.transitionProperty = 'height, margin, padding'
      target.style.transitionDuration = `${duration}ms`
      target.style.height = `${height}px`
      target.style.removeProperty('padding-top')
      target.style.removeProperty('padding-bottom')
      target.style.removeProperty('margin-top')
      target.style.removeProperty('margin-bottom')

      await Timer.start(() => { }, duration)

      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide', '_slide-open');
      return target
   }
   /**
    * Открытие|закрытие элемента.
    * @param   {HTMLElement} target   Элемент.
    * @param   {number} duration      Время выполнения.
    * @returns {(false|Promise)}    false - если анимация запрещена в данный момент; Promise - после удачного выполнения.
    */
   static toggle(target, duration = Slide.#duration) {
      return (JSON.parse(target.getAttribute('aria-hidden'))) ?
         this.open(target, duration) :
         this.close(target, duration)
   }
}


