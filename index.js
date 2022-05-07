document.addEventListener('DOMContentLoaded', () => {
    Initialize();
});

const Initialize = async () => {
    console.log('ready!');

    const fetchCourses = async () => {
        return new Promise(async (resolve, reject) => {
            const res = await fetch('wilma.json');
            const data = await res.json();

            return resolve(data);
        });
    }

    const getSelectedCourses = () => {
        let courses = localStorage.getItem('selected-courses');

        if (courses == null) {
            localStorage.setItem('selected-courses', JSON.stringify([]));
            return [];
        }

        return JSON.parse(courses);
    }

    const setSelectedCourse = (course = String) => {
        let courses = getSelectedCourses();

        courses.push(course.toString());
        localStorage.setItem('selected-courses', JSON.stringify(courses));

        return courses;
    }

    const removeSelectedCourse = (course = String) => {
        let courses = getSelectedCourses();

        courses.splice(courses.indexOf(course), 1);
        localStorage.setItem('selected-courses', JSON.stringify(courses));

        return courses;
    }


    const state = {
        data: await fetchCourses(),
        periods: {},
        periodList: [
            '1A',
            '1B',
            '2A',
            '2B',
            '3A',
            '3B',
            '4A',
            '4B',
            '5A',
            '5B'
        ],
        selected: getSelectedCourses(),
        selectedFriend: []
    }

    console.log(state.selected);

    const CONTAINER = document.getElementById('container');
    const YOU_FIELD = document.getElementById('you-field');
    const FRIEND_FIELD = document.getElementById('friend-field');
    const COPY_BUTTON = document.getElementById('copy-button');
    const APPLY_BUTTON = document.getElementById('apply-button');

    const Render = () => {
        state.periods = {};
        CONTAINER.replaceChildren([]);
        console.log('Rendering..');

        state.data.periodit.forEach((period, index) => {

            if (state.periods[period.periodi] == null) {
                const periodElement = document.createElement('div');
                periodElement.className = "period";
                periodElement.id = period.periodi;

                const titleElement = document.createElement('h3');
                titleElement.textContent = `${period.periodi}. Periodi (Otaniemen lukio 2022 - 2023)`;

                periodElement.appendChild(titleElement);

                state.periods[period.periodi] = periodElement;
            }

            const periodElement = state.periods[period.periodi];
            const barElement = document.createElement('div');
            barElement.className = 'bar';

            const numberElement = document.createElement('h1');
            numberElement.textContent = `${(index % 9) + 1}: `;

            barElement.appendChild(numberElement);

            period.kurssit.forEach(course => {
                const courseElement = document.createElement('div');
                courseElement.id = state.selected.includes(course.nimi) ? 'course-selected' : state.selectedFriend.includes(course.nimi) ? 'course-friend' : 'course';
                courseElement.className = course.class;
                const nameElement = document.createElement('h2');
                nameElement.textContent = course.nimi;
                courseElement.appendChild(nameElement);

                const detailElement = document.createElement('span');
                detailElement.className = 'detail';
                detailElement.innerHTML = course.tiedot.join('<br>');

                courseElement.appendChild(detailElement);

                barElement.appendChild(courseElement);
            });

            periodElement.appendChild(barElement);
        });

        state.periodList.forEach(key => {
            CONTAINER.appendChild(state.periods[key]);
        });

        YOU_FIELD.value = JSON.stringify(state.selected);
    }

    Render();

    document.addEventListener('click', (e) => {
        const allowed = ['course', 'course-selected']
        if (!allowed.includes(e.target.id)) return;
        const course = e.target.children[0].textContent;

        if (state.selected.includes(course)) {
            state.selected = removeSelectedCourse(course);
        }
        else {
            state.selected = setSelectedCourse(course);
        }

        Render();
    });

    COPY_BUTTON.addEventListener('click', () => {
        navigator.clipboard.writeText(YOU_FIELD.value);
    });

    APPLY_BUTTON.addEventListener('click', () => {
        state.selectedFriend = JSON.parse(FRIEND_FIELD.value);
        Render();
    });

}