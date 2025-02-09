document.addEventListener('DOMContentLoaded', function() {
    // Logout button event listener
    document.getElementById("logout-btn").addEventListener("click", function() {
        window.location.href = "/logout";
    })

    // Add a confirmation dialog for the update form
    const updateForm = document.querySelector('#updateForm')
    if (updateForm) {
        updateForm.addEventListener('submit', (event) => {
            const confirmed = window.confirm('Are you sure you want to update this task?')
            if (!confirmed) {
                event.preventDefault() // Prevent the form from being submitted
            }
        })
    }

    // Confirmation for Complete button
    const completeButtons = document.querySelectorAll('.complete-task-form')
    completeButtons.forEach((form) => {
        form.addEventListener('submit', (event) => {
            const confirmed = window.confirm(`Are you sure you want to mark the task as Complete?`)
            if (!confirmed) {
                event.preventDefault()
            }
        })
    })

    // Confirmation for Cancel button
    const cancelButtons = document.querySelectorAll('.cancel-task-form')
    cancelButtons.forEach((form) => {
        form.addEventListener('submit', (event) => {
            const confirmed = window.confirm(`Are you sure you want to Cancel the task?`)
            if (!confirmed) {
                event.preventDefault()
            }
        })
    })
})
