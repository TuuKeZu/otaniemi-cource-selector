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

    const Render = (periodID = String) => {

        // Initializing the period-containers
        if (state.periods[periodID] == null) {
            const periodElement = document.createElement('div');
            periodElement.className = "period";
            periodElement.id = periodID;

            state.periods[periodID] = periodElement;
            CONTAINER.appendChild(state.periods[periodID]);
        }

        // Access the period we wish to render and clear the children of it
        const periodElement = state.periods[periodID];
        periodElement.replaceChildren([]);

        // Appending title to the period
        const titleElement = document.createElement('h3');
        titleElement.textContent = `${periodID}. Periodi (Otaniemen lukio 2022 - 2023)`;
        periodElement.appendChild(titleElement);

        // Loop through every bar in the period
        state.data.periodit.filter(period => period.periodi == periodID).forEach((bar, index) => {
            // Create the bar element
            const barElement = document.createElement('div');
            barElement.className = 'bar';

            // Creathe index for the bar
            const numberElement = document.createElement('h1');
            numberElement.textContent = `${(index % 9) + 1}: `;
            barElement.appendChild(numberElement);

            // Loop through every course in the bar
            bar.kurssit.forEach(course => {
                // Create the course element
                const courseElement = document.createElement('div');
                courseElement.id = state.selected.includes(course.nimi) ? 'course-selected' : state.selectedFriend.includes(course.nimi) ? 'course-friend' : 'course';
                courseElement.className = course.class;

                // Create the <h4> tha displays the course name
                const nameElement = document.createElement('h2');
                nameElement.textContent = course.nimi;
                courseElement.appendChild(nameElement);

                // Create the detail section for each course.
                const detailElement = document.createElement('span');
                detailElement.className = 'detail';
                detailElement.innerHTML = course.tiedot.join('<br>');
                courseElement.appendChild(detailElement);

                // Append the course to the bar
                barElement.appendChild(courseElement);
            });

            // Append the bar to the period
            periodElement.appendChild(barElement);
        });

        // Update your current selections
        YOU_FIELD.value = JSON.stringify(state.selected);
    }

    // Initialize by rendering everything
    state.periodList.forEach(key => {
        Render(key);
    });

    document.addEventListener('click', (e) => {
        const allowed = ['course', 'course-selected']
        if (!allowed.includes(e.target.id)) return;
        const course = e.target.children[0].textContent;
        const period = e.target.parentNode.parentNode.id;

        if (state.selected.includes(course)) {
            state.selected = removeSelectedCourse(course);
        }
        else {
            state.selected = setSelectedCourse(course);
        }

        Render(period);
    });

    COPY_BUTTON.addEventListener('click', () => {
        navigator.clipboard.writeText(YOU_FIELD.value);
    });

    APPLY_BUTTON.addEventListener('click', () => {
        state.selectedFriend = JSON.parse(FRIEND_FIELD.value);
        Render();
    });

}