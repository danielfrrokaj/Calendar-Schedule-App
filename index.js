// Course management
class CourseManager {
    constructor() {
        this.courses = [];
        this.courseCount = 0;
        this.initializeElements();
        this.addInitialCourse();
        this.initializeEventListeners();
        this.updateCalendarIcon();
    }

    initializeElements() {
        this.coursesContainer = document.getElementById('coursesContainer');
        this.addCourseBtn = document.getElementById('addCourseBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.courseTemplate = document.getElementById('courseTemplate');
    }

    initializeEventListeners() {
        this.addCourseBtn.addEventListener('click', () => this.addCourseForm());
        this.nextBtn.addEventListener('click', () => this.handleNextButtonClick());
    }

    addCourseForm() {
        this.courseCount++;
        const courseElement = this.courseTemplate.content.cloneNode(true);
        
        // Set course number
        courseElement.querySelector('.course-number').textContent = `Lënda ${this.courseCount}`;
        
        this.setupFormValidation(courseElement);
        this.setupRemoveButton(courseElement);
        this.coursesContainer.appendChild(courseElement);
    }

    setupFormValidation(courseElement) {
        const form = courseElement.querySelector('.course-form');
        const inputs = form.querySelectorAll('input[required], select[required]');
        
        // Add input validation listeners
        inputs.forEach(input => {
            input.addEventListener('input', () => this.validateInput(input));
            input.addEventListener('blur', () => this.validateInput(input));
        });

        // Add time validation
        const startTime = form.querySelector('.course-start-time');
        const endTime = form.querySelector('.course-end-time');
        [startTime, endTime].forEach(input => {
            input.addEventListener('change', () => this.validateTimeRange(startTime, endTime));
        });
    }

    setupRemoveButton(courseElement) {
        const removeBtn = courseElement.querySelector('.remove-course');
        removeBtn.addEventListener('click', () => {
            const container = removeBtn.closest('.course-container');
            if (this.coursesContainer.children.length > 1) {
                this.animateAndRemoveCourse(container);
            } else {
                this.showError('Duhet të keni të paktën një kurs!');
            }
        });
    }

    animateAndRemoveCourse(container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';
        setTimeout(() => {
            container.remove();
            this.updateCourseNumbers();
        }, 300);
    }

    updateCourseNumbers() {
        const containers = this.coursesContainer.querySelectorAll('.course-container');
        containers.forEach((container, index) => {
            container.querySelector('.course-number').textContent = `Lënda ${index + 1}`;
        });
        this.courseCount = containers.length;
    }

    validateInput(input) {
        const isValid = input.checkValidity();
        input.classList.toggle('is-invalid', !isValid);
    }

    validateTimeRange(startInput, endInput) {
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

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger alert-dismissible fade show';
        errorDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.main-container').insertBefore(errorDiv, this.coursesContainer);
        setTimeout(() => errorDiv.remove(), 5000);
    }

    collectCourseData() {
        const courseForms = document.querySelectorAll('.course-form');
        let isValid = true;
        let newCourses = [];

        courseForms.forEach(form => {
            if (!this.validateForm(form)) {
                isValid = false;
                return;
            }

            if (isValid) {
                newCourses.push(this.extractCourseData(form));
            }
        });

        if (isValid) {
            this.courses = newCourses;
            return true;
        }
        
        this.showError('Ju lutem korrigjoni gabimet në formular.');
        return false;
    }

    validateForm(form) {
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
        if (!this.validateTimeRange(startTime, endTime)) {
            isValid = false;
        }

        return isValid;
    }

    extractCourseData(form) {
        return {
            courseName: form.querySelector('.course-name').value.trim(),
            day: form.querySelector('.course-day').value,
            startTime: form.querySelector('.course-start-time').value,
            endTime: form.querySelector('.course-end-time').value,
            professor: form.querySelector('.course-professor').value.trim(),
            room: form.querySelector('.course-room').value.trim()
        };
    }

    handleNextButtonClick() {
        if (this.collectCourseData()) {
            localStorage.setItem('courseData', JSON.stringify(this.courses));
            window.location.href = 'semester-end.html';
        }
    }

    updateCalendarIcon() {
        const months = ['Jan', 'Shk', 'Mar', 'Pri', 'Maj', 'Qer', 
                       'Kor', 'Gus', 'Sht', 'Tet', 'Nën', 'Dhj'];
        const now = new Date();
        const month = months[now.getMonth()];
        const day = now.getDate();

        document.querySelector('.calendar-month').textContent = month;
        document.querySelector('.calendar-day').textContent = day;
    }

    addInitialCourse() {
        this.addCourseForm();
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CourseManager();
});
