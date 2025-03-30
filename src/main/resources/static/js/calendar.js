document.addEventListener('DOMContentLoaded', function() {
    // Глобальная переменная для хранения всех встреч
    let allAppointments = [];
    
    // Ключ для localStorage
    const STORAGE_KEY = 'calendarAppointments';
    
    // Функция для загрузки встреч из localStorage
    function loadAppointments() {
        /* 
         * При интеграции с Spring Boot:
         * - Заменить этот блок на AJAX запрос к соответствующему эндпоинту
         * - Например: GET /api/appointments
         * - Формат ответа должен быть массивом объектов appointments
         */
        
        // === НАЧАЛО БЛОКА LOCALSTORAGE (УДАЛИТЬ ПРИ ИНТЕГРАЦИИ) ===
        const savedAppointments = localStorage.getItem(STORAGE_KEY);
        if (savedAppointments) {
            allAppointments = JSON.parse(savedAppointments);
        } else {
            allAppointments = [];
        }
        // === КОНЕЦ БЛОКА LOCALSTORAGE ===
        
        // Загружаем встречи для текущей выбранной даты
        const selectedDateText = document.getElementById('selected-date').textContent;
        const dateObj = parseDateString(selectedDateText);
        loadAppointmentsForDate(dateObj);
        
        // Обновляем индикаторы событий в календаре
        updateEventIndicators();
    }
    
    // Функция для сохранения встреч в localStorage
    function saveAppointments() {
        /* 
         * При интеграции с Spring Boot:
         * - Заменить этот блок на AJAX запрос к соответствующему эндпоинту
         * - Например: POST /api/appointments с телом запроса { appointments: allAppointments }
         * - Обрабатывать успешное сохранение и ошибки
         */
        
        // === НАЧАЛО БЛОКА LOCALSTORAGE (УДАЛИТЬ ПРИ ИНТЕГРАЦИИ) ===
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allAppointments));
        // === КОНЕЦ БЛОКА LOCALSTORAGE ===
        
        // Обновляем индикаторы событий в календаре
        updateEventIndicators();
    }
    
    // Функция для преобразования строки даты в формат YYYY-MM-DD
    function formatDateToString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Функция для парсинга строки даты вида "17 марта 2025"
    function parseDateString(dateStr) {
        const monthNames = {
            'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3, 'мая': 4, 'июня': 5,
            'июля': 6, 'августа': 7, 'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11
        };
        
        const parts = dateStr.split(' ');
        const day = parseInt(parts[0]);
        const month = monthNames[parts[1]];
        const year = parseInt(parts[2]);
        
        return new Date(year, month, day);
    }
    
    // Функция для загрузки встреч на определенную дату
    function loadAppointmentsForDate(date) {
        const dateString = formatDateToString(date);
        
        // Фильтруем встречи для выбранной даты
        const appointmentsForDate = allAppointments.filter(app => app.date === dateString);
        
        // Сортируем встречи по времени
        appointmentsForDate.sort((a, b) => {
            if (a.time < b.time) return -1;
            if (a.time > b.time) return 1;
            return 0;
        });
        
        // Обновляем дату в заголовке списка встреч
        document.getElementById('appointments-date').textContent = document.getElementById('selected-date').textContent;
        
        // Отображаем встречи
        displayAppointments(appointmentsForDate);
    }
    
    // Функция для обновления индикаторов событий в календаре
    function updateEventIndicators() {
        // Сначала удаляем все существующие индикаторы
        document.querySelectorAll('.event-indicator').forEach(indicator => indicator.remove());
        
        // Получаем текущий месяц и год
        const currentMonthYear = document.getElementById('current-month').textContent.split(' ');
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                           'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        const month = monthNames.indexOf(currentMonthYear[0]);
        const year = parseInt(currentMonthYear[1]);
        
        // Для каждого дня проверяем наличие встреч
        document.querySelectorAll('.day:not(.empty)').forEach(dayElement => {
            const day = parseInt(dayElement.textContent);
            const dateString = formatDateToString(new Date(year, month, day));
            
            // Проверяем, есть ли встречи на эту дату
            const hasAppointments = allAppointments.some(app => app.date === dateString);
            
            if (hasAppointments) {
                // Создаем и добавляем индикатор
                const indicator = document.createElement('div');
                indicator.classList.add('event-indicator');
                dayElement.appendChild(indicator);
            }
        });
    }
    
    // Функция для отображения встреч
    function displayAppointments(appointments) {
        const appointmentsList = document.getElementById('appointments');
        appointmentsList.innerHTML = '';
        
        if (appointments.length === 0) {
            const noAppointmentsElement = document.createElement('div');
            noAppointmentsElement.classList.add('no-appointments');
            noAppointmentsElement.textContent = 'Нет запланированных встреч';
            appointmentsList.appendChild(noAppointmentsElement);
            return;
        }
        
        appointments.forEach(appointment => {
            const appointmentElement = document.createElement('div');
            appointmentElement.classList.add('appointment');
            appointmentElement.dataset.id = appointment.id;
            
            appointmentElement.innerHTML = `
                <div class="appointment-time">${appointment.time}</div>
                <div class="appointment-details">
                    <h5>${appointment.title}</h5>
                    <p>${appointment.notes}</p>
                </div>
                <div class="appointment-actions">
                    <button class="delete-button"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            
            // Добавляем обработчик для кнопки удаления
            const deleteButton = appointmentElement.querySelector('.delete-button');
            deleteButton.addEventListener('click', function() {
                deleteAppointment(appointment.id);
            });
            
            appointmentsList.appendChild(appointmentElement);
        });
    }
    
    // Функция для добавления новой встречи
    function addAppointment(time, title, notes) {
        // Получаем выбранную дату
        const selectedDateText = document.getElementById('selected-date').textContent;
        const dateObj = parseDateString(selectedDateText);
        const dateString = formatDateToString(dateObj);
        
        // Создаем новую встречу
        const newAppointment = {
            id: Date.now().toString(), // Используем timestamp как уникальный ID
            date: dateString,
            time: time,
            title: title,
            notes: notes
        };
        
        /* 
         * При интеграции с Spring Boot:
         * - Можно сначала отправить запрос на сервер для сохранения встречи
         * - Например: POST /api/appointments
         * - Тело запроса: newAppointment объект
         * - После успешного ответа добавлять встречу в локальный массив
         */
        
        // Добавляем встречу в массив
        allAppointments.push(newAppointment);
        
        // Сохраняем изменения
        saveAppointments();
        
        // Обновляем отображение
        loadAppointmentsForDate(dateObj);
    }
    
    // Функция для удаления встречи
    function deleteAppointment(id) {
        // Находим индекс встречи для удаления
        const index = allAppointments.findIndex(app => app.id === id);
        
        if (index !== -1) {
            /* 
             * При интеграции с Spring Boot:
             * - Сначала отправить запрос на удаление
             * - Например: DELETE /api/appointments/{id}
             * - После успешного ответа удалять из локального массива
             */
            
            // Удаляем встречу из массива
            allAppointments.splice(index, 1);
            
            // Сохраняем изменения
            saveAppointments();
            
            // Обновляем отображение
            const selectedDateText = document.getElementById('selected-date').textContent;
            const dateObj = parseDateString(selectedDateText);
            loadAppointmentsForDate(dateObj);
        }
    }
    
    // Функция для генерации дней календаря
    function generateCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Получаем день недели для первого дня месяца (0 - воскресенье, 1 - понедельник, и т.д.)
        let firstDayOfWeek = firstDay.getDay();
        // Корректируем, т.к. у нас неделя начинается с понедельника
        firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
        
        const calendarDays = document.getElementById('calendar-days');
        calendarDays.innerHTML = '';
        
        // Добавляем пустые ячейки для дней до начала месяца
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day', 'empty');
            calendarDays.appendChild(emptyDay);
        }
        
        // Добавляем дни месяца
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = i;
            
            // Проверяем, является ли это сегодняшним днем
            if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // Добавляем обработчик события для выбора дня
            dayElement.addEventListener('click', function() {
                // Удаляем класс 'selected' у всех дней
                document.querySelectorAll('.day').forEach(day => {
                    day.classList.remove('selected');
                });
                
                // Добавляем класс 'selected' выбранному дню
                this.classList.add('selected');
                
                // Обновляем отображаемую дату в планере и списке встреч
                const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                                   'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
                const dateText = `${i} ${monthNames[month]} ${year}`;
                document.getElementById('selected-date').textContent = dateText;
                document.getElementById('appointments-date').textContent = dateText;
                
                // Загружаем встречи на выбранную дату
                loadAppointmentsForDate(new Date(year, month, i));
            });
            
            calendarDays.appendChild(dayElement);
        }
        
        // Обновляем отображение текущего месяца
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                           'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        document.getElementById('current-month').textContent = `${monthNames[month]} ${year}`;
        
        // Обновляем индикаторы событий после генерации календаря
        updateEventIndicators();
    }
    
    // Инициализация начального состояния
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();
    
    // Инициализация с сегодняшней датой
    const initToday = () => {
        const today = new Date();
        const day = today.getDate();
        const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
                           'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        const month = today.getMonth();
        const year = today.getFullYear();
        
        // Установка текущей даты в формате "день месяц год"
        const dateText = `${day} ${monthNames[month]} ${year}`;
        document.getElementById('selected-date').textContent = dateText;
        document.getElementById('appointments-date').textContent = dateText;
        
        // Выделяем сегодняшний день после генерации календаря
        setTimeout(() => {
            const todayElement = document.querySelector('.day.today');
            if (todayElement) {
                todayElement.classList.add('selected');
            }
        }, 100);
    };
    
    // Генерируем календарь для текущего месяца
    generateCalendar(currentYear, currentMonth);
    
    // Инициализируем текущую дату
    initToday();
    
    // Загружаем встречи из localStorage
    loadAppointments();
    
    // Обработчики событий для кнопок навигации по месяцам
    document.getElementById('prev-month').addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentYear, currentMonth);
        updateEventIndicators();
    });
    
    document.getElementById('next-month').addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentYear, currentMonth);
        updateEventIndicators();
    });
    
    // Обработчик отправки формы добавления встречи
    document.getElementById('appointment-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const time = document.getElementById('appointment-time').value;
        const title = document.getElementById('appointment-title').value;
        const notes = document.getElementById('appointment-notes').value;
        
        // Добавляем новую встречу
        addAppointment(time, title, notes);
        
        // Очищаем форму
        this.reset();
    });
    
    // Обработчик для выбора языка
    document.getElementById('language-select').addEventListener('change', function() {
        var selectedLanguage = this.value;
        console.log('Выбран язык: ' + selectedLanguage);
        // При интеграции со Spring Boot:
        // window.location.href = '/change-language?lang=' + selectedLanguage;
    });

    // Добавьте в конец вашего файла calendar.js
    window.addEventListener('resize', function() {
        // Небольшая задержка для стабильности
        setTimeout(() => {
            // Получаем выбранную дату
            const selectedDateText = document.getElementById('selected-date').textContent;
            const dateObj = parseDateString(selectedDateText);
            
            // Перезагружаем встречи для текущей даты
            loadAppointmentsForDate(dateObj);
        }, 200);
    });
});