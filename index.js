<<<<<<< HEAD
// DOM Elements
const coursesContainer = document.getElementById('coursesContainer');
const addCourseBtn = document.getElementById('addCourseBtn');
const nextBtn = document.getElementById('nextBtn');
const courseTemplate = document.getElementById('courseTemplate');

// State
let courses = [];
let courseCount = 0;

// Course Management Functions
function addCourseForm() {
    courseCount++;
    const courseElement = courseTemplate.content.cloneNode(true);
    
    setupCourseElement(courseElement);
    coursesContainer.appendChild(courseElement);
}

function setupCourseElement(courseElement) {
    // Set course number
    courseElement.querySelector('.course-number').textContent = `Lënda ${courseCount}`;
    
    // Setup form validation
    const form = courseElement.querySelector('.course-form');
    setupFormValidation(form);
    
    // Setup time validation
    setupTimeValidation(form);
    
    // Setup remove functionality
    setupRemoveButton(courseElement);
}

function setupFormValidation(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('input', validateInput);
        input.addEventListener('blur', validateInput);
    });
}

function setupTimeValidation(form) {
    const startTime = form.querySelector('.course-start-time');
    const endTime = form.querySelector('.course-end-time');
    [startTime, endTime].forEach(input => {
        input.addEventListener('change', () => validateTimeRange(startTime, endTime));
    });
}

function setupRemoveButton(courseElement) {
    const removeBtn = courseElement.querySelector('.remove-course');
    removeBtn.addEventListener('click', function() {
        const container = this.closest('.course-container');
        if (coursesContainer.children.length > 1) {
            animateAndRemoveCourse(container);
        } else {
            showError('Duhet të keni të paktën një kurs!');
        }
    });
}

function animateAndRemoveCourse(container) {
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    setTimeout(() => {
        container.remove();
        updateCourseNumbers();
    }, 300);
}

function updateCourseNumbers() {
    const containers = coursesContainer.querySelectorAll('.course-container');
    containers.forEach((container, index) => {
        container.querySelector('.course-number').textContent = `Lënda ${index + 1}`;
    });
    courseCount = containers.length;
}

// Validation Functions
function validateInput(event) {
    const input = event.target;
    const isValid = input.checkValidity();
    input.classList.toggle('is-invalid', !isValid);
}

function validateTimeRange(startInput, endInput) {
    const startTime = startInput.value;
    const endTime = endInput.value;

    if (startTime && endTime) {
        const isValid = startTime < endTime;
        endInput.classList.toggle('is-invalid', !isValid);
        if (!isValid) {
            endInput.nextElementSibling.textContent = 'Ora e mbarimit duhet të jetë pas orës së fillimit';
        }
        return isValid;
    }
    return true;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.main-container').insertBefore(errorDiv, coursesContainer);
    setTimeout(() => errorDiv.remove(), 5000);
}

// Data Collection
function collectCourseData() {
    const courseForms = document.querySelectorAll('.course-form');
    let isValid = true;
    let newCourses = [];

    courseForms.forEach(form => {
        if (validateForm(form)) {
            newCourses.push(getCourseData(form));
        } else {
            isValid = false;
        }
    });

    if (isValid) {
        courses = newCourses;
        return true;
    }
    
    showError('Ju lutem korrigjoni gabimet në formular.');
    return false;
}

function validateForm(form) {
    let isValid = true;
    
    // Validate required fields
    const requiredInputs = form.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
        const valid = input.checkValidity();
        input.classList.toggle('is-invalid', !valid);
        if (!valid) isValid = false;
    });

    // Validate time range
    const startTime = form.querySelector('.course-start-time');
    const endTime = form.querySelector('.course-end-time');
    if (!validateTimeRange(startTime, endTime)) {
        isValid = false;
    }

    return isValid;
}

function getCourseData(form) {
    return {
        courseName: form.querySelector('.course-name').value.trim(),
        day: form.querySelector('.course-day').value,
        startTime: form.querySelector('.course-start-time').value,
        endTime: form.querySelector('.course-end-time').value,
        professor: form.querySelector('.course-professor').value.trim(),
        room: form.querySelector('.course-room').value.trim()
    };
}

// Calendar Functions
function updateCalendarIcon() {
    const months = ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 
                   'Kor', 'Gus', 'Sht', 'Tet', 'Nën', 'Dhj'];
    const now = new Date();
    const month = months[now.getMonth()];
    const day = now.getDate();

    document.querySelector('.calendar-month').textContent = month;
    document.querySelector('.calendar-day').textContent = day;
}

// Event Listeners
function initializeEventListeners() {
    addCourseBtn.addEventListener('click', addCourseForm);
    nextBtn.addEventListener('click', function() {
        if (collectCourseData()) {
            localStorage.setItem('courseData', JSON.stringify(courses));
            window.location.href = 'semester-end.html';
        }
    });
}

// Initialization
function initialize() {
    updateCalendarIcon();
    initializeEventListeners();
    addCourseForm(); // Add initial course form
}

// Start the application
document.addEventListener('DOMContentLoaded', initialize);
=======
>>>>>>> parent of 21048c6 (code cleaned and some details changed)
