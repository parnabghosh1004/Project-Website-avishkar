let signupForm = document.getElementById('signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    let firstName = document.getElementById('firstName').value
    let lastName = document.getElementById('lastName').value
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
    let confirmPassword = document.getElementById('confirmPassword').value

    if (password !== confirmPassword) {
        console.log('error')
    }

    else {

        fetch('/signup', {
            method: "post",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName,
                lastName,
                password,
                email,
                pic: undefined,
                pic_id: undefined
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    document.getElementById('firstName').value = ""
                    document.getElementById('lastName').value = ""
                    document.getElementById('email').value = ""
                    document.getElementById('password').value = ""
                    document.getElementById('confirmPassword').value = ""
                    document.querySelector('.toast-head').innerText = "Error !"
                    document.querySelector('.toast-body').innerText = data.error
                    $(document).ready(() => {
                        $('.toast').toast('show')
                    })
                }
                else {
                    window.location.href = `${window.location.origin}/signin`
                }

            })
            .catch(e => console.log(e))
    }
})