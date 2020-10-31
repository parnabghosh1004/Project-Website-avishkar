document.getElementById('resetPassword').addEventListener('submit', (e) => {
    e.preventDefault()

    let email = document.getElementById('email').value

    fetch(`/reset-password`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email
        })
    }).then(res => res.json())
        .then(data => {
            if (data.error) console.log(data.error)
            else {
                window.location.href = `${window.location.origin}/signin`
            }
        }).catch(e => {
            console.log(e)
        })

})