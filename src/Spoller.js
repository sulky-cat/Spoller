import Slide from './Slide.js'

export default class Spoller {
   static defaultOptions = {
      activeClass: 'spoller-active',

      one: false,
      await: false,

      afterSelect: () => { },
      beforeSelect: () => { },
   }
   /**
    * Конструктор нового Экземпляра класса.
    * @param {HTMLElement} element Обертка, внутри которой находятся спойлеры.
    * @param {object}      options Объект с опциями.
    */
   constructor(element, options) {
      try {
         this.spoller = element
         this.titles = Array.from(this.spoller.querySelectorAll('[data-spoller-title]'))
         this.bodies = Array.from(this.spoller.querySelectorAll('[data-spoller-body]'))

         this.options = Object.assign(Spoller.defaultOptions, options)

         this.one = this.spoller.hasAttribute('data-spoller-one') || this.options.one
         this.await = this.spoller.hasAttribute('data-spoller-await') || this.options.await
         this.media = this.spoller.dataset.spollerMedia
      } catch {
         throw new Error('Проверьте правильность ввода данных.')
      }

      // Обработка ошибок
      if (this.titles.length !== this.bodies.length)
         throw new Error('Количество spoller-title должно совпадать с spoller-body')
      if (this.titles.length === 0 || this.bodies.length === 0)
         throw new Error('Не указаны spoller-title или spoller-body')

      this.onClick = this.onClick.bind(this)

      if (this.media)
         this.#mediaQueries()
      else
         this.init()
   }
   /**
    * Инициализация: установка аттрибутов, установка обработчика события. 
    */
   init() {
      this.titles.forEach((title, id) => {
         title.dataset.spollerTitle = id
         title.setAttribute('aria-selected', this.isActive(id))
         if (this.isActive(id))
            this.id = id
         if (title.tagName !== 'BUTTON' || !title.hasAttribute('tabindex'))
            title.setAttribute('tabindex', 0)
      })

      this.bodies.forEach((body, id) => {
         body.dataset.spollerBody = id
         if (this.id !== id)
            Slide.close(body, 0)
      })

      this.spoller.addEventListener('click', this.onClick)
   }
   /**
    * Удаление атрибутов и обработчика события.
    */
   destroy() {
      this.titles.forEach(title => {
         title.dataset.spollerTitle = ''
         title.removeAttribute('aria-selected')
         title.removeAttribute('tabindex')
      })

      this.bodies.forEach(body => {
         body.dataset.spollerBody = ''
         if (body.style.display === 'none')
            body.style.display = ''
         body.removeAttribute('aria-hidden')
      })

      this.spoller.removeEventListener('click', this.onClick)
   }
   /**
    * Открытие спойлера по указанному id.
    * @param   {(number|string)} id Номер спойлера, который будет открыт.
    * @returns {Promise}
    */
   open(id) {
      if (this.#stopOpen(id))
         return

      this.id = id

      this.titles[this.id].classList.add(this.options.activeClass)
      this.titles[this.id].setAttribute('aria-selected', true)

      return Promise.resolve(Slide.open(this.bodies[id], this.#getDuration(id)))
   }
   #stopOpen(id) {
      return this.one && this.bodies.find(body => body.classList.contains('_slide-open')) ||
         this.bodies[id].classList.contains('_slide')
   }
   /**
    * Закрытие спойлера по указанному id.
    * @param   {(number|string)} id Номер спойлера, который будет закрыт.
    * @returns {Promise}
    */
   close(id) {
      if (this.bodies[id].classList.contains('_slide'))
         return

      this.titles[id].classList.remove(this.options.activeClass)
      this.titles[id].setAttribute('aria-selected', false)

      return Promise.resolve(Slide.close(this.bodies[id], this.#getDuration(id)))
   }
   /**
    * Закрытие спойлеров.
    * @returns {Promise}
    */
   closeAll() {
      const activeTitlesArray = this.titles
         .filter((title, i) => this.isActive(i))

      return Promise.all(
         activeTitlesArray
            .map(async title => await this.close(title.dataset.spollerTitle))
      )
   }
   /**
    * Полная логика открытия/закрытия спойлеров в зависимости от указанных настроек.
    * @param {(number|string)} id Номер спойлера, который будет открыт. Если он открыт - закроется.
    * @returns 
    */
   async select(id) {
      this.id = id

      if (this.isActive(this.id))
         return Promise.resolve(this.close(this.id))

      if (this.one) {
         if (this.await) await this.closeAll()
         else this.closeAll()

         return Promise.resolve(this.open(this.id))
      }

      return Promise.resolve(this.open(this.id))
   }
   async onClick(e) {
      const title = e.target.closest('[data-spoller-title]')
      if (!title)
         return

      this.options.beforeSelect()
      await this.select(title.dataset.spollerTitle)
      this.options.afterSelect()
   }
   /**
    * Проверяет, активный ли элемент по id.
    * @param   {(number|string)} id Номер элемента, который нужно проверить.
    * @returns {boolean}
    */
   isActive(id) {
      return this.titles[id].classList.contains(this.options.activeClass)
   }
   #getDuration(id) {
      return this.bodies[id].dataset.duration || undefined
   }
   #mediaQueries() {
      const [type, size] = this.media.replace(/ /g, '').split(',')
      const mql = window.matchMedia(`(${type}-width: ${size})`)

      this.#disruptionByMedia(mql)
      mql.addEventListener('change', this.#disruptionByMedia.bind(this));
   }
   #disruptionByMedia(e) {
      if (e.matches)
         this.destroy()
      else
         this.init()
   }
}
